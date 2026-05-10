import { prisma } from "@/lib/prisma";
import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";

async function authorize(req) {
  const [session, token] = await Promise.all([
    getServerSession(authOptions),
    getToken({ req, secret: process.env.NEXTAUTH_SECRET }),
  ]);
  if (!session || !token || token.role !== "Owner") return null;
  return token;
}

export async function POST(req){
    try{
        if (!await authorize(req)) {
            return NextResponse.json({ message: "Not Authorized" }, { status: 401 });
        }
        var data = await req.body();
        if(!data){
            return NextResponse.json({status: 404})
        }
        const {restaurantID, userID, font, bgColor, }
    }catch(err){
        console.log(err)
    }
}