"use client";

import { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

const restaurants = [
  {
    id: "cmd4qojb6000255q0j5295w2o",
    name: "Mein Restaurant",
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
];

export default function RestaurantList() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCuisine, setSelectedCuisine] = useState("Alle");
  const [userID, setUserID] = useState("");
  const [allowGeoLocation, setAllowGeoLocation] = useState(false);
  const [reqCookie, setReqcookie] = useState(false);

  const router = useRouter();

  useEffect(() => {
    const consent = document.cookie.split("; ").find((row) => row.startsWith("geoLocation="));
    if (consent?.split("=")[1] === "true") {
      setAllowGeoLocation(true);
    } else {
      setAllowGeoLocation(false);
    }
  }, []);

  // Prompt only if no permission
  useEffect(() => {
    if (!reqCookie) {
      if (allowGeoLocation === false) {
        const confirmConsent = window.confirm("Kein genauer Standort verfügbar.\nMöchten Sie Cookies zulassen, um Standortdaten zu aktivieren?");
        if (confirmConsent) {
          const expiry = new Date();
          expiry.setFullYear(expiry.getFullYear() + 1);
          document.cookie = `geoLocation=true; expires=${expiry.toUTCString()};`;
          setAllowGeoLocation(true);
        }
      }
    }
    setReqcookie(true);
  }, [allowGeoLocation, reqCookie]);

  useEffect(() => {
    if (userID) {
      window.localStorage.setItem("userID", userID);
    } else {
      const userID_ = window.localStorage.getItem("userID");
      if (userID_) {
        setUserID(userID_);
      }
    }
  }, [userID]);

  const cuisines = ["Alle", "Französisch", "Asiatisch", "Italienisch", "Americanisch", "FastFood"];

  const filteredRestaurants = restaurants.filter((restaurant) => {
    const matchesSearch = restaurant.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCuisine = selectedCuisine === "Alle" || restaurant.cuisine === selectedCuisine;
    return matchesSearch && matchesCuisine;
  });

  return (
    <div className="bg-amber-500 min-h-screen w-full">
      <div className="container mx-auto py-8">
        <div className="flex flex-col md:flex-row gap-4 mb-8 justify-center">
          <Input placeholder="Suchen" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="md:w-1/3 bg-amber-50" />

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="w-full md:w-auto">
                Kategorien: {selectedCuisine}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              {cuisines.map((cuisine) => (
                <DropdownMenuItem key={cuisine} onSelect={() => setSelectedCuisine(cuisine)}>
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
                <CardDescription>
                  {restaurant.cuisine} • {restaurant.priceRange}
                </CardDescription>
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
                  <Link
                    href={{
                      pathname: "/UnserePartner/Restaurants/Menu",
                      query: {
                        ...router.query,
                        ...(userID ? { userID } : {}),
                        ...(restaurant.id ? { restaurantID: restaurant.id } : {}),
                      },
                    }}
                  >
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
    </div>
  );
}

function getGeoLocation() {
  var confGeo = window.confirm("Diese Webseite benutzt Cookies um ihren Standort zu erfassen! \nIn dem sie zustimmen können wir ihre Ergebnisse besser personaliesieren");
  if (!navigator.geolocation) {
    window.alert("Geographische Daten nicht verfügbar");
  }
}
