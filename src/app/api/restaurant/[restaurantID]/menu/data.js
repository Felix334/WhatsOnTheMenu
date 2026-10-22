import { prisma } from "@/lib/prisma";
import { SUBDOMAIN_SUBSCRIPTIONS } from "@/lib/schemas/subdomain";

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
            orderBy: { position: "asc" },
            select: {
              id: true,
              name: true,
              position: true,
              color: true,
              fontColor: true,
              borderRadius: true,
              titleAlign: true,
              categories: {
                orderBy: [{ position: "asc" }, { name: "asc" }],
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
                    orderBy: [{ position: "asc" }, { createdAt: "asc" }],
                    select: {
                      id: true,
                      name: true,
                      description: true,
                      price: true,
                      imageUrl: true,
                      stock: true,
                      allergens: true,
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
          dish: {
            select: { name: true, price: true, imageUrl: true },
          },
        },
      },
    },
  });

  if (!restaurant) return null;

  const menu = restaurant.menu ?? [];

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

  return JSON.parse(JSON.stringify(response));
}

// Auflösung der Subdomain (<subdomain>.whatisonmymenu.com) auf die Speisekarte.
// Nach einem Downgrade unter Professional/Business löst die Subdomain nicht mehr auf.
// Die Subdomain wird vorher in der Middleware auf [a-z0-9-] geprüft.
export async function getRestaurantMenuDataBySubdomain(subdomain) {
  const restaurant = await prisma.restaurant.findUnique({
    where: { subdomain },
    select: { id: true, owner: { select: { subscription: true } } },
  });
  if (!restaurant || !SUBDOMAIN_SUBSCRIPTIONS.includes(restaurant.owner.subscription)) return null;
  return getRestaurantMenuData(restaurant.id);
}
