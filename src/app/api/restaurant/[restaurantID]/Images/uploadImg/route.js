import { NextRequest, NextResponse } from "next/server";
import path from "path";
import { writeFile, mkdir } from "fs/promises";
import { prisma } from "src/lib/prisma";

export async function POST(
  req,
  { params }
) {
  const resolvedParams = await params;

  try {
    const data = await req.formData();
    const file = data.get("file");

    if (!file) {
      return NextResponse.json(
        { error: "Keine Datei vorhanden" },
        { status: 400 }
      );
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const fileName = `${Date.now()}-${file.name}`;

    const uploadDir = path.join(
      process.cwd(),
      "public",
      "uploads",
      "Restaurant",
      resolvedParams.restaurantID
    );

    await mkdir(uploadDir, { recursive: true });

    const filePath = path.join(uploadDir, fileName);

    await writeFile(filePath, buffer);

    const filePathUrl = `/uploads/Restaurant/${resolvedParams.restaurantID}/${fileName}`;

    return NextResponse.json({
      message: "Datei erfolgreich hochgeladen",
      filePath: filePathUrl,
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Hochladen fehlgeschlagen", details: err.message },
      { status: 500 }
    );
  }
}
