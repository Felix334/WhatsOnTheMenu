import { prisma } from "@/lib/prisma";

// Einzige Stelle mit dem Prisma-Select für die öffentliche Speisekarte —
// genutzt von route.js (GET-Handler) UND direkt (ohne HTTP-Umweg) von
// Menu/[restaurantID]/page.js. Ausnahme von der "DB-Zugriffe immer über API"-
// Regel: die Seite wird per generateStaticParams beim Build vorgerendert,
// ein Selbst-Fetch auf die eigene API würde dabei fehlschlagen.
export async function getRestaurantMenuData(restaurantID) {
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
          headingFont: true,
          density: true,
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
                  leaderDots: true,
                  titleAlign: true,
                  titleUppercase: true,
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
      calendar: {
        // Einträge zeigen, die noch nicht vorbei sind: mehrtägige Events laufen bis
        // endDate (auch wenn date in der Vergangenheit liegt), eintägige bis date.
        where: {
          OR: [{ endDate: { gte: new Date(new Date().setHours(0, 0, 0, 0)) } }, { endDate: null, date: { gte: new Date(new Date().setHours(0, 0, 0, 0)) } }],
        },
        orderBy: { date: "asc" },
        select: {
          id: true,
          eventName: true,
          eventDescription: true,
          date: true,
          endDate: true,
          startTime: true,
          endTime: true,
          type: true,
          dishId: true,
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
    calendar: restaurant.calendar ?? [],
    openingHours: restaurant.openingHours ?? null,
    socialLinks: restaurant.socialLinks ?? null,
    createdAt: restaurant.createdAt,
  };

  // Dates/Decimals in JSON-kompatible Werte wandeln — sowohl Route-Handler
  // (NextResponse.json) als auch Server-Component-Render brauchen reines JSON.
  return JSON.parse(JSON.stringify(response));
}
