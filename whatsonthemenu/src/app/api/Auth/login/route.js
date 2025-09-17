import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
const cryptoJS = require("crypto-js");

const prisma = new PrismaClient();

export async function POST(req) {
  try {
    const encrypted_data = await req.json();
    console.log(encrypted_data);
    if (!encrypted_data) {
      return NextResponse.json({ message: "No data received" }, { status: 400 });
    }

    const { email, password, userIP, status } = await decrypt(encrypted_data);
    if (status == 401) {
      return NextResponse.json({ status: 401, message: "Not Authorized" });
    }
    console.log("API-KEY:", process.env.NEXT_PUBLIC_API_KEY);
    console.log("Received Data:", encrypted_data);

    const result = await main({ email, password, userIP });
    if (result && result.userID) {
      return NextResponse.json({ message: "Login Successful", id: result.userID, role: result.role }, { status: 200 });
    } else {
      const { error, status } = result || {};
      return NextResponse.json({ message: "Login Failed" }, { status: 401, databaselog: { message: error, status: status } });
    }
  } catch (error) {
    console.error("Error in POST handler:", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}

async function decrypt(data) {
  const { encrypted_email, encrypted_password, encrypted_IP, encrypted_API_KEY } = data;
  console.log("Test Decrypt Function", encrypted_email, encrypted_password, encrypted_IP, encrypted_API_KEY);

  // Decrypt the values
  const email = cryptoJS.AES.decrypt(encrypted_email, process.env.NEXT_PUBLIC_ENCRYPTION_KEY).toString(cryptoJS.enc.Utf8);
  const password = cryptoJS.AES.decrypt(encrypted_password, process.env.NEXT_PUBLIC_ENCRYPTION_KEY).toString(cryptoJS.enc.Utf8);
  const userIP = cryptoJS.AES.decrypt(encrypted_IP, process.env.NEXT_PUBLIC_ENCRYPTION_KEY).toString(cryptoJS.enc.Utf8);
  const key = cryptoJS.AES.decrypt(encrypted_API_KEY, process.env.NEXT_PUBLIC_ENCRYPTION_KEY).toString(cryptoJS.enc.Utf8);
  console.log("Decrypted Data(server):", email, password, userIP, key);
  // Check if the decrypted key matches the expected API key
  if (key === process.env.NEXT_PUBLIC_API_KEY) {
    return { email, password, userIP };
  } else {
    throw new Error("Invalid API Key");
  }
}

async function main(data) {
  const { email, password, userIP } = data;
  console.log("Checking user with email, password and IP:", email, password, userIP);
  try {
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      console.log("User  not found");
      return null;
    }

    if (user.password !== password) {
      console.log("Password mismatch");
      return null;
    }

    console.log("User  authenticated:", user.id, user.role);
    return { userID: user.id, role: user.role };
  } catch (err) {
    console.error("An error occurred:", err);
    return { error: err.message, status: 500 };
  } finally {
    prisma.$disconnect();
  }
}
