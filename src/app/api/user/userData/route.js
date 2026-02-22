import { NextResponse, NextRequest } from "next/server";
import { prisma } from "src/lib/prisma";
const cryptoJS = require("crypto-js");


export async function POST(req) {
  console.log("Ping");
  var data = await req.json();
  console.log("Empfangene Daten: ",data);

  if (!data || Object.keys(data).length === 0) {
    return NextResponse.json({ status: 400 });
  }

  const { encrypted_user_id, encrypted_api_key, encrypted_data} = data;
  var userID = cryptoJS.AES.decrypt(encrypted_user_id, process.env.NEXT_PUBLIC_ENCRYPTION_KEY).toString(cryptoJS.enc.Utf8);
  var api_key = cryptoJS.AES.decrypt(encrypted_api_key, process.env.NEXT_PUBLIC_ENCRYPTION_KEY).toString(cryptoJS.enc.Utf8);
  console.log("UserID: ",userID, "API_KEY:", api_key)

  if (encrypted_data) {
    var decrypted_data = cryptoJS.AES.decrypt(encrypted_data, process.env.NEXT_PUBLIC_ENCRYPTION_KEY).toString(cryptoJS.enc.Utf8);
    console.log("Decrypted Data:", decrypted_data)
  }

  if (api_key === process.env.NEXT_PUBLIC_API_KEY) {
    var user_data = await main(userID, decrypted_data);
    console.log("Benutzerdaten:",user_data)

    return NextResponse.json({ status: 200, data: user_data });
  } else {
    console.error("Nicht autorisierter Zugriff erkannt! Kein API_Key vorhanden!");
  }
}

async function main(ID, data) {
  try {
    var CheckUser = await prisma.user.findUnique({
      where: {
        id: ID,
      },
    });

    if (!CheckUser ) {
      throw new Error("User not found");
    }

    if (CheckUser.role === "Admin" && !data) {
      var user_list = await prisma.user.findMany({
        take: 20,
        skip: 0,
      });

      if(user_list){
        console.log(user_list);
        return user_list
      }
    } else if (CheckUser.role === "Admin" && data) {
      return await prisma.user.findMany({
        where: {
          name: {
            contains: data.name,
            mode: 'insensitive',
          },
          role: "Owner",
        },
      });
    }
  } catch (e) {
    console.log("Database Error", e);
  } finally {
    console.log()
    await prisma.$disconnect();
  }
}
