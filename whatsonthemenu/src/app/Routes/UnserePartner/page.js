'use client'

import { useState, useEffect } from 'react'
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"

const restaurants = [
  {
    id: "1eeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee",
    name: "Epicurean Delight",
    cuisine: "French",
    rating: 4.7,
    priceRange: "1€-20€",
    isNew: true,
  },
  {
    id: "2eeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee",
    name: "Tokyo Sushi Bar",
    cuisine: "Japanese",
    rating: 4.5,
    priceRange: "1€-20€",
  },
  {
    id: "3eeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee",
    name: "La Piazza",
    cuisine: "Italian",
    rating: 4.3,
    priceRange: "1€-20€",
  },
  {
    id: "4eeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee",
    name: "Burger Joint",
    cuisine: "American",
    rating: 4.1,
    priceRange: "1€-20€",
  },
]

export default function RestaurantList() {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCuisine, setSelectedCuisine] = useState('')
  const [userID, setUserID] = useState("")

  const router = useRouter()

  useEffect(() => {
    if (userID) {
      window.localStorage.setItem("userID", userID)
    } else {
      const userID_ = window.localStorage.getItem("userID")
      if (userID_) {
        setUserID(userID_)
      }
    }
  }, [userID])

  const cuisines = ['Alles', 'Französisch', 'Asiatisch', 'Italienisch', 'Americanisch', 'FastFood']

  const filteredRestaurants = restaurants.filter(restaurant => {
    const matchesSearch = restaurant.name.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCuisine = selectedCuisine === '' || restaurant.cuisine === selectedCuisine
    return matchesSearch && matchesCuisine
  })

  return (
    <div className="container mx-auto py-8">
      <div className="flex flex-col md:flex-row gap-4 mb-8">
        <Input
          placeholder="Suchen"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="md:w-1/3"
        />

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="w-full md:w-auto">
              Kategorien: {selectedCuisine}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            {cuisines.map((cuisine) => (
              <DropdownMenuItem
                key={cuisine}
                onSelect={() => setSelectedCuisine(cuisine)}
              >
                {cuisine}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredRestaurants.map((restaurant) => (
          <Card key={restaurant.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex justify-between items-start">
                <CardTitle>{restaurant.name}</CardTitle>
                {restaurant.isNew && (
                  <Badge variant="secondary" className="ml-2">
                    New
                  </Badge>
                )}
              </div>
              <CardDescription>{restaurant.cuisine} • {restaurant.priceRange}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <span className="text-yellow-500">★</span>
                <span>Bewertung: {restaurant.rating}</span>
                <span>Preise: {restaurant.priceRange}</span>
              </div>
            </CardContent>
            <CardFooter className="flex justify-end">
              <Button variant="outline" asChild>
                <Link href={{
                  pathname: "/Routes/Restaurants/Menu",
                  query: {
                    ...router.query,
                    ...(userID ? { userID } : {}),
                    ...(restaurant.id ? { restaurantID: restaurant.id } : {})
                  }
                }}>
                  Karte
                </Link>
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>

      {filteredRestaurants.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No restaurants found matching your criteria</p>
        </div>
      )}
    </div>
  )
}
