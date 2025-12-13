"use client";

import { useState, useEffect, use } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { LoadCoordinates } from "/components";

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
  const [allowGeoLocation, setAllowGeoLocation] = useState(false);
  const [reqCookie, setReqcookie] = useState(false);
  const [setTrue, setSetTrue] = useState(false);

  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { data: session, status } = useSession();

  const userID = session?.user?.id || "";
  const role = session?.user?.role || "";
  const autherizedUser = userID && (role === "Owner" || role === "Admin");

  useEffect(() => {
    if (userID && !setTrue) {
      const newSearchParams = new URLSearchParams(searchParams);
      newSearchParams.set("userID", userID); // Add or update userID
      const newUrl = `${pathname}?${newSearchParams.toString()}`;
      router.replace(newUrl);
      setSetTrue(true);
    }
  }, [userID, setTrue, router, pathname, searchParams]);

  useEffect(() => {
    const consent = document.cookie.split("; ").find((row) => row.startsWith("geoLocation="));
    if (consent?.split("=")[1] === "true") {
      setAllowGeoLocation(true);
    } else {
      setAllowGeoLocation(false);
    }
  }, []);

  useEffect;

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

  const cuisines = ["Alle", "Französisch", "Asiatisch", "Italienisch", "Americanisch", "FastFood"];

  const filteredRestaurants = restaurants.filter((restaurant) => {
    const matchesSearch = restaurant.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCuisine = selectedCuisine === "Alle" || restaurant.cuisine === selectedCuisine;
    return matchesSearch && matchesCuisine;
  });

  const checkCoordinates = () => {
    if (!navigator.geolocation) {
      window.alert("Oops! \nWie es scheint, unterstützt Ihr Browser keine Standortermittlung! \nVerwenden Sie einen anderen Internetbrowser, um alle Funktionen unserer Seite nutzen zu können.");
      return;
    }

    // Geht nur in localhost oder mit https
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const lat = position.coords.latitude;
        const long = position.coords.longitude;
        console.log("Koordinaten:", lat, long);
      },
      (error) => {
        switch (error.code) {
          case 1:
            alert("Standortzugriff verweigert. Bitte erlauben Sie den Zugriff in Ihren Browsereinstellungen und laden Sie die Seite neu.");
            break;
          case 2:
            alert("Standort konnte nicht ermittelt werden. Überprüfen Sie Ihre GPS-Einstellungen.");
            break;
          case 3:
            alert("Zeitüberschreitung bei der Standortermittlung. Versuchen Sie es erneut.");
            break;
          default:
            console.error("Unbekannter Fehler:", error);
        }
      },
      { timeout: 10000 }
    );
  };

  useEffect(() => {
    const getData = async () => {
      try {
        var resp = await fetch("/api/restaurant/List", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
        });
        if (resp.status === 401) {
          console.log(status);
        }
        if(resp.status === 200){
          console.log("Success:", status)
        }
        console.log("error", resp.status)
      } catch (error) {
        console.log(error);
      }
    };
    getData();
  });

  return (
    <div className="bg-amber-500 min-h-screen w-full">
      <div className="container mx-auto py-8">
        <div className="flex flex-col md:flex-row gap-4 mb-8 justify-center">
          <div className="fixed right-2">
            <Button onClick={checkCoordinates}></Button>
          </div>
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
