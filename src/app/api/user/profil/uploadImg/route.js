import { NextRequest, NextResponse } from "next/server";
import { createClient } from '@supabase/supabase-js'

const api_url = process.env.SUPABASE_API_URL

const supabase = createClient({
    api_url, 
})

export default async function POST(req) {
    const data = await req.json();
    if(!data){
        return NextResponse.json({status: 404, message: "Keine Daten gesendet!"});
    }
    const { api_key, userID, restaurantID, formData } = await data;
    if(!api_key || api_key === process.env.NEXT_PUBLIC_API_KEY){
        return NextResponse.json({status: 401, message: "Not Autherized"});
    }

    const resp = processData(userID, restaurantID, formData)

}

async function processData(userID, restaurantID, formData) {
    
}