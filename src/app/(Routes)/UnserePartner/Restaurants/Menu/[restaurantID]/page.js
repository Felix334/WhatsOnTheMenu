import { Suspense } from "react";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import MenuClient from "../components/MenuClient";

export const revalidate = 300;

const BASE_URL = process.env.NEXT_PUBLIC_URL || "https://www.whatisonmymenu.com";

// Alle Speisekarten schon beim Build vorrendern, damit auch der erste
// Besucher nach einem Deploy keinen kalten Server-Render abwartet.
// Nur beim Production-Build relevant — im Dev-Server sonst unnötige DB-Query bei jedem Request.
// Direkter Prisma-Zugriff ist hier unvermeidbar: generateStaticParams läuft
// beim `next build`, bevor die eigene API überhaupt erreichbar ist.
export async function generateStaticParams() {
  if (process.env.NODE_ENV !== "production") return [];
  try {
    const restaurants = await prisma.restaurant.findMany({ select: { id: true } });
    return restaurants.map((r) => ({ restaurantID: r.id }));
  } catch {
    // Ohne DB-Zugriff beim Build: Seiten entstehen beim ersten Aufruf (ISR)
    return [];
  }
}

// DB-Reads laufen über die eigene API-Route statt per Direktzugriff auf Prisma,
// damit Rate-Limiting/Caching am Edge (Cloudflare, an /api/* gebunden) auch für
// den Seitenaufruf greift. `fetch` wird von Next.js pro Request automatisch
// dedupliziert, daher kein extra cache()-Wrapper nötig.
async function fetchRestaurantMenuData(restaurantID) {
  const res = await fetch(`${BASE_URL}/api/restaurant/${restaurantID}/menu`, {
    next: { revalidate: 300 },
  });
  if (res.status === 404) return null;
  if (!res.ok) throw new Error("Fehler beim Laden der Speisekarte");
  return res.json();
}

export async function generateMetadata({ params }) {
  const { restaurantID } = await params;
  const data = await fetchRestaurantMenuData(restaurantID);
  if (!data) return { title: "Speisekarte" };
  return {
    title: `${data.name} – Speisekarte`,
    description: data.description || `Digitale Speisekarte von ${data.name} — jetzt ansehen und bestellen.`,
  };
}

export default async function MenuPage({ params }) {
  const { restaurantID } = await params;
  const data = await fetchRestaurantMenuData(restaurantID);
  if (!data) notFound();

  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
      <MenuClient serverData={data} />
    </Suspense>
  );
}
