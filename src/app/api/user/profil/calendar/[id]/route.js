import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { assertCalendarAccess } from "@/lib/calendarAuth";
import { CALENDAR_DATE_HORIZON_DAYS, getCalendarMaxDate } from "@/lib/calendarLimits";
import { calendarEntrySchema } from "@/lib/schemas/calendar";

export async function PATCH(req, { params }) {
  try {
    const { id } = await params;
    const body = await req.json().catch(() => null);
    const { restaurantId } = body ?? {};
    if (!restaurantId) {
      return NextResponse.json({ message: "restaurantId is required" }, { status: 400 });
    }

    const access = await assertCalendarAccess(req, restaurantId);
    if (!access.ok) {
      return NextResponse.json({ message: access.message }, { status: access.status });
    }

    const parsed = calendarEntrySchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ message: parsed.error.issues[0]?.message ?? "Ungültige Daten" }, { status: 400 });
    }
    const data = parsed.data;

    const maxDate = getCalendarMaxDate(access.subscription);
    if (maxDate && data.date > maxDate) {
      return NextResponse.json({ message: `Im ${access.subscription}-Abo können Events nur bis zu ${CALENDAR_DATE_HORIZON_DAYS[access.subscription]} Tage im Voraus angelegt werden` }, { status: 403 });
    }
    if (maxDate && data.endDate && data.endDate > maxDate) {
      return NextResponse.json({ message: `Das Enddatum liegt außerhalb des im ${access.subscription}-Abo erlaubten Zeitraums` }, { status: 403 });
    }

    if (data.dishId) {
      const dish = await prisma.dish.findFirst({
        where: { id: data.dishId, category: { categoryGroup: { Menu: { restaurantId } } } },
        select: { id: true },
      });
      if (!dish) {
        return NextResponse.json({ message: "Gericht gehört nicht zu diesem Restaurant" }, { status: 400 });
      }
    }

    const result = await prisma.calendar.updateMany({
      where: { id, restaurantID: restaurantId },
      data: {
        eventName: data.eventName,
        eventDescription: data.eventDescription,
        date: data.date,
        endDate: data.endDate || null,
        startTime: data.startTime,
        endTime: data.endTime,
        type: data.type,
        dishId: data.dishId || null,
      },
    });

    if (result.count === 0) {
      return NextResponse.json({ message: "Eintrag nicht gefunden" }, { status: 404 });
    }

    const entry = await prisma.calendar.findUnique({
      where: { id },
      include: { dish: { select: { id: true, name: true } } },
    });

    return NextResponse.json({ entry });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}

export async function DELETE(req, { params }) {
  try {
    const { id } = await params;
    const restaurantId = req.nextUrl.searchParams.get("restaurantId");
    if (!restaurantId) {
      return NextResponse.json({ message: "restaurantId is required" }, { status: 400 });
    }

    const access = await assertCalendarAccess(req, restaurantId);
    if (!access.ok) {
      return NextResponse.json({ message: access.message }, { status: access.status });
    }

    const result = await prisma.calendar.deleteMany({
      where: { id, restaurantID: restaurantId },
    });

    if (result.count === 0) {
      return NextResponse.json({ message: "Eintrag nicht gefunden" }, { status: 404 });
    }

    return NextResponse.json({ message: "Eintrag gelöscht" });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
