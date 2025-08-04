import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient()

export default async function POST(req) {
    var data = await req.body();
    console.log("Empfangene Daten",data);
    var id = data.id;
    const role = await prisma.user.findUnique({
        where: {
            id: id
        }
    })
    if (role) {
        if(role.role === "Admin"){
            return new Response({msg: true, status: 200})
        }
    }
}