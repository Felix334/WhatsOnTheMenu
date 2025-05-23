import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(req) {
  var data = await req.json();
  if(data){
    console.log("Daten empfangen:", data);
  var userID = await main(data)
  if(userID){
    return NextResponse.json({ message: "Login Successfull" }, {id: userID}, { status: 201 });
  }else{
    return NextResponse.json({ message: "Login Failed" }, { status: 401 });
  }
}
}

async function main() {
  var { email, password } = data;
    const user = await prisma.user.findUnique({ where: { email: email } });
    if(user.password == password){
      return userID = user.id;
    }
  }
  main()
    .catch((e) => {
      console.error(e);
      process.exit(1);
    })
    .finally(async () => {
      await prisma.$disconnect();
    });
