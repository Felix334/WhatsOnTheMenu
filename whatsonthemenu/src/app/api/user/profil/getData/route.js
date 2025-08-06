import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(req) {
  var data = await req.json();
  if (!data) {
    return NextResponse.json({ status: 400 });
  }
  console.log("Empfangene Daten", data);
  const id = data.userID;
  console.log("UserID suchen:", id)
  const role = await prisma.user.findUnique({
    where: {
      id: 
        id
      ,
    },
  });
  if (role && role === "Owner") {
    return NextResponse({ msg: true, status: 200 });
  }
}

async function main(ID) {
  var id = id;
  console.log("Checke UserID:");
  const role = await prisma.user.findUnique({
    where: {
      id: ID
    }
  })
}
