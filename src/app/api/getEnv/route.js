import { NextResponse } from "next/server";

export async function GET() {
  const myVar = process.env.TESTVAR_;
  console.log("Env:",myVar);
  
  return NextResponse.json({ "Env": myVar, "test2": "abc" });
}