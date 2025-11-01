import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import * as CryptoJS from "crypto-js";
import path from "path";
import fs from "fs";
import multer from "multer";

const prisma = new PrismaClient();

export async function POST(req) {
  var { userID, data } = await req.json();
    if (userID && data) {
      console.log(`Empfangene Daten: userID: ${userID}, Daten:`, data);  // data ist jetzt das Array
      // Verarbeite data als Array
      if (Array.isArray(data)) {
        data.forEach((item, index) => {
          console.log(`Item ${index}:`, item.section);
        });
      }

    // Daten werden empfangen aber printen nicht

    /*for (var i = -1; i < section.length; i++) {
      var print = section[i];
      console.log("Essen:", print);
    }*/
    return NextResponse.json({ status: 201, message: "Daten empfangen" });
  }
  /*var enc_data = await req.json();
    if(enc_data){
        console.log("Encrypted Data empfangen:", enc_data)
        var data = await decyrpt_data(enc_data);
        console.log(data);
        return NextResponse.json({status: 200})
    }else {
        return NextResponse.json({status: 500, message: "Keine Daten empfangen oder ungültiger Request"})
    }*/
}

async function decyrpt_data(enc_data) {
  var enc_user_id = enc_data.id;
}

async function saveImgData(img_data) {
  const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      const uploadDir = path.join(process.cwd(), "img");
      if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
      }
      cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
      const uniqueSuffix = Date.now() + "";
    },
  });
}
