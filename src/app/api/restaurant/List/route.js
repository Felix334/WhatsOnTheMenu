import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma"

// Cache configuration - cache for 2 minutes at CDN level, revalidate after 5 minutes
export const dynamic = 'force-dynamic';

const CACHE_CONTROL = 'public, s-maxage=120, stale-while-revalidate=300';



export async function POST() {
  const data = await readDB()
  return NextResponse.json({status: 200, data: data}, {
    headers: {
      'Cache-Control': CACHE_CONTROL,
    },
  })
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
  }
}