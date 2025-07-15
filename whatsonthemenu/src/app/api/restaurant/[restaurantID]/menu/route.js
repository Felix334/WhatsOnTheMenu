import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function GET(req, { params }) {
  try {
    const { restaurantID } = await params
    console.log("Restaurant ID from URL:", restaurantID)
    if (!restaurantID) {
      return NextResponse.json(
        { message: 'Restaurant ID is required' },
        { status: 400 }
      )
    }

    const restaurant = await prisma.restaurant.findUnique({
      where: { id: restaurantID },
      include: {
        owner: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true
          }
        },
        menu: {
          include: {
            categories: {
              include: {
                dishes: {
                  include: {
                    ingredients: true,
                    reviews: {
                      select: {
                        id: true,
                        rating: true,
                        comment: true,
                        createdAt: true
                      }
                    }
                  }
                }
              }
            }
          }
        },
        locations: {
          include: {
            reservation: true || false
          }
        }
      }
    })

    if (!restaurant) {
      return NextResponse.json(
        { message: 'Restaurant not found' },
        { status: 404 }
      )
    }

    // Calculate average ratings for dishes
    const menuWithRatings = {
      ...restaurant.menu,
      categories: restaurant.menu?.categories.map(category => ({
        ...category,
        dishes: category.dishes.map(dish => {
          const avgRating =
            dish.reviews.reduce((sum, review) => sum + review.rating, 0) /
              dish.reviews.length || 0
          return {
            ...dish,
            averageRating: parseFloat(avgRating.toFixed(1)),
            reviewCount: dish.reviews.length
          }
        })
      }))
    }

    const response = {
      id: restaurant.id,
      name: restaurant.name,
      parentCompany: restaurant.parentCompany,
      owner: restaurant.owner,
      menu: menuWithRatings,
      locations: restaurant.locations,
      createdAt: restaurant.createdAt
    }

    return NextResponse.json(response)
  } catch (error) {
    console.error('Error fetching restaurant:', error)
    return NextResponse.json(
      { message: 'Internal server error', error: error.message },
      { status: 500 }
    )
  } finally {
    await prisma.$disconnect()
  }
}
