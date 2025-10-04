import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import * as CryptoJS from "crypto-js";

const prisma = new PrismaClient();

export default async function handler(req, res) {
    var enc_data = req.body();
    if(enc_data){
        var data = decyrpt_data(enc_data);
    }
}