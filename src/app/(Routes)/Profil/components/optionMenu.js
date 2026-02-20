import Link from "next/link";
import React, { useEffect, useState } from "react";
import { useSession } from "next-auth/react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetTrigger } from "@/components/ui/sheet";

import addressSchema from "./Schema/adressSchema";
import FontSelector from "./fontList";

/* ===================== OPTION MENU ===================== */

const OptionMenu = ({ openOptions, setOpenOptions, bgColor, setBgColor, router, restaurantID, serverData }) => {
  const [serverData_, setServerData_] = useState(null);
  const [menuData, setMenuData] = useState(null);
  const [isEditingMenu, setIsEditingMenu] = useState(false);
  const [editedBgColor, setEditedBgColor] = useState(bgColor);
  const [editedFont, setEditedFont] = useState("Arial");

  const { data: session } = useSession();
  const userID = session?.user?.id;
  const role = session?.user?.role || "";
  const authorizedUser = userID && role === "Owner";

  useEffect(() => {
    setServerData_(serverData || null);
  }, [serverData]);

  useEffect(() => {
    if (!authorizedUser || !restaurantID) return;

    const fetchMenuData = async () => {
      const resp = await fetch(`/api/restaurant/${restaurantID}/updateMenu`, { credentials: "include" });

      if (resp.ok) {
        const data = await resp.json();
        setMenuData(data.data);
        setEditedBgColor(data.data.bgColor || bgColor);
        setEditedFont(data.data.font || "Arial");
      }
    };

    fetchMenuData();
  }, [restaurantID, authorizedUser, bgColor]);

  const handleSaveMenu = async () => {
    const response = await fetch(`/api/restaurant/${restaurantID}/updateMenu`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        bgColor: editedBgColor,
        font: editedFont,
      }),
      credentials: "include",
    });

    if (response.ok) {
      const updated = await response.json();
      setMenuData(updated.data);
      setBgColor(editedBgColor);
      setIsEditingMenu(false);
    }
  };

  const handleCancelMenu = () => {
    setEditedBgColor(menuData?.bgColor || bgColor);
    setEditedFont(menuData?.font || "Arial");
    setIsEditingMenu(false);
  };

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
            <Label>Hintergrund</Label>
            <Input type="color" value={isEditingMenu ? editedBgColor : bgColor} disabled={!isEditingMenu} onChange={(e) => setEditedBgColor(e.target.value)} />

            {isEditingMenu && (
              <>
                <Label>Schriftart</Label>
                <FontSelector onFontChange={setEditedFont} />
              </>
            )}

            {isEditingMenu ? (
              <>
                <Button onClick={handleSaveMenu}>Speichern</Button>
                <Button variant="outline" onClick={handleCancelMenu}>
                  Abbrechen
                </Button>
              </>
            ) : (
              <Button onClick={() => setIsEditingMenu(true)}>Menü bearbeiten</Button>
            )}
          </div>

          {serverData_ && <RestaurantData serverData={serverData_} setServerData={setServerData_} restaurantID={restaurantID} userID={userID} />}
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
};

export { OptionMenu };

/* ===================== RESTAURANT DATA ===================== */

const RestaurantData = ({ serverData, setServerData, restaurantID, userID }) => {
  const restaurant = serverData?.userData?.restaurant;

  const [isEditing, setIsEditing] = useState(false);
  const [editedRestaurant, setEditedRestaurant] = useState(null);
  const [editedLocations, setEditedLocations] = useState([]);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (isEditing && restaurant) {
      setEditedRestaurant(restaurant);
      setEditedLocations(restaurant.locations ?? []);
    }
  }, [isEditing, restaurant]);

  const addNewLocation = () => {
    setEditedLocations((prev) => [
      ...prev,
      {
        street: "",
        houseNumber: "",
        city: "",
        postalCode: "",
        country: "",
      },
    ]);
  };

  const updateRestaurantField = (field, value) => {
    setEditedRestaurant((prev) => ({ ...prev, [field]: value }));
  };

  const updateLocationField = (index, field, value) => {
    setEditedLocations((prev) => {
      const copy = [...prev];
      copy[index] = { ...copy[index], [field]: value };
      return copy;
    });
  };

  const handleSave = async () => {
    console.log("Post to API");
    const fieldErrors = {};

    editedLocations.forEach((loc, index) => {
      const result = addressSchema.safeParse({
        street: loc.street,
        houseNumber: Number(loc.houseNumber),
        city: loc.city,
        postalCode: loc.postalCode,
        country: loc.country,
      });

      if (!result.success) {
        console.log("Fehler in reslut:", result);
        result.error.issues.forEach((i) => {
          fieldErrors[`${index}.${i.path[0]}`] = i.message;
        });
      }
    });

    if (Object.keys(fieldErrors).length) {
      setErrors(fieldErrors);
      return;
    }

    const response = await fetch(`/api/restaurant/${restaurantID}/updateRestaurant`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        restaurant: editedRestaurant,
        locations: editedLocations,
      }),
    });

    if (!response.ok) return;

    const updated = await response.json();
    setServerData(updated.data);
    setIsEditing(false);
  };

  return (
    <div className="p-6 space-y-6">
      <Card>
        <CardHeader>
          <h2 className="text-xl font-semibold">Restaurant</h2>
        </CardHeader>
        <CardContent className="space-y-2">
          {isEditing ? (
            <>
              <Label>Name</Label>
              <Input value={editedRestaurant?.name || ""} onChange={(e) => updateRestaurantField("name", e.target.value)} />
              <Label>Muttergesellschaft</Label>
              <Input value={editedRestaurant?.parentCompany || ""} onChange={(e) => updateRestaurantField("parentCompany", e.target.value)} />
            </>
          ) : (
            <>
              <p>
                <strong>Name:</strong> {restaurant?.name}
              </p>
              <p>
                <strong>Muttergesellschaft:</strong> {restaurant?.parentCompany}
              </p>
            </>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <h2 className="text-xl font-semibold">Standorte</h2>
        </CardHeader>
        <CardContent className="space-y-4">
          {(isEditing ? editedLocations : restaurant?.locations || []).map((loc, index) => (
            <div key={index} className="border p-4 rounded space-y-2">
              {!isEditing && (
                <p>
                  <strong>Adresse:</strong> {loc.street} {loc.houseNumber} {loc.postalCode} {loc.city}, {loc.country}
                </p>
              )}

              {/* Inputs nur im Bearbeitungsmodus */}
              {isEditing && (
                <>
                  {[
                    { value: "street", name: "Straße" },
                    { value: "houseNumber", name: "Hausnummer" },
                    { value: "city", name: "Stadt" },
                    { value: "postalCode", name: "Postleitzahl" },
                    { value: "country", name: "Land" },
                  ].map((field) => (
                    <div key={field.value}>
                      <Label>{field.name}</Label>
                      <Input value={loc[field.value] || ""} onChange={(e) => updateLocationField(index, field.value, e.target.value)} />
                      {errors[`${index}.${field.value}`] && <p className="text-xs text-red-500">{errors[`${index}.${field.value}`]}</p>}
                    </div>
                  ))}
                </>
              )}
            </div>
          ))}

          {isEditing && (
            <Button variant="secondary" onClick={addNewLocation}>
              + Neue Adresse hinzufügen
            </Button>
          )}
        </CardContent>
      </Card>

      <div className="flex justify-end gap-3">
        {isEditing ? (
          <>
            <Button variant="outline" onClick={() => setIsEditing(false)}>
              Abbrechen
            </Button>
            <Button onClick={handleSave}>Speichern</Button>
          </>
        ) : (
          <Button onClick={() => setIsEditing(true)}>Bearbeiten</Button>
        )}
      </div>
      <Button asChild>
        <Link
          href={{
            pathname: "/Profil/QRBuilder/",
            query: {
              ...(userID && { userID }),
              ...(restaurantID && { restaurantID }),
            },
          }}
        >
          QR-Code erstellen
        </Link>
      </Button>
    </div>
  );
};
