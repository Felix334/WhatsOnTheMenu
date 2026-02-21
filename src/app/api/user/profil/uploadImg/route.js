import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase"

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
    const { data, error } = await supabase.storage.form("images").upload("user_images", formData.image)
    if(error){
        console.error("Ein Fehler ist aufgetreten:", error);
        return NextResponse.json({status: 401, message: `Ein Supabase-Fehler ist aufgetreten: ${error}`})
    }
}