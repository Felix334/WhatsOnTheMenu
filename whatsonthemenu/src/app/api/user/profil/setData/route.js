import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import * as CryptoJS from "crypto-js";

const prisma = new PrismaClient();

export default async function POST(req) {
    var enc_data = req.body();
    if(enc_data){
        var data = decyrpt_data(enc_data);
    }
}

async function decyrpt_data(enc_data) {
    var enc_user_id = enc_data.id
}