import Link from "next/link"; import z from "zod" 
import React, { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardHeader, CardContent } from "@/components/ui/card"; 
import { ScrollArea } from "@/components/ui/scroll-area"; 
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetTrigger } from "@/components/ui/sheet";

import addressSchema from "./Schema/adressSchema";
import FontSelector from "./fontList"; 


const OptionMenu = ({ openOptions, setOpenOptions, bgColor, setBgColor, router, userID, restaurantID, serverData }) => {
  const [serverData_, setServerData_] = useState(null);
  const [menuData, setMenuData] = useState(null);
  const [isEditingMenu, setIsEditingMenu] = useState(false);
  const [editedBgColor, setEditedBgColor] = useState(bgColor);
  const [editedFont, setEditedFont] = useState();

  useEffect(() => {
    setServerData_(serverData || null);
    console.log("Daten Check: ", serverData);
  }, [serverData]);

  useEffect(() => {
    const fetchMenuData = async () => {
      try {
        const resp = await fetch(`/api/restaurant/${restaurantID}/updateMenu`);
        if (resp.ok) {
          const data = await resp.json();
          setMenuData(data.data);
          setEditedBgColor(data.data.bgColor || bgColor);
          setEditedFont(data.data.font || "Arial");
        } else {
          console.error("Failed to fetch menu data");
        }
      } catch (error) {
        console.error("Error fetching menu data:", error);
      }
    };
    if (restaurantID) {
      fetchMenuData();
    }
  }, [restaurantID, bgColor]);

  const handleSaveMenu = async () => {
    try {
      const response = await fetch(`/api/restaurant/${restaurantID}/updateMenu`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ bgColor: editedBgColor, font: editedFont }),
      });
      if (response.ok) {
        const updatedData = await response.json();
        setMenuData(updatedData.data);
        setBgColor(editedBgColor);
        setIsEditingMenu(false);
      } else {
        console.error("Failed to save menu changes", response);
      }
    } catch (error) {
      console.error("Error saving menu changes:", error);
    }
  };

  const handleCancelMenu = () => {
    setEditedBgColor(menuData?.bgColor || bgColor);
    setEditedFont(menuData?.font || "Arial");
    setIsEditingMenu(false);
  };

  if (restaurantID) {
    const url = new URL("/Profil", window.location.origin);
    url.search = new URLSearchParams({ restaurantID }).toString();
    console.log("Profil-URL:", url.toString());
  }

  return (
    <Sheet open={openOptions} onOpenChange={setOpenOptions}>
      <SheetTrigger asChild>
        <Button variant="outline">|||</Button>
      </SheetTrigger>

      <SheetContent side="left" className="w-full max-w-3xl">
        <ScrollArea className="h-[calc(100vh-2rem)]">
          <SheetHeader>
            <SheetTitle>Dashboard</SheetTitle>
            <SheetDescription>Hier können Sie Ihre Seite individuell gestalten</SheetDescription>
          </SheetHeader>

          <div className="p-4 space-y-4">
            <div>
              <Label>Hintergrund</Label>
              {isEditingMenu ? (
                <Input type="color" value={editedBgColor} onChange={(e) => setEditedBgColor(e.target.value)} />
              ) : (
                <Input type="color" value={bgColor} onChange={(e) => setBgColor(e.target.value)} disabled />
              )}
            </div>

            {isEditingMenu && (
              <div>
                <Label>Schriftart</Label>
                <FontSelector onFontChange={setEditedFont} />
              </div>
            )}

            <div>
              {isEditingMenu ? (
                <>
                  <Button onClick={handleSaveMenu} style={{ marginRight: 10 }}>Speichern</Button>
                  <Button onClick={handleCancelMenu}>Abbrechen</Button>
                </>
              ) : (
                <Button onClick={() => setIsEditingMenu(true)}>Menü bearbeiten</Button>
              )}
            </div>

            <Button asChild>
              <Link
                href={{
                  pathname: "/Profil/QRBuilder/",
                  query: {
                    ...router?.query,
                    ...(userID ? { userID } : {}),
                    ...(restaurantID ? { restaurantID } : {}),
                  },
                }}
              >
                QR-Code erstellen
              </Link>
            </Button>
          </div>

          {serverData_ && <RestaurantData serverData={serverData_} setServerData={setServerData_} restaurantID={restaurantID} />}
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
};

export { OptionMenu };

