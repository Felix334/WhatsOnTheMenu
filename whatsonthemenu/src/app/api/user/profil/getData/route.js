import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(req) {
  var data = await req.json();
  if (!data) {
    return NextResponse.json({ status: 400 });
  }
  console.log("Empfangene Daten", data);
  var id = data.id;
  const role = await prisma.user.findUnique({
    where: {
      id: id,
    },
  });
  if (role && role === "Owner") {
    return NextResponse({ msg: true, status: 200 });
  }
}

async function main(id) {
  var id = id;
  console.log("Checke UserID:");
}
