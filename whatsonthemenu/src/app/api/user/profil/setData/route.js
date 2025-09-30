import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@/generated/prisma";
const cryptoJS = require("crypto-js")

const prisma = new PrismaClient();

export default async function handler(req, res) {
    var enc_data = req.body.json();
    if(enc_data){
        var data = enc_data
    }
}

async function decrypt_data(enc_data) {
    var decrypt_data = cryptoJS.AES.decrypt(enc_data, process.env.NEXT_PUBLIC_ENCRYPTION_KEY)
}

async function data() {
    try{

    }catch(err){
        console.error("Ein Fehler ist aufgetreten: ",err)
        throw err
    }finally{
        prisma.$disconnect();
    }
}