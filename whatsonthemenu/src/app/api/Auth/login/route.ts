/*
import { NextRequest, NextResponse } from "next/server"; import { PrismaClient } from "generated/prisma/client"; import * as CryptoJS from "crypto-js"; import NextAuth from "next-auth"; import GithubProvider from "next-auth/providers/github"; import EmailProvider from "next-auth/providers/email"; import GoogleProvider from "next-auth/providers/google"; import FacebookProvider from "next-auth/providers/facebook"; import CredentialsProvider from "next-auth/providers/credentials"; import { PrismaAdapter } from "@next-auth/prisma-adapter"; //import { prisma } from "@/lib/prisma"; import bcrypt from "bcryptjs";
*/
import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "generated/prisma/client";
import CryptoJS from "crypto-js";
import bcrypt from "bcryptjs";

/* ------------------------------------------------------------------ */
/* Prisma Client (Accelerate)                                          */
/* ------------------------------------------------------------------ */

const accelerateUrl = process.env.DATABASE_URL;

if (!accelerateUrl) {
  console.error("USERNAME_LOGIN: DATABASE_URL is not defined");
  throw new Error("USERNAME_LOGIN: DATABASE_URL is not defined");
}

const prisma = new PrismaClient({
  accelerateUrl,
  errorFormat: "pretty",
});

/* ------------------------------------------------------------------ */
/* Types                                                               */
/* ------------------------------------------------------------------ */

interface EncryptedData {
  encrypted_email: string;
  encrypted_password: string;
  encrypted_IP: string;
  encrypted_API_KEY: string;
}

interface AuthData {
  email: string;
  password: string;
  userIP: string;
}

type MainResult = { userID: string; role: string } | { error: string; status: number };

/* ------------------------------------------------------------------ */
/* POST Handler                                                        */
/* ------------------------------------------------------------------ */

export async function POST(req: NextRequest) {
  try {
    const encryptedData: EncryptedData = await req.json();

    const decrypted = decrypt(encryptedData);
    if ("status" in decrypted) {
      return NextResponse.json({ message: "Not Authorized" }, { status: 401 });
    }

    const result = await main(decrypted);

    if ("error" in result) {
      return NextResponse.json({ message: result.error }, { status: result.status });
    }

    return NextResponse.json({
      message: "Login Successful",
      id: result.userID,
      role: result.role,
    });
  } catch (err) {
    console.error("USERNAME_LOGIN ERROR:", err);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}

/* ------------------------------------------------------------------ */
/* Decrypt                                                             */
/* ------------------------------------------------------------------ */

function decrypt(data: EncryptedData): AuthData | { status: 401 } {
  const encryptionKey = process.env.ENCRYPTION_KEY;
  const apiKey = process.env.INTERNAL_API_KEY;

  if (!encryptionKey || !apiKey) {
    console.error("Missing ENCRYPTION_KEY or INTERNAL_API_KEY");
    return { status: 401 };
  }

  const email = CryptoJS.AES.decrypt(data.encrypted_email, encryptionKey).toString(CryptoJS.enc.Utf8);

  const password = CryptoJS.AES.decrypt(data.encrypted_password, encryptionKey).toString(CryptoJS.enc.Utf8);

  const userIP = CryptoJS.AES.decrypt(data.encrypted_IP, encryptionKey).toString(CryptoJS.enc.Utf8);

  const providedKey = CryptoJS.AES.decrypt(data.encrypted_API_KEY, encryptionKey).toString(CryptoJS.enc.Utf8);

  if (!email || !password || providedKey !== apiKey) {
    return { status: 401 };
  }

  return { email, password, userIP };
}

/* ------------------------------------------------------------------ */
/* Main Auth Logic                                                     */
/* ------------------------------------------------------------------ */

async function main(data: AuthData): Promise<MainResult> {
  const { email, password } = data;

  try {
    const user = await prisma.user.findUnique({
      where: { email },
    });

    /* -------------------------------------------------------------- */
    /* Auto-Register (optional)                                       */
    /* -------------------------------------------------------------- */
    if (!user) {
      const hashedPassword = await bcrypt.hash(password, 12);

      const newUser = await prisma.user.create({
        data: {
          email: email,
          password: hashedPassword,
          role: "User",
          name: "FelixMayer",
          image: "https://liebeart.de/cdn/shop/files/phoenix-aus-eis-und-feuer-malen-nach-zahlen.jpg?v=1731648615"
        },
      });

      return {
        userID: newUser.id,
        role: newUser.role,
      };
    }

    /* -------------------------------------------------------------- */
    /* Login                                                          */
    /* -------------------------------------------------------------- */
    if (!user.password) {
      return { error: "No password set", status: 401 };
    }

    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
      return { error: "Invalid credentials", status: 401 };
    }

    return {
      userID: user.id,
      role: user.role,
    };
  } catch (err) {
    console.error("DB ERROR:", err);
    return { error: "Database error", status: 500 };
  }
}
