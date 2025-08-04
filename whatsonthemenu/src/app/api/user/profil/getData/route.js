import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@/generated/prisma";

export default async function POST(req) {
    var data = req.body();
    console.log(data);
}