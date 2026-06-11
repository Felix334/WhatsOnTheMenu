import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// ✅ force-dynamic entfernt – next: { revalidate: 300 } im Frontend übernimmt das Caching
export async function GET(req, { params }) {
  try {
    const { restaurantID } = await params;

    if (!restaurantID) {
      return NextResponse.json({ message: "Restaurant ID is required" }, { status: 400 });
    }

    const restaurant = await prisma.restaurant.findUnique({
      where: { id: restaurantID },
      select: {
        id: true,
        name: true,
        description: true,
        parentCompany: true,
        openingHours: true,
        createdAt: true,
        owner: {
          select: { name: true },
        },
        menu: {
          select: {
            name: true,
            description: true,
            bgColor: true,
            font: true,
            heroColor: true,
            createdAt: true,
            updatedAt: true,
            categoryGroup: {
              select: {
                id: true,
                name: true,
                position: true,
                color: true,
                categories: {
                  select: {
                    id: true,
                    name: true,
                    description: true,
                    position: true,
                    bgColor: true,
                    font: true,
                    fontColor: true,
                    dishes: {
                      select: {
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
    if (!restaurant) {
      return NextResponse.json({ message: "Restaurant not found" }, { status: 404 });
    }

    const menuWithRatings = restaurant.menu
      ? {
          ...restaurant.menu,
          categoryGroup:
            restaurant.menu.categoryGroup?.map((group) => ({
              ...group,
              categories:
                group.categories?.map((category) => ({
                  ...category,
                  dishes:
                    category.dishes?.map((dish) => {
                      const avgRating = dish.reviews?.length > 0 ? dish.reviews.reduce((sum, r) => sum + r.rating, 0) / dish.reviews.length : 0;
                      return {
                        ...dish,
                        averageRating: Number(avgRating.toFixed(1)),
                        reviewCount: dish.reviews?.length || 0,
                      };
                    }) || [],
                })) || [],
            })) || [],
        }
      : { categoryGroup: [] };

    const response = {
      id: restaurant.id,
      name: restaurant.name,
      description: restaurant.description ?? null,
      parentCompany: restaurant.parentCompany,
      owner: restaurant.owner,
      menu: menuWithRatings,
      locations: restaurant.locations,
      openingHours: restaurant.openingHours ?? null,
      createdAt: restaurant.createdAt,
    };

    return NextResponse.json(response, {
      headers: {
        // ✅ Cache-Control Header bleibt für CDN/Proxy-Caching
        "Cache-Control": "public, s-maxage=300, stale-while-revalidate=600",
      },
    });
  } catch (error) {
    console.error("Error fetching restaurant:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
