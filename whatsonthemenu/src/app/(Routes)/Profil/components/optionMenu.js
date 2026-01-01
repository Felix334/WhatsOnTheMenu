import React, { useEffect, useState } from "react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetTrigger } from "@/components/ui/sheet";

const OptionMenu = ({ openOptions, setOpenOptions, bgColor, setBgColor, router, userID, restaurantID, serverData }) => {
  const [serverData_, setServerData_] = useState(null);

  useEffect(() => {
    setServerData_(serverData || null);
    console.log("Daten Check: ", serverData)
  }, [serverData]);

  if (restaurantID) {
    const url = new URL("/Profil", window.location.origin);

    url.search = new URLSearchParams({
      restaurantID,
    }).toString();

    console.log("Profil-URL:", url.toString());
  }

  return (
    <Sheet open={openOptions} onOpenChange={setOpenOptions}>
      <SheetTrigger asChild>
        <Button variant="outline">|||</Button>
      </SheetTrigger>

      <SheetContent side="left" className="w-full max-w-3xl">
        <SheetHeader>
          <SheetTitle>Dashboard</SheetTitle>
          <SheetDescription>Hier können Sie Ihre Seite individuell gestalten</SheetDescription>
        </SheetHeader>

        <div className="p-4 space-y-4">
          <div>
            <Label>Hintergrund</Label>
            <Input type="color" value={bgColor} onChange={(e) => setBgColor(e.target.value)} />
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

        {/* Nur rendern, wenn Daten da sind */}
        {serverData_ && <RestaurantData serverData={serverData_} />}
      </SheetContent>
    </Sheet>
  );
};

export { OptionMenu };

const RestaurantData = ({ serverData }) => {
  const restaurant = serverData?.userData.restaurant ?? {};

  const [isEditing, setIsEditing] = useState(false);
  const [editedRestaurant, setEditedRestaurant] = useState(restaurant);
  const [editedLocations, setEditedLocations] = useState(restaurant.locations || []);

  const handleSave = () => {
    console.log("Speichere Änderungen:", editedRestaurant, editedLocations);

    // TODO: API-Call hier einbauen

    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditedRestaurant(restaurant);
    setEditedLocations(restaurant.locations || []);
    setIsEditing(false);
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
    <div style={{ padding: "20px", fontFamily: "Arial, sans-serif" }}>
      <h1>Ihre Restaurant-Daten:</h1>

      <div style={{ marginBottom: 20, border: "1px solid #ccc", padding: 10, borderRadius: 6 }}>
        <h2>Restaurant-Informationen</h2>

        {isEditing ? (
          <div>
            <label>
              Name:
              <input value={editedRestaurant.name || ""} onChange={(e) => updateRestaurantField("name", e.target.value)} />
            </label>

            <br />

            <label>
              Muttergesellschaft:
              <input value={editedRestaurant.parentCompany || ""} onChange={(e) => updateRestaurantField("parentCompany", e.target.value)} />
            </label>

            <p>Besitzer: {editedRestaurant.owner?.name || "Unbekannt"} (nicht bearbeitbar)</p>
            <p>Erstellt am: {editedRestaurant.createdAt ? new Date(editedRestaurant.createdAt).toLocaleDateString() : "-"}</p>
          </div>
        ) : (
          <>
            <p>
              <strong>Name:</strong> {restaurant.name}
            </p>
            <p>
              <strong>Muttergesellschaft:</strong> {restaurant.parentCompany}
            </p>
            <p>
              <strong>Besitzer:</strong> {restaurant.owner?.name || "Unbekannt"}
            </p>
            <p>
              <strong>Erstellt am:</strong> {restaurant.createdAt ? new Date(restaurant.createdAt).toLocaleDateString() : "-"}
            </p>
          </>
        )}
      </div>

      <div style={{ marginBottom: 20, border: "1px solid #ccc", padding: 10, borderRadius: 6 }}>
        <h2>Standorte</h2>

        {editedLocations.length === 0 ? (
          <p>Keine Standorte vorhanden.</p>
        ) : (
          <ul style={{ listStyle: "none", padding: 0 }}>
            {editedLocations.map((location, index) => (
              <li key={location.id || index} style={{ marginBottom: 10, borderBottom: "1px solid #eee", paddingBottom: 10 }}>
                {isEditing ? (
                  <>
                    <label>
                      Straße:
                      <input value={location.street || ""} onChange={(e) => updateLocationField(index, "street", e.target.value)} />
                    </label>
                    <br />
                    <label>
                      Hausnummer:
                      <input value={location.houseNumber || ""} onChange={(e) => updateLocationField(index, "houseNumber", e.target.value)} />
                    </label>
                    <br />
                    <label>
                      Stadt:
                      <input value={location.city || ""} onChange={(e) => updateLocationField(index, "city", e.target.value)} />
                    </label>
                    <br />
                    <label>
                      Postleitzahl:
                      <input value={location.postalCode || ""} onChange={(e) => updateLocationField(index, "postalCode", e.target.value)} />
                    </label>
                    <br />
                    <label>
                      Land:
                      <input value={location.country || ""} onChange={(e) => updateLocationField(index, "country", e.target.value)} />
                    </label>
                  </>
                ) : (
                  <p>
                    <strong>Adresse:</strong> {location.street} {location.houseNumber}, {location.postalCode} {location.city}, {location.country}
                  </p>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>

      <div>
        {isEditing ? (
          <>
            <button onClick={handleSave} style={{ marginRight: 10 }}>Speichern</button>
            <button onClick={handleCancel}>Abbrechen</button>
          </>
        ) : (
          <button onClick={() => setIsEditing(true)} className="font-bold">Bearbeiten</button>
        )}
      </div>
    </div>
  );
};
