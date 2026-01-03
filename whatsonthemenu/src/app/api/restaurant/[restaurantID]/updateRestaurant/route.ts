import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function GET(request: Request, { params }: { params: Promise<{ restaurantID: string }> }) {
  const { restaurantID } = await params

  if (!restaurantID || typeof restaurantID !== 'string') {
    return Response.json({ message: 'Invalid restaurant ID' }, { status: 400 })
  }

  try {
    const restaurant = await prisma.restaurant.findUnique({
      where: { id: restaurantID },
      include: {
        locations: true,
        owner: true,
      },
    })

    if (!restaurant) {
      return Response.json({ message: 'Restaurant not found' }, { status: 404 })
    }

    return Response.json({ message: 'Restaurant data retrieved', data: { userData: { restaurant } } })
  } catch (error) {
    console.error(error)
    return Response.json({ message: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request: Request, { params }: { params: Promise<{ restaurantID: string }> }) {
  const { restaurantID } = await params

  if (!restaurantID || typeof restaurantID !== 'string') {
    return Response.json({ message: 'Invalid restaurant ID' }, { status: 400 })
  }

  const body = await request.json()
  const { restaurant: updatedRestaurant, locations: updatedLocations } = body

  if (!updatedRestaurant) {
    return Response.json({ message: 'Restaurant data is required' }, { status: 400 })
  }

  try {
    // Update restaurant
    const restaurant = await prisma.restaurant.update({
      where: { id: restaurantID },
      data: {
        name: updatedRestaurant.name,
        parentCompany: updatedRestaurant.parentCompany,
      },
    })

    // Update locations
    for (const location of updatedLocations) {
      if (location.id) {
        await prisma.location.update({
          where: { id: location.id },
          data: {
            street: location.street,
            houseNumber: location.houseNumber,
            city: location.city,
            postalCode: location.postalCode,
            country: location.country,
          },
        })
      } else {
        // Create new location if no ID
        await prisma.location.create({
          data: {
            ...location,
            restaurantId: restaurantID,
          },
        })
      }
    }

    // Fetch updated data
    const updatedData = await prisma.restaurant.findUnique({
      where: { id: restaurantID },
      include: {
        locations: true,
        owner: true,
      },
    })

    return Response.json({ message: 'Restaurant updated successfully', data: { userData: { restaurant: updatedData } } })
  } catch (error) {
    console.error(error)
    return Response.json({ message: 'Failed to update restaurant' }, { status: 500 })
  }
}
