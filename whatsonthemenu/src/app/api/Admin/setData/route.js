import { NextResponse, NextRequest } from "next/server";

export async function POST(req) {
    const data = await req.body();
    if(!data){
        return NextResponse.json({status: 400, message: "Keine Daten gesendet"})
    }
    if(!data.api_key || data.api_key !== process.env.API_KEY){
        return NextResponse.json
    }
}