const RestaurantData = ({ serverData, setServerData, restaurantID }) => {
  const restaurant = serverData?.userData?.restaurant;
  const [isEditing, setIsEditing] = useState(false);
  const [editedRestaurant, setEditedRestaurant] = useState(restaurant);
  const [editedLocations, setEditedLocations] = useState(restaurant?.locations || []);
  const [errors, setErrors] = useState({});

  const handleSave = async () => {
    // Validate all locations using Zod
    try {
      editedLocations.forEach((loc, idx) => {
        addressSchema.parse({
          street: loc.street ?? "",
          housNumber: Number(loc.houseNumber ?? 0),
          city: loc.city ?? "",
          postalCode: loc.postalCode ?? "",
          country: loc.country ?? "",
        });
      });
      setErrors({});
    } catch (err) {
      if (err instanceof z.ZodError) {
        const fieldErrors = {};
        err.issues.forEach((i) => {
          fieldErrors[i.path.join(".")] = i.message;
        });
        setErrors(fieldErrors);
        return;
      }
    }

    try {
      const response = await fetch(`/api/restaurant/${restaurantID}/updateRestaurant`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ restaurant: editedRestaurant, locations: editedLocations }),
      });

      if (response.ok) {
        const updatedData = await response.json();
        setServerData(updatedData);
        setIsEditing(false);
      } else {
        console.error("Failed to save changes");
      }
    } catch (error) {
      console.error("Error saving changes:", error);
    }
  };

  const handleCancel = () => {
    setEditedRestaurant(restaurant);
    setEditedLocations(restaurant.locations || []);
    setIsEditing(false);
    setErrors({});
  };

  const updateRestaurantField = (field, value) => {
    setEditedRestaurant({ ...editedRestaurant, [field]: value });
  };

  const updateLocationField = (index, field, value) => {
    const updated = [...editedLocations];
    updated[index] = { ...updated[index], [field]: value };
    setEditedLocations(updated);
  };

  return (
    <div className="min-h-screen bg-muted py-6 sm:py-10">
      <div className="w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <header>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Restaurantverwaltung</h1>
          <p className="text-muted-foreground text-sm sm:text-base">Übersicht & Bearbeitung Ihrer Restaurant-Daten</p>
        </header>

        <Card>
          <CardHeader>
            <h2 className="text-lg sm:text-xl font-semibold">Restaurant-Informationen</h2>
          </CardHeader>
          <CardContent>
            {isEditing ? (
              <div className="space-y-4">
                <div>
                  <Label>Name</Label>
                  <Input value={editedRestaurant?.name || ""} onChange={(e) => updateRestaurantField("name", e.target.value)} className="mt-1" />
                </div>
                <div>
                  <Label>Muttergesellschaft</Label>
                  <Input value={editedRestaurant?.parentCompany || ""} onChange={(e) => updateRestaurantField("parentCompany", e.target.value)} className="mt-1" />
                </div>
                <div className="space-y-1">
                  <p className="text-sm"><span className="font-medium">Besitzer:</span> {editedRestaurant?.owner?.name || "Unbekannt"} — nicht bearbeitbar</p>
                  <p className="text-sm"><span className="font-medium">Erstellt am:</span> {editedRestaurant?.createdAt ? new Date(editedRestaurant?.createdAt).toLocaleDateString() : "-"}</p>
                </div>
              </div>
            ) : (
              <div className="space-y-1 text-sm">
                <p><strong>Name:</strong> {restaurant?.name}</p>
                <p><strong>Muttergesellschaft:</strong> {restaurant?.parentCompany}</p>
                <p><strong>Besitzer:</strong> {restaurant?.owner?.name || "Unbekannt"}</p>
                <p><strong>Erstellt am:</strong> {restaurant?.createdAt ? new Date(restaurant?.createdAt).toLocaleDateString() : "-"}</p>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <h2 className="text-lg sm:text-xl font-semibold">Standorte</h2>
          </CardHeader>
          <CardContent>
            {editedLocations.length === 0 ? (
              <p className="text-muted-foreground">Keine Standorte vorhanden.</p>
            ) : (
              <div className="space-y-5">
                {editedLocations.map((location, index) => (
                  <div key={location.id || index} className="rounded-xl border p-4 bg-background space-y-3">
                    {isEditing ? (
                      <div className="grid grid-cols-1 gap-4">
                        {[ ["street", "Straße"], ["houseNumber", "Hausnummer"], ["city", "Stadt"], ["postalCode", "Postleitzahl"], ["country", "Land"] ].map(([field, label]) => (
                          <div key={field} className="space-y-1">
                            <Label>{label}</Label>
                            <Input className="mt-1" value={location?.[field] || ""} onChange={(e) => updateLocationField(index, field, e.target.value)} />
                            {errors[`${field}`] && <p className="text-red-500 text-xs">{errors[`${field}`]}</p>}
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p><strong>Adresse:</strong> {location?.street} {location?.houseNumber}, {location?.postalCode} {location?.city}, {location?.country}</p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <div className="flex flex-col sm:flex-row justify-end gap-3">
          {isEditing ? (
            <>
              <Button variant="outline" onClick={handleCancel} className="w-full sm:w-auto">Abbrechen</Button>
              <Button onClick={handleSave} className="w-full sm:w-auto">Speichern</Button>
            </>
          ) : (
            <Button onClick={() => setIsEditing(true)} className="w-full sm:w-auto">Bearbeiten</Button>
          )}
        </div>
      </div>
    </div>
  );
};
