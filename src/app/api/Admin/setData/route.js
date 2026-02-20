import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import { NextResponse, NextRequest } from "next/server";

export async function POST(req) {
    var session = await getServerSession(authOptions)
    if(!session || session.role !== "Admin"){
        return NextResponse.status(401)
    }
    const data = await req.json();
    if(!data){
        return NextResponse.json({status: 400, message: "Keine Daten gesendet"})
    }
    if(!data.api_key || data.api_key !== process.env.API_KEY){
        return NextResponse.json({status: 401, message: "Invalid API key"})
    }

    // Process the data here (e.g., save to database, etc.)
    // For now, return success
    return NextResponse.json({status: 200, message: "Data processed successfully"})
}
