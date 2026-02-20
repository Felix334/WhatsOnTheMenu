import { NextResponse } from "next/server";

export async function POST(req) {
    const code = await req.json()
    console.log(code.data)
    if(code){
        return new NextResponse({status: 200})
    }
}