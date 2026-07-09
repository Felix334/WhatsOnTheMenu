import { Suspense, cache } from "react";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import MenuClient from "../components/MenuClient";

export const revalidate = 300;

// Alle Speisekarten schon beim Build vorrendern, damit auch der erste
// Besucher nach einem Deploy keinen kalten Server-Render abwartet
export async function generateStaticParams() {
  try {
    const restaurants = await prisma.restaurant.findMany({ select: { id: true } });
    return restaurants.map((r) => ({ restaurantID: r.id }));
  } catch {
    // Ohne DB-Zugriff beim Build: Seiten entstehen beim ersten Aufruf (ISR)
    return [];
  }
}

// cache() dedupliziert den DB-Zugriff zwischen generateMetadata und Page
const getRestaurantData = cache(async (restaurantID) => {
  const restaurant = await prisma.restaurant.findUnique({
    where: { id: restaurantID },
    select: {
      id: true,
      name: true,
      description: true,
      parentCompany: true,
      openingHours: true,
      socialLinks: true,
      createdAt: true,
      owner: {
        select: { name: true, subscription: true },
      },
      menu: {
        select: {
          name: true,
          description: true,
          bgColor: true,
          font: true,
          heroColor: true,
          heroTextColor: true,
          createdAt: true,
          updatedAt: true,
          categoryGroup: {
            select: {
              id: true,
              name: true,
              position: true,
              color: true,
              fontColor: true,
              borderRadius: true,
              titleAlign: true,
              categories: {
                select: {
                  id: true,
                  name: true,
                  description: true,
                  position: true,
                  bgColor: true,
                  font: true,
                  fontColor: true,
                  borderRadius: true,
                  elevated: true,
                  dishes: {
                    select: {
                      id: true,
                      name: true,
                      description: true,
                      price: true,
                      imageUrl: true,
                      stock: true,
                      ingredients: {
                        where: { isAllergen: true },
                        select: { name: true },
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
      locations: {
        select: {
          street: true,
          houseNumber: true,
          city: true,
          postalCode: true,
          country: true,
          reservation: {
            select: { phoneNumber: true },
          },
        },
      },
    },
  });

  if (!restaurant) return null;

  const menu = restaurant.menu ?? [];
  for (const entry of menu) {
    entry.categoryGroup?.sort((a, b) => Number(a.position) - Number(b.position));
  }

  const response = {
    id: restaurant.id,
    name: restaurant.name,
    description: restaurant.description ?? null,
    parentCompany: restaurant.parentCompany,
    owner: { name: restaurant.owner.name },
    ownerSubscription: restaurant.owner.subscription,
    menu,
    locations: restaurant.locations,
    openingHours: restaurant.openingHours ?? null,
    socialLinks: restaurant.socialLinks ?? null,
    createdAt: restaurant.createdAt,
  };

  // Dates/Decimals in JSON-kompatible Werte wandeln — Client bekam bisher auch nur JSON
  return JSON.parse(JSON.stringify(response));
});

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
