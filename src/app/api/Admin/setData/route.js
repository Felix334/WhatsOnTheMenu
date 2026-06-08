import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";

export async function POST(req) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  if (!token || token.role !== "Admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const data = await req.json();
  if (!data) {
    return NextResponse.json({ status: 400, message: "Keine Daten gesendet" });
  }
  return NextResponse.json({ status: 200, message: "Data processed successfully" });
}
