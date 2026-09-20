import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getToken } from "next-auth/jwt";
import { locales } from "@/i18n/config";

// Oberflaechensprache des eingeloggten Nutzers setzen.
//
// Bewusst ohne Rollenpruefung: jeder eingeloggte Nutzer darf seine eigene
// Sprache aendern — auch ein Kellner, dessen Chef auf Deutsch arbeitet. Die
// Schreiboperation ist hart auf `token.id` gefiltert, ein fremder Datensatz ist
// darueber nicht erreichbar.
//
// Die Sprache ist rein kosmetisch und traegt keine Berechtigung; trotzdem wird
// gegen die Whitelist geprueft, damit kein beliebiger String in der DB landet
// und spaeter als Schluessel in ein Woerterbuch wandert.

export async function POST(req) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  if (!token?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json().catch(() => null);
  const language = body?.language;

  if (typeof language !== "string" || !locales.includes(language)) {
    return NextResponse.json({ error: "Invalid language" }, { status: 400 });
  }

  try {
    await prisma.user.update({
      where: { id: token.id },
      data: { language },
    });
    return NextResponse.json({ language });
  } catch (err) {
    console.error("Language update failed:", err);
    return NextResponse.json({ error: "Update failed" }, { status: 500 });
  }
}
