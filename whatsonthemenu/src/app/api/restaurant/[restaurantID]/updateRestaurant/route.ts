// /api/restaurant/[restaurantID]/updateRestaurant.ts (New endpoint for restaurant updates)
import type { NextApiRequest, NextApiResponse } from 'next'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

type ResponseData = {
  message: string
  data?: any
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>
) {
  const { restaurantID } = req.query

  if (!restaurantID || typeof restaurantID !== 'string') {
    return res.status(400).json({ message: 'Invalid restaurant ID' })
  }

  if (req.method === 'GET') {
    // Fetch the restaurant with locations
    try {
      const restaurant = await prisma.restaurant.findUnique({
        where: { id: restaurantID },
        include: {
          locations: true,
          owner: true,
        },
      })

      if (!restaurant) {
        return res.status(404).json({ message: 'Restaurant not found' })
      }

      res.status(200).json({ message: 'Restaurant data retrieved', data: { userData: { restaurant } } })
    } catch (error) {
      console.error(error)
      res.status(500).json({ message: 'Internal server error' })
    }
  } else if (req.method === 'POST') {
    // Update the restaurant and locations
    const { restaurant: updatedRestaurant, locations: updatedLocations } = req.body

    if (!updatedRestaurant) {
      return res.status(400).json({ message: 'Restaurant data is required' })
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

      res.status(200).json({ message: 'Restaurant updated successfully', data: { userData: { restaurant: updatedData } } })
    } catch (error) {
      console.error(error)
      res.status(500).json({ message: 'Failed to update restaurant' })
    }
  } else {
    res.setHeader('Allow', ['GET', 'POST'])
    res.status(405).json({ message: 'Method not allowed' })
  }
}