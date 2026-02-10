import { NextRequest, NextResponse } from "next/server";

export default async function POST(req) {
  const data = await req.body;
  var { name, address, phone, website, openingHours, category, description } = data;
  if(!name || !address || !phone || !openingHours || !category || !description){
    return NextResponse.json({status: 401, message: "Etwas fehlt"})
  }
}
