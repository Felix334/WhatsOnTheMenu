import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import { NextResponse, NextRequest } from "next/server";

export async function POST(req) {
    var session = await getServerSession(authOptions)
    if(!session || session.user?.role !== "Admin"){
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }
    const data = await req.json();
    if(!data){
        return NextResponse.json({status: 400, message: "Keine Daten gesendet"})
    }
    // Process the data here (e.g., save to database, etc.)
    // For now, return success
    return NextResponse.json({status: 200, message: "Data processed successfully"})
}
