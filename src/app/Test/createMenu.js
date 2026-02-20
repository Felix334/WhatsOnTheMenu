const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function createData() {
  try {
    // Create a new category with dishes, linking to existing menu by menuId
    const newCategory = await prisma.category.create({
      data: {
        name: "Vorspeisen",
        description: "Leckere Vorspeisen",
        menuId: "cmd4qojb8000455q07oeyp9zi",
        dishes: {
          create: [
            {
              name: "Salat",
              description: "Frischer Salat",
              price: 5.99,
              imageUrl: "url-zum-bild",
              ingredients: {
                create: [
                  {
                    name: "Salat",
                    isAllergen: false
                  }
                ]
              },
              reviews: {
                create: [
                  {
                    rating: 4.5,
                    comment: "Sehr lecker!"
                  }
                ]
              }
            },
            {
              name: "Schnitzel mit Pommes",
              description: "Flachgeklopftes Schnitzel mit knusprigen Pommes und Soße dazu",
              price: 9.66,
              imageUrl: "",
              ingredients: {
                create: []
              },
              reviews: {
                create: []
              }
            }
          ]
        }
      }
    });
    console.log("New category created:", newCategory);
    return newCategory;
  } catch (error) {
    console.error("Fehler beim Erstellen der Daten:", error);
  } finally {
    await prisma.$disconnect();
  }
}

createData();
