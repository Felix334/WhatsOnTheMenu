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
  var data = await main(id)
  if(data.status === 401){
    return NextResponse.json({ status: 401 });
  }
  return NextResponse.json({ status: 200, userData: data });
}

async function main(ID) {
  var id = id;
  console.log("Checke UserID:");
  const user = await prisma.user.findUnique({
    where: {
      id: ID
    }
  })
  if(user){
    console.log("User gefunden:", user);
    return user;
  }else{
    console.log("User nicht gefunden");
    return ({status: 401});
  }
}






// Connect mit Restaurant