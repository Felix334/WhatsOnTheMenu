import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import * as CryptoJS from "crypto-js";
import path from "path"
import fs from "fs"
import multer from 'multer';

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


async function saveImgData(img_data){
    const storage = multer.diskStorage({
        destination: (req, file, cb) => {
            const uploadDir = path.join(process.cwd(), 'img');
            if(!fs.existsSync(uploadDir)){
                fs.mkdirSync(uploadDir, {recursive: true});
            }
            cb(null, uploadDir)
        },
        filename: (req, file, cb) => {
            const uniqueSuffix = Date.now() + ''
        }
    })
}