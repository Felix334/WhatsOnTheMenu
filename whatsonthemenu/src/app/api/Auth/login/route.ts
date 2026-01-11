import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import * as CryptoJS from "crypto-js";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

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

type MainResult =
  | { userID: string; role: string }
  | { error: string; status: number }
  | null;

// Type guard to check if result is a success object
function isSuccessResult(result: MainResult): result is { userID: string; role: string } {
  return result !== null && "userID" in result && "role" in result;
}

// Type guard to check if result is an error object
function isErrorResult(result: MainResult): result is { error: string; status: number } {
  return result !== null && "error" in result && "status" in result;
}

export async function POST(req: NextRequest) {
  try {
    const encrypted_data: EncryptedData = await req.json();
    if (!encrypted_data) {
      return NextResponse.json({ message: "No data received" }, { status: 400 });
    }

    const decrypted = await decrypt(encrypted_data);
    const { email, password, userIP, status } = decrypted;
    if (status === 401) {
      return NextResponse.json({ status: 401, message: "Not Authorized" });
    }

    const result: MainResult = await main({ email, password, userIP });
    if (isSuccessResult(result)) {
      // Instead of setting cookie manually, return success message and user info
      return NextResponse.json({
        message: "Login Successful",
        id: result.userID,
        role: result.role,
      });
    } else {
      let errorMessage = "Login Failed";
      let errorStatus = 401;
      if (isErrorResult(result)) {
        errorMessage = result.error;
        errorStatus = result.status;
      }
      return NextResponse.json(
        {
          message: errorMessage,
          databaselog: { message: errorMessage, status: errorStatus },
        },
        { status: 401 }
      );
    }
  } catch (error) {
    console.error("Error in POST handler:", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}

async function decrypt(data: EncryptedData): Promise<AuthData & { status?: number }> {
  const encryptionKey = process.env.NEXT_PUBLIC_ENCRYPTION_KEY;
  if (!encryptionKey) {
    console.error("Encryption key is missing from environment variables");
    return { email: "", password: "", userIP: "", status: 500 };
  }

  const { encrypted_email, encrypted_password, encrypted_IP, encrypted_API_KEY } = data;

  const emailBytes = CryptoJS.AES.decrypt(encrypted_email, encryptionKey);
  const passwordBytes = CryptoJS.AES.decrypt(encrypted_password, encryptionKey);
  const userIPBytes = CryptoJS.AES.decrypt(encrypted_IP, encryptionKey);
  const keyBytes = CryptoJS.AES.decrypt(encrypted_API_KEY, encryptionKey);

  const email = emailBytes.toString(CryptoJS.enc.Utf8);
  const password = passwordBytes.toString(CryptoJS.enc.Utf8);
  const userIP = userIPBytes.toString(CryptoJS.enc.Utf8);
  const key = keyBytes.toString(CryptoJS.enc.Utf8);

  if (email && password && userIP && key && key === process.env.NEXT_PUBLIC_API_KEY) {
    return { email, password, userIP };
  } else {
    return { email: "", password: "", userIP: "", status: 401 };
  }
}

async function main(data: AuthData): Promise<MainResult> {
  const { email, password, userIP } = data;
  console.log("Checking user with email, password and IP:", email, password, userIP);
  try {
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      console.log("User not found");
      return null;
    }

    if (!user.password) {
      console.log("User has no password set");
      return null;
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      console.log("Password mismatch");
      return null;
    }

    console.log("User authenticated:", user.id, user.role);
    return { userID: user.id, role: user.role };
  } catch (err) {
    console.error("An error occurred:", err);
    return { error: (err as Error).message, status: 500 };
  } finally {
    await prisma.$disconnect();
  }
}
