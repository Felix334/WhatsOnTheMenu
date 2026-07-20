import { Suspense, cache } from "react";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getRestaurantMenuData } from "@/app/api/restaurant/[restaurantID]/menu/data";
import MenuClient from "../components/MenuClient";

export const revalidate = 300;

// Alle Speisekarten schon beim Build vorrendern, damit auch der erste
// Besucher nach einem Deploy keinen kalten Server-Render abwartet.
// Nur beim Production-Build relevant — im Dev-Server sonst unnötige DB-Query bei jedem Request.
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

// Direkter Aufruf der API-Datenschicht statt HTTP-Selbst-Fetch: generateMetadata
// und die Page-Komponente laufen für alle von generateStaticParams gelieferten
// IDs während `next build`, wenn der eigene Server noch nicht erreichbar ist —
// ein fetch() auf die eigene /api-Route würde den Build zum Absturz bringen.
const getRestaurantData = cache(getRestaurantMenuData);

export async function generateMetadata({ params }) {
  const { restaurantID } = await params;
  const data = await getRestaurantData(restaurantID);
  if (!data) return { title: "Speisekarte" };
  return {
    title: `${data.name} – Speisekarte`,
    description: data.description || `Digitale Speisekarte von ${data.name} — jetzt ansehen und bestellen.`,
  };
}

export default async function MenuPage({ params }) {
  const { restaurantID } = await params;
  const data = await getRestaurantData(restaurantID);
  if (!data) notFound();

  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
      <MenuClient serverData={data} />
    </Suspense>
  );
}
