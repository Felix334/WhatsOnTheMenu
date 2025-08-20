import { PrismaClient } from "@prisma/client";
import { create } from "domain";

const prisma = new PrismaClient();

async function main() {
  const admin = await prisma.user.create({
    data: {
      name: "FelixMayer",
      email: "felixmayer02@gmx.de",
      password: "111aaa",
      role: "Admin",
    },
  });

  const user1 = await prisma.user.create({
    data: {
      name: "User  One",
      email: "user1@example.com",
      password: "securepassword",
      role: "User",
    },
  });

  const user2 = await prisma.user.create({
    data: {
      name: "User  Two",
      email: "user2@example.com",
      password: "securepassword",
      role: "User ",
    },
  });

  // Create owners and their restaurants
  const owner1 = await prisma.user.create({
    data: {
      name: "Owner One",
      email: "owner1@example.com",
      password: "securepassword",
      role: "Owner",
      restaurant: {
        create: {
          name: "Owner One Restaurant",
          parentCompany: "Parent Company A",
          menu: {
            create: {
              name: "Owner One Menu",
              bgColor: "#FFFFFF",
              font: "Arial",
              categories: {
                create: [
                  {
                    name: "Category One",
                    dishes: {
                      create: [
                        {
                          name: "Dish One",
                          description: "Delicious Dish One",
                          price: 10.99,
                          imageUrl: "http://example.com/dish1.jpg",
                          ingredients: {
                            create: [
                              { name: "Ingredient One", isAllergen: false },
                              { name: "Ingredient Two", isAllergen: true },
                            ],
                          },
                          reviews: {
                            create: {
                              rating: 4.5,
                              comment: "Great dish!",
                            },
                          },
                        },
                        {
                          name: "Dish Two",
                          description: "Tasty Dish Two",
                          price: 12.99,
                          imageUrl: "http://example.com/dish2.jpg",
                          ingredients: {
                            create: [
                              { name: "Ingredient Three", isAllergen: false },
                              { name: "Ingredient Four", isAllergen: true },
                            ],
                          },
                          reviews: {
                            create: {
                              rating: 5.0,
                              comment: "Amazing flavor!",
                            },
                          },
                        },
                      ],
                    },
                  },
                  {
                    name: "Category Two",
                    dishes: {
                      create: [
                        {
                          name: "Dish Three",
                          description: "Yummy Dish Three",
                          price: 9.99,
                          imageUrl: "http://example.com/dish3.jpg",
                          ingredients: {
                            create: [
                              { name: "Ingredient Five", isAllergen: false },
                              { name: "Ingredient Six", isAllergen: true },
                            ],
                          },
                          reviews: {
                            create: {
                              rating: 4.0,
                              comment: "Very good!",
                            },
                          },
                        },
                        {
                          name: "Dish Four",
                          description: "Savory Dish Four",
                          price: 11.99,
                          imageUrl: "http://example.com/dish4.jpg",
                          ingredients: {
                            create: [
                              { name: "Ingredient Seven", isAllergen: false },
                              { name: "Ingredient Eight", isAllergen: true },
                            ],
                          },
                          reviews: {
                            create: {
                              rating: 4.8,
                              comment: "Loved it!",
                            },
                          },
                        },
                      ],
                    },
                  },
                ],
              },
              locations: {
                create: {
                  street: "123 Main St",
                  houseNumber: "1A",
                  city: "City A",
                  postalCode: "12345",
                  country: "Country A",
                },
              },
            },
          },
        },
      },
    },
  });

  const owner2 = await prisma.user.create({
    data: {
      name: "Owner Two",
      email: "owner2@example.com",
      password: "securepassword",
      role: "Owner",
      restaurant: {
        create: {
          name: "Owner Two Restaurant",
          parentCompany: "Parent Company B",
          menu: {
            create: {
              name: "Owner Two Menu",
              bgColor: "#FFFFFF",
              font: "Arial",
              categories: {
                create: [
                  {
                    name: "Category One",
                    dishes: {
                      create: [
                        {
                          name: "Dish Five",
                          description: "Delicious Dish Five",
                          price: 10.99,
                          imageUrl: "http://example.com/dish5.jpg",
                          ingredients: {
                            create: [
                              { name: "Ingredient Nine", isAllergen: false },
                              { name: "Ingredient Ten", isAllergen: true },
                            ],
                          },
                          reviews: {
                            create: {
                              rating: 4.5,
                              comment: "Great dish!",
                            },
                          },
                        },
                        {
                          name: "Dish Six",
                          description: "Tasty Dish Six",
                          price: 12.99,
                          imageUrl: "http://example.com/dish6.jpg",
                          ingredients: {
                            create: [
                              { name: "Ingredient Eleven", isAllergen: false },
                              { name: "Ingredient Twelve", isAllergen: true },
                            ],
                          },
                          reviews: {
                            create: {
                              rating: 5.0,
                              comment: "Amazing flavor!",
                            },
                          },
                        },
                      ],
                    },
                  },
                  {
                    name: "Category Two",
                    dishes: {
                      create: [
                        {
                          name: "Dish Seven",
                          description: "Yummy Dish Seven",
                          price: 9.99,
                          imageUrl: "http://example.com/dish7.jpg",
                          ingredients: {
                            create: [
                              { name: "Ingredient Thirteen", isAllergen: false },
                              { name: "Ingredient Fourteen", isAllergen: true },
                            ],
                          },
                          reviews: {
                            create: {
                              rating: 4.0,
                              comment: "Very good!",
                            },
                          },
                        },
                        {
                          name: "Dish Eight",
                          description: "Savory Dish Eight",
                          price: 11.99,
                          imageUrl: "http://example.com/dish8.jpg",
                          ingredients: {
                            create: [
                              { name: "Ingredient Fifteen", isAllergen: false },
                              { name: "Ingredient Sixteen", isAllergen: true },
                            ],
                          },
                          reviews: {
                            create: {
                              rating: 4.8,
                              comment: "Loved it!",
                            },
                          },
                        },
                      ],
                    },
                  },
                ],
              },
              locations: {
                create: {
                  street: "456 Elm St",
                  houseNumber: "2B",
                  city: "City B",
                  postalCode: "67890",
                  country: "Country B",
                },
              },
            },
          },
        },
      },
    },
  });

  console.log({ admin, user1, user2, owner1, owner2 });
}

// Create users

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
