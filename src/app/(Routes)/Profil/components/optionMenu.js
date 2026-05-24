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

const OptionMenu = ({ openOptions, setOpenOptions, bgColor, setNewBgColor, restaurantID, serverData, allowPremiumColor }) => {
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
    console.log("optionMenu-Daten:", allowPremiumColor);
    setServerData_(serverData || null);
  }, [serverData, allowPremiumColor]);

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
    const response = await fetch(`/api/user/profil/updateMenu`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        bgColor: editedBgColor,
        font: editedFont,
        restaurantID,
        userID
      }),
      credentials: "include",
    });

    if (response.ok) {
      const updated = await response.json();
      setMenuData(updated.data);
      setNewBgColor(editedBgColor);
      setIsEditingMenu(false);
      location.reload()
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
            {allowPremiumColor ? (
              <>
                <Input type="color" value={isEditingMenu ? editedBgColor : bgColor} disabled={!isEditingMenu} onChange={(e) => setEditedBgColor(e.target.value)} />
              </>
            ) : (
              <>
                <select value={isEditingMenu ? editedBgColor : bgColor} disabled={!isEditingMenu} onChange={(e) => setEditedBgColor(e.target.value)} className="border rounded px-2 py-1">
                  <option value="">Farbe wählen</option>

                  {/* Weiß & Grautöne */}
                  <option value="#FFFFFF">Weiß</option>
                  <option className="bg-gray-50" value="#F8F9FA">
                    Grau 50
                  </option>
                  <option className="bg-gray-100" value="#F1F3F5">
                    Grau 100
                  </option>
                  <option className="bg-gray-200" value="#E9ECEF">
                    Grau 200
                  </option>
                  <option className="bg-gray-300" value="#DEE2E6">
                    Grau 300
                  </option>
                  <option className="bg-gray-400" value="#CED4DA">
                    Grau 400
                  </option>
                  <option className="bg-gray-500" value="#ADB5BD">
                    Grau 500
                  </option>
                  <option className="bg-gray-600 text-white" value="#6C757D">
                    Grau 600
                  </option>
                  <option className="bg-gray-700 text-white" value="#495057">
                    Grau 700
                  </option>
                  <option className="bg-gray-800 text-white" value="#343A40">
                    Grau 800
                  </option>
                  <option className="bg-gray-900 text-white" value="#212529">
                    Grau 900
                  </option>

                  {/* Rottöne */}
                  <option className="bg-red-100" value="#FFCDD2">
                    Hellrot
                  </option>
                  <option className="bg-red-300" value="#EF9A9A">
                    Rot 300
                  </option>
                  <option className="bg-red-500 text-white" value="#F44336">
                    Rot 500
                  </option>
                  <option className="bg-red-700 text-white" value="#D32F2F">
                    Dunkelrot
                  </option>

                  {/* Orangetöne */}
                  <option className="bg-orange-100" value="#FFE0B2">
                    Hellorange
                  </option>
                  <option className="bg-orange-300" value="#FFB74D">
                    Orange 300
                  </option>
                  <option className="bg-orange-500 text-white" value="#FF9800">
                    Orange 500
                  </option>
                  <option className="bg-orange-700 text-white" value="#F57C00">
                    Dunkelorange
                  </option>

                  {/* Gelbtöne */}
                  <option className="bg-yellow-100" value="#FFF9C4">
                    Hellgelb
                  </option>
                  <option className="bg-yellow-300" value="#FFF176">
                    Gelb 300
                  </option>
                  <option className="bg-yellow-500" value="#FFC107">
                    Gelb 500
                  </option>
                  <option className="bg-yellow-700" value="#FFA000">
                    Dunkelgelb
                  </option>
                  <option className="bg-yellow-400" value="#FFD700">
                    Gold
                  </option>

                  {/* Grüntöne */}
                  <option className="bg-green-100" value="#C8E6C9">
                    Hellgrün
                  </option>
                  <option className="bg-green-300" value="#81C784">
                    Grün 300
                  </option>
                  <option className="bg-green-500 text-white" value="#4CAF50">
                    Grün 500
                  </option>
                  <option className="bg-green-700 text-white" value="#388E3C">
                    Dunkelgrün
                  </option>

                  {/* Blautöne */}
                  <option className="bg-blue-100" value="#BBDEFB">
                    Hellblau
                  </option>
                  <option className="bg-blue-300" value="#64B5F6">
                    Blau 300
                  </option>
                  <option className="bg-blue-500 text-white" value="#2196F3">
                    Blau 500
                  </option>
                  <option className="bg-blue-700 text-white" value="#1976D2">
                    Dunkelblau
                  </option>
                  <option className="bg-cyan-400 text-white" value="#17A2B8">
                    Cyan
                  </option>
                  <option className="bg-cyan-700 text-white" value="#138496">
                    Dunkelcyan
                  </option>

                  {/* Lila / Pink */}
                  <option className="bg-purple-200" value="#E1BEE7">
                    Helllila
                  </option>
                  <option className="bg-purple-300" value="#BA68C8">
                    Lila 300
                  </option>
                  <option className="bg-purple-500 text-white" value="#6F42C1">
                    Lila 500
                  </option>
                  <option className="bg-purple-700 text-white" value="#6610F2">
                    Dunkellila
                  </option>
                  <option className="bg-pink-300" value="#EC407A">
                    Pink 300
                  </option>
                  <option className="bg-pink-500 text-white" value="#E83E8C">
                    Pink 500
                  </option>

                  {/* Schwarz & dunkel */}
                  <option value="#343A40" className="text-white bg-gray-800">
                    Schwarzgrau
                  </option>
                  <option value="#000000" className="text-white bg-black">
                    Schwarz
                  </option>
                </select>
              </>
            )}

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
  const [originalRestaurant, setOriginalRestaurant] = useState(null);
  const [originalLocations, setOriginalLocations] = useState([]);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (isEditing && restaurant) {
      setEditedRestaurant(restaurant);
      setEditedLocations(restaurant.locations ?? []);
      setOriginalRestaurant(restaurant);
      setOriginalLocations(restaurant.locations ?? []);
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

  const deleteRestaurant = async () => {
    console.log("Löschen");
    const answ = window.confirm("Möchten sie ihren Account wirklich löschen?\nGelöschte Daten können nicht wieder hergestellt werden!");
    if (answ === true) {
      console.log("Lösche Daten");
      const resp = await fetch(`/api/deleteAccount/${userID}`, {
        method: "DELETE",
      });
      if (!resp.ok) {
        window.alert("Account erfolgreich gelöscht!");
      }
    } else {
      console.log("Löschvorgang abgebrochen");
    }
  };

  const handleSave = async () => {
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
        result.error.issues.forEach((i) => {
          fieldErrors[`${index}.${i.path[0]}`] = i.message;
        });
      }
    });

    if (Object.keys(fieldErrors).length) {
      setErrors(fieldErrors);
      return;
    }

    const changedRestaurantFields = Object.fromEntries(Object.entries(editedRestaurant).filter(([key, value]) => value !== originalRestaurant?.[key]));

    const changedLocations = editedLocations
      .map((loc, index) => {
        const original = originalLocations[index];

        if (!original) return loc;

        const changedFields = Object.fromEntries(Object.entries(loc).filter(([key, value]) => value !== original[key]));

        if (Object.keys(changedFields).length === 0) return null;
        return { id: loc.id, ...changedFields };
      })
      .filter(Boolean);

    if (Object.keys(changedRestaurantFields).length === 0 && changedLocations.length === 0) {
      setIsEditing(false);
      return;
    }

    const response = await fetch(`/api/user/profil/updateRestaurant`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        restaurant: { id: editedRestaurant.id, ...changedRestaurantFields },
        locations: changedLocations,
        userID,
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
      <div>
        <Button variant="destructive" onClick={() => deleteRestaurant()}>
          Account löschen
        </Button>
      </div>
    </div>
  );
};
