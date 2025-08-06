import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient()

export default async function POST(req) {
    var data = await req.body();
    if(!data){
        return NextResponse.json({status:400,})
    }
    console.log("Empfangene Daten",data);
    var id = data.id;
    const role = await prisma.user.findUnique({
        where: {
            id: id
        }
    })
    if (role) {
        if(role.role === "Owner"){
            return NextResponse({msg: true, status: 200})
        }
    }
}