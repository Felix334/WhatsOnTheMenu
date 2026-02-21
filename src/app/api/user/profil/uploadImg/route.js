import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { v4 as uuidv4 } from "uuid";
import { prisma } from "@/lib/prisma";

export async function POST(req) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user?.role !== "Owner") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Parse FormData instead of JSON
    const formData = await req.formData();
    console.log("Image-Files-Angekommen:", formData);

    const file = formData.get("image");
    let userID = formData.get("userID");
    let restaurantID = formData.get("restaurantID");
    console.log(`User-ID:${userID}, Restaurant-ID:${restaurantID}, file:${file}`)

    // If not provided in FormData, get from session
    if (!userID && session?.user?.id) {
      userID = session.user.id;
    }
    if (!restaurantID) {
      return NextResponse.json({ message: "Missing restaurantID" }, { status: 400 });
    }

    if (!file) {
      return NextResponse.json({ message: "Keine Datei vorhanden" }, { status: 400 });
    }

    const result = await processData(restaurantID, userID, file);

    if (!result.success) {
      return NextResponse.json({ message: result.error }, { status: 500 });
    }

    return NextResponse.json(
      {
        message: "Upload erfolgreich",
        path: result.path,
      },
      { status: 200 },
    );
  } catch (error) {
    console.error(error);

    return NextResponse.json({ message: "Server Fehler" }, { status: 500 });
  }
}

async function processData(restaurantID, userID, file) {
  try {
    const restaurant = await prisma.restaurant.findUnique({
      where: { id: restaurantID },
    });

    if (!restaurant || restaurant.ownerId !== userID) {
      return { success: false, error: "Unauthorized" };
    }

    if (!file) {
      return { success: false, error: "Keine Datei vorhanden" };
    }

    // Convert file to buffer for Supabase
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    
    // Get file extension from original filename
    const fileNameOriginal = file.name || "image.png";
    const fileExtension = fileNameOriginal.split(".").pop() || "png";
    const fileName = `${uuidv4()}.${fileExtension}`;

    const uploadPath = `ItemImages/${restaurantID}/${fileName}`;

    console.log("Uploading to Supabase:", uploadPath, "Content-Type:", file.type || "image/png");
    
    const { data, error } = await supabase.storage.from("images").upload(uploadPath, buffer, {
      contentType: file.type || "image/png",
    });

    console.log("Supabase upload result:", { data, error });

    if (error) {
      return { success: false, error: error.message };
    }

    // Get public URL for the uploaded file
    const { data: urlData } = supabase.storage.from("images").getPublicUrl(uploadPath);

    return {
      success: true,
      path: urlData.publicUrl,
    };
  } catch (err) {
    return { success: false, error: err.message };
  }
}
