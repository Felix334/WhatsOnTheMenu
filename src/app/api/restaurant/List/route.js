import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma"
import { getSession } from "next-auth/react";
import { getServerSession } from "next-auth";
//import { authOptions } from "../../auth/[...nextauth]/route";
import { authOptions } from '@/lib/auth';
import { error } from "console";



export async function POST(req) {
  const data = await readDB()
  return NextResponse.json({status: 200, data: data})
}

async function readDB() {
  try{
      const restaurantList = await prisma.restaurant.findMany()
  if(!restaurantList){
    return null
  }
  return restaurantList;
  }catch(err){
    console.error(err)
  }finally{
    await prisma.$disconnect();
  }
}