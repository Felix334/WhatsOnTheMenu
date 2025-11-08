import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import * as CryptoJS from "crypto-js";
import path from "path";
import fs, { truncateSync } from "fs";
//import multer from "multer";
import { Interface } from "readline";
import { tr } from "zod/v4/locales";
import { json } from "stream/consumers";

const prisma = new PrismaClient();

interface EncryptedData {
  encrypted_user_id: string;
  encrypted_restaurant_id: string;
  encrypted_data: string;  // Changed to string, assuming it's an encrypted string
  encrypted_api_key: string;
}

type Response = { status: number; userID: string; restaurantId: string; data: any; apiKey: string } | { error: string; status: number } | null;

function isSuccess(result: Response): result is { status: number; userID: string; restaurantId: string; data: any; apiKey: string } {
  return result !== null && "status" in result && "userID" in result;
}

function isError(result: Response): result is { error: string; status: number } {
  return result !== null && "error" in result && "status" in result;
}

export async function POST(req: NextRequest) {
  try {
    const encrypted_data: EncryptedData = await req.json();
    console.log("Daten Empfangen:", encrypted_data);
    if (!encrypted_data) {
      return NextResponse.json({ message: "Keine Daten empfangen" }, { status: 400 });
    }
    // Decrypt the data
    const decryptResult = await decryption(encrypted_data);
    if (isError(decryptResult)) {
      return NextResponse.json({ message: decryptResult.error }, { status: decryptResult.status });
    }
    // Assuming decrypted data contains userID and data array
    if (isSuccess(decryptResult)) {
      const { userID, data } = decryptResult;

      if (userID && data) {
        console.log(`Empfangene Daten: userID: ${userID}, Daten:`, data.section);
        if (Array.isArray(data)) {
          data.forEach((item, index) => {
            console.log(`Item ${index}:`, item.section);
          });
        }
        // Process and save data as needed, e.g., to Prisma
        // await prisma.someModel.create({ data: { ... } });
      }
    }
    return NextResponse.json({ status: 201, message: "Daten empfangen" });
  } catch (error) {
    console.log("Ein Fehler in der API ist aufgetreten: ", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}

async function decryption(data: EncryptedData): Promise<Response> {
  const encryptionKey = process.env.NEXT_PUBLIC_ENCRYPTION_KEY;
  console.log("Encryption Key Kontrolle(api):", encryptionKey)
  if (!encryptionKey) {
    console.error("Encryption-Key konnte nicht gelesen werden");
    return { error: "Encryption key not found", status: 500 };
  }

  try {
    const decryptedUserId = CryptoJS.AES.decrypt(data.encrypted_user_id, encryptionKey).toString(CryptoJS.enc.Utf8);
    const decryptedRestaurantId = CryptoJS.AES.decrypt(data.encrypted_restaurant_id, encryptionKey).toString(CryptoJS.enc.Utf8);
    const decryptedData = JSON.parse(CryptoJS.AES.decrypt(data.encrypted_data, encryptionKey).toString(CryptoJS.enc.Utf8));
    const decryptedApiKey = CryptoJS.AES.decrypt(data.encrypted_api_key, encryptionKey).toString(CryptoJS.enc.Utf8);

    // Return the decrypted data
    return ({
      userID: decryptedUserId,
      restaurantId: decryptedRestaurantId,
      data: decryptedData,
      apiKey: decryptedApiKey,
      status: 200
    });
  } catch (error) {
    console.error("Decryption failed:", error);
    return { error: "Decryption failed", status: 400 };
  }
}


/*
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
    }
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
    }
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
*/
