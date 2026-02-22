"use client";

import { useState, useEffect } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import Link from "next/link";
import { useSession } from "next-auth/react";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

export default function RestaurantList() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCuisine, setSelectedCuisine] = useState("Alle");
  const [restaurantList, setRestaurantList] = useState([]);
  const [allowGeoLocation, setAllowGeoLocation] = useState(false);
  const [reqCookie, setReqCookie] = useState(false);
  const [setTrue, setSetTrue] = useState(false);

  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { data: session } = useSession();

  const userID = session?.user?.id || "";
  const role = session?.user?.role || "";
  const autherizedUser = userID && (role === "Owner" || role === "Admin");

  /* ---------------- URL userID sync ---------------- */

  useEffect(() => {
    if (autherizedUser) {
      const newSearchParams = new URLSearchParams(searchParams);
      newSearchParams.set("userID", userID);
      router.replace(`${pathname}?${newSearchParams.toString()}`);
      setSetTrue(true);
    }
  }, [userID, setTrue, router, pathname, searchParams, autherizedUser]);

  /* ---------------- Cookie check ---------------- */

  useEffect(() => {
    const consent = document.cookie
      .split("; ")
      .find((row) => row.startsWith("geoLocation="));

    setAllowGeoLocation(consent?.split("=")[1] === "true");
  }, []);

  /* ---------------- Fetch Restaurants ---------------- */

  useEffect(() => {
    const getRestaurants = async () => {
      try {
        const resp = await fetch("/api/restaurant/List", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
        });

        if (!resp.ok) return;

        const result = await resp.json();

        setRestaurantList(
          result.data.map((r) => ({
            id: r.id,
            name: r.name,
            cuisine: r.cuisine || "Unbekannt",
            rating: 0,
            priceRange: "—",
            isNew: false,
          }))
        );
      } catch (error) {
        console.error("Fetch error:", error);
      }
    };

    getRestaurants();
  }, []);

  /* ---------------- Cookie Prompt ---------------- */

  useEffect(() => {
    if (!reqCookie && !allowGeoLocation) {
      const confirmConsent = window.confirm(
        "Kein genauer Standort verfügbar.\nMöchten Sie Cookies zulassen, um Standortdaten zu aktivieren?"
      );

      if (confirmConsent) {
        const expiry = new Date();
        expiry.setFullYear(expiry.getFullYear() + 1);
        document.cookie = `geoLocation=true; expires=${expiry.toUTCString()};`;
        setAllowGeoLocation(true);
      }

      setReqCookie(true);
    }
  }, [allowGeoLocation, reqCookie]);

  /* ---------------- Filters ---------------- */

  const cuisines = [
    "Alle",
    "Französisch",
    "Asiatisch",
    "Italienisch",
    "Americanisch",
    "FastFood",
  ];

  const filteredRestaurants = restaurantList.filter((restaurant) => {
    const matchesSearch = restaurant.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());

    const matchesCuisine =
      selectedCuisine === "Alle" ||
      restaurant.cuisine === selectedCuisine;

    return matchesSearch && matchesCuisine;
  });

  /* ---------------- Geolocation ---------------- */

  const checkCoordinates = () => {
    if (!navigator.geolocation) {
      alert("Ihr Browser unterstützt keine Standortermittlung.");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        console.log(
          "Koordinaten:",
          pos.coords.latitude,
          pos.coords.longitude
        );
      },
      (err) => {
        alert("Standort konnte nicht ermittelt werden.");
        console.error(err);
      },
      { timeout: 10000 }
    );
  };

  /* ---------------- Render ---------------- */

  return (
    <div className="min-h-screen w-full">
      <div className="container mx-auto py-8">
        <div className="flex flex-col md:flex-row gap-4 mb-8 justify-center">
          <div className="fixed right-2">
            <Button onClick={checkCoordinates}>📍</Button>
          </div>

          <Input
            placeholder="Suchen"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="md:w-1/3 bg-amber-50"
          />

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">
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
            <Card key={restaurant.id}>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <CardTitle>{restaurant.name}</CardTitle>
                  {restaurant.isNew && (
                    <Badge variant="secondary">New</Badge>
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
                </div>
              </CardContent>

              <CardFooter className="flex justify-end">
                <Button variant="outline" asChild>
                  <Link
                    href={{
                      pathname: "/UnserePartner/Restaurants/Menu",
                      query: {
                        ...(userID ? { userID } : {}),
                        restaurantID: restaurant.id,
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
          <p className="text-center py-12 text-muted-foreground">
            Keine Restaurants gefunden
          </p>
        )}
      </div>
    </div>
  );
}
