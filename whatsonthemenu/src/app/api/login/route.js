import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

export async function POST(req){
    console.log("ApiPing")
    const data = await req.json();
    console.log("Daten empfangen", data);
    return NextResponse.json({
        status: 200,
    })
}