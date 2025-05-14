import { NextRequest, NextResponse } from "next/server";

export default async function POST(){
    const { username, password, id, key } = await req.json();
    console.log("Daten empfangen", username, password, id, key);
}