import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import { getToken } from "next-auth/jwt";

export async function POST(req) {
  try {
    const session = await getServerSession(authOptions);
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
    if (!session && !token) {
      return NextResponse.json({ message: "Unautherized" }, { status: 401 });
    }else {
        var body = await req
        if(body){
            var result = await processData(body)
        }
    }
  } catch (err) {
    console.log(err);
    return NextResponse.json({ status: 500 });
  }
}

async function processData(new_restataurant) {
    var data = new_restataurant;

    if(data){
        const searchRestaurant = await prisma.restaurant.findFirst({
            where: {
                locations: {
                    postalCode: new_restataurant.adress.postalCode,
                    street: new_restataurant.adress.street,
                    houseNumber: new_restataurant.adress.houseNumber
                }
            }
        })
        if(searchRestaurant){
            return(409)
        }
    }
}