import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import { randomUUID } from "node:crypto";
import sharp from "sharp";
import { prisma } from "@/lib/prisma";
import { supabaseAdmin, storagePublicUrl, removeStorageFiles } from "@/lib/supabase";
import {
  MENU_IMAGE_BUCKET,
  MENU_IMAGE_MAX_BYTES,
  MENU_IMAGE_TYPES,
  MENU_IMAGE_MAX_EDGE,
  MENU_IMAGE_SMALL_EDGE,
  MENU_IMAGE_QUALITY,
  MENU_IMAGE_MAX_INPUT_PIXELS,
  smallVariantPath,
  BG_IMAGE_SUBSCRIPTIONS,
  bgImageFolder,
  isBgImagePathOf,
} from "@/lib/schemas/menuImage";

// sharp braucht die Node-Runtime.
export const runtime = "nodejs";

// Was sharp tatsächlich im Inhalt erkennt — der vom Browser gemeldete MIME-Typ zählt nicht.
const ALLOWED_FORMATS = new Set(["jpeg", "png", "webp"]);

async function loadOwnedRestaurant(ownerId, restaurantId) {
  if (typeof restaurantId !== "string" || restaurantId.length === 0 || restaurantId.length > 64) return null;
  return prisma.restaurant.findFirst({
    where: { id: restaurantId, ownerId },
    select: {
      id: true,
      owner: { select: { subscription: true } },
      menu: { select: { bgImage: true } },
    },
  });
}

// Alte Bilder samt Handy-Fassung.
function oldImagePaths(restaurant, except) {
  return restaurant.menu
    .map((m) => m.bgImage)
    .filter((p) => p && p !== except && isBgImagePathOf(p, restaurant.id))
    .flatMap((p) => [p, smallVariantPath(p)]);
}

function encodeVariant(image, maxEdge) {
  return image
    .clone()
    .resize({ width: maxEdge, height: maxEdge, fit: "inside", withoutEnlargement: true })
    .webp({ quality: MENU_IMAGE_QUALITY })
    .toBuffer();
}

async function authorize(req) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  if (!token || token.role !== "Owner" || !token.id) return null;
  return token;
}

export async function POST(req) {
  const token = await authorize(req);
  if (!token) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

  if (!supabaseAdmin) {
    console.error("bgImage: SUPABASE_API_URL / SUPABASE_SERVICE_ROLE_KEY fehlen");
    return NextResponse.json({ message: "Bild-Upload ist derzeit nicht verfügbar" }, { status: 503 });
  }

  // Früh abbrechen, bevor ein zu großer Body eingelesen wird (Formular-Overhead eingerechnet).
  const declaredLength = Number(req.headers.get("content-length") || 0);
  if (declaredLength > MENU_IMAGE_MAX_BYTES + 64 * 1024) {
    return NextResponse.json({ message: "Bild ist zu groß (max. 4 MB)" }, { status: 413 });
  }

  let formData;
  try {
    formData = await req.formData();
  } catch {
    return NextResponse.json({ message: "Ungültige Anfrage" }, { status: 400 });
  }

  const file = formData.get("file");
  const restaurantId = formData.get("restaurantId");

  if (!(file instanceof Blob) || file.size === 0) {
    return NextResponse.json({ message: "Keine Datei erhalten" }, { status: 400 });
  }
  if (file.size > MENU_IMAGE_MAX_BYTES) {
    return NextResponse.json({ message: "Bild ist zu groß (max. 4 MB)" }, { status: 413 });
  }
  if (!MENU_IMAGE_TYPES.includes(file.type)) {
    return NextResponse.json({ message: "Nur JPG, PNG oder WebP erlaubt" }, { status: 415 });
  }

  try {
    const restaurant = await loadOwnedRestaurant(token.id, restaurantId);
    if (!restaurant) {
      return NextResponse.json({ message: "Restaurant not found or unauthorized" }, { status: 404 });
    }
    if (!BG_IMAGE_SUBSCRIPTIONS.includes(restaurant.owner.subscription)) {
      return NextResponse.json({ message: "Für Hintergrundbilder ist ein aktives Abo nötig" }, { status: 403 });
    }
    if (restaurant.menu.length === 0) {
      return NextResponse.json({ message: "Noch keine Speisekarte angelegt" }, { status: 409 });
    }

    // Neu kodieren statt die Originaldatei zu speichern: nur echte Bilder kommen
    // durch, EXIF-Daten (z. B. GPS) werden entfernt, Größe und Format sind einheitlich.
    // Zwei Fassungen: groß für Desktop, klein fürs Handy (spart den meisten Traffic).
    let large, small;
    try {
      const input = sharp(Buffer.from(await file.arrayBuffer()), { limitInputPixels: MENU_IMAGE_MAX_INPUT_PIXELS });
      const { format } = await input.metadata();
      if (!ALLOWED_FORMATS.has(format)) {
        return NextResponse.json({ message: "Nur JPG, PNG oder WebP erlaubt" }, { status: 415 });
      }
      const oriented = input.rotate(); // Ausrichtung aus EXIF übernehmen, bevor die Metadaten wegfallen
      [large, small] = await Promise.all([encodeVariant(oriented, MENU_IMAGE_MAX_EDGE), encodeVariant(oriented, MENU_IMAGE_SMALL_EDGE)]);
    } catch {
      return NextResponse.json({ message: "Die Datei ist kein gültiges Bild" }, { status: 415 });
    }

    // Pfad legt ausschließlich der Server fest; zufälliger Name, damit Caches
    // (Cloudflare, Browser) nach einem Austausch nie das alte Bild zeigen.
    const path = `${bgImageFolder(restaurant.id)}/${randomUUID()}.webp`;
    const newPaths = [path, smallVariantPath(path)];

    const bucket = supabaseAdmin.storage.from(MENU_IMAGE_BUCKET);
    const uploadOptions = { contentType: "image/webp", cacheControl: "31536000", upsert: false };
    const results = await Promise.all([bucket.upload(path, large, uploadOptions), bucket.upload(newPaths[1], small, uploadOptions)]);
    const uploadError = results.find((r) => r.error)?.error;

    if (uploadError) {
      console.error("bgImage upload failed:", uploadError.message);
      await removeStorageFiles(MENU_IMAGE_BUCKET, newPaths);
      return NextResponse.json({ message: "Bild konnte nicht gespeichert werden" }, { status: 502 });
    }

    try {
      await prisma.menu.updateMany({
        where: { restaurantId: restaurant.id, restaurant: { ownerId: token.id } },
        data: { bgImage: path },
      });
    } catch (dbError) {
      // Keine verwaisten Bilder im Bucket zurücklassen.
      await removeStorageFiles(MENU_IMAGE_BUCKET, newPaths);
      throw dbError;
    }

    await removeStorageFiles(MENU_IMAGE_BUCKET, oldImagePaths(restaurant, path));

    return NextResponse.json({ bgImageUrl: storagePublicUrl(MENU_IMAGE_BUCKET, path) });
  } catch (error) {
    console.error("bgImage POST error:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}

export async function DELETE(req) {
  const token = await authorize(req);
  if (!token) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

  try {
    const body = await req.json().catch(() => null);
    const restaurant = await loadOwnedRestaurant(token.id, body?.restaurantId);
    if (!restaurant) {
      return NextResponse.json({ message: "Restaurant not found or unauthorized" }, { status: 404 });
    }

    // Entfernen ist unabhängig vom Abo immer erlaubt.
    await prisma.menu.updateMany({
      where: { restaurantId: restaurant.id, restaurant: { ownerId: token.id } },
      data: { bgImage: null },
    });

    await removeStorageFiles(MENU_IMAGE_BUCKET, oldImagePaths(restaurant, null));

    return NextResponse.json({ bgImageUrl: null });
  } catch (error) {
    console.error("bgImage DELETE error:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
