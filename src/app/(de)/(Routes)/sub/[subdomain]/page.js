import { Suspense, cache } from "react";
import { notFound } from "next/navigation";
import { getRestaurantMenuDataBySubdomain } from "@/app/api/restaurant/[restaurantID]/menu/data";
import MenuClient from "../../UnserePartner/Restaurants/Menu/components/MenuClient";

// Ziel des Middleware-Rewrites für <subdomain>.whatisonmymenu.com.
// Direkt unter /sub/<subdomain> auf der Hauptdomain leitet die Middleware auf die Subdomain um.
export const revalidate = 300;

const getRestaurantData = cache(getRestaurantMenuDataBySubdomain);

export async function generateMetadata({ params }) {
  const { subdomain } = await params;
  const data = await getRestaurantData(subdomain);
  if (!data) return { title: "Speisekarte", robots: { index: false, follow: false } };
  return {
    // absolute: auf der eigenen Subdomain des Restaurants keine Plattform-Marke anhaengen
    title: { absolute: `${data.name} – Speisekarte` },
    description: data.description || `Digitale Speisekarte von ${data.name} — jetzt ansehen und bestellen.`,
    // Kanonisch bleibt die Speisekarte auf der Hauptdomain (metadataBase), sonst doppelter Inhalt.
    alternates: {
      canonical: `/UnserePartner/Restaurants/Menu/${encodeURIComponent(data.id)}`,
    },
  };
}

export default async function SubdomainMenuPage({ params }) {
  const { subdomain } = await params;
  const data = await getRestaurantData(subdomain);
  if (!data) notFound();

  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
      <MenuClient serverData={data} />
    </Suspense>
  );
}
