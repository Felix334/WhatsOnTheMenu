import nodemailer from "nodemailer";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const { message } = await req.json(); 

    const transporter = nodemailer.createTransport({ // Ein Email Konto dafür erstellen
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: "felixmayer02@gmx.de",
      subject: "Neue Nachricht",
      text: message,
    });

    return NextResponse.json({ success: true }); // ❗ return fehlt
  } catch (error) {
    return NextResponse.json(
      { error: "Fehler beim Senden", message: error },
      { status: 500 }
    );
  }
}