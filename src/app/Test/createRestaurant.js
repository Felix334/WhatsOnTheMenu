const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function createData() {
  try {
    // Erstelle einen Benutzer
    const user = await prisma.user.create({
      data: {
        name: 'Max Mustermann',
        email: 'max@example.com',
        password: 'securepassword',
        role: 'Owner',
      },
    });

    // Erstelle ein Restaurant
    const restaurant = await prisma.restaurant.create({
      data: {
        name: 'Mein Restaurant',
        parentCompany: 'Elternfirma',
        ownerId: user.id,
        menuID: 'menu-id-placeholder', // Platzhalter, wird später aktualisiert
      },
    });

    // Erstelle ein Menü
    const menu = await prisma.menu.create({
      data: {
        name: 'Hauptmenü',
        description: 'Das Hauptmenü des Restaurants',
        bgColor: '#FFFFFF',
        font: 'Arial',
        restaurantID: restaurant.id,
      },
    });

    // Aktualisiere das Restaurant mit der menuID
    await prisma.restaurant.update({
      where: { id: restaurant.id },
      data: { menuID: menu.id },
    });

    // Erstelle eine Kategorie
    const category = await prisma.category.create({
      data: {
        name: 'Vorspeisen',
        description: 'Leckere Vorspeisen',
        menuId: menu.id,
      },
    });

    // Erstelle ein Gericht
    const dish = await prisma.dish.create({
      data: {
        name: 'Salat',
        description: 'Frischer Salat',
        price: 5.99,
        imageUrl: 'url-zum-bild',
        categoryId: category.id,
        menuId: menu.id,
      },
    });

    // Erstelle eine Zutat
    const ingredient = await prisma.ingredient.create({
      data: {
        name: 'Salat',
        isAllergen: false,
      },
    });

    // Verknüpfe die Zutat mit dem Gericht
    await prisma.dish.update({
      where: { id: dish.id },
      data: {
        ingredients: {
          connect: { id: ingredient.id },
        },
      },
    });

    // Erstelle einen Standort
    const location = await prisma.location.create({
      data: {
        street: 'Musterstraße',
        houseNumber: '1',
        city: 'Musterstadt',
        postalCode: '12345',
        country: 'Deutschland',
        restaurantId: restaurant.id,
      },
    });

    // Erstelle eine Reservierung
    const reservation = await prisma.reservation.create({
      data: {
        locationId: location.id,
        phoneNumber: '0123456789',
      },
    });

    // Erstelle eine Bewertung
    const review = await prisma.review.create({
      data: {
        dishId: dish.id,
        rating: 4.5,
        comment: 'Sehr lecker!',
      },
    });

    console.log('Daten erfolgreich erstellt:', {
      user,
      restaurant,
      menu,
      category,
      dish,
      ingredient,
      location,
      reservation,
      review,
    });
  } catch (error) {
    console.error('Fehler beim Erstellen der Daten:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Aufruf der Funktion
createData();
