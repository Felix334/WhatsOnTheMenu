import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { signOut, useSession } from "next-auth/react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetTrigger } from "@/components/ui/sheet";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";

import addressSchema from "./Schema/adressSchema";
import FontSelector from "./fontList";
import { OpeningHoursEditor } from "./openingHours";
import { MENU_THEMES } from "@/lib/menuThemes";

const DENSITY_OPTIONS = [
  { value: "compact", label: "Kompakt" },
  { value: "normal", label: "Normal" },
  { value: "airy", label: "Luftig" },
];

/* ===================== OPTION MENU ===================== */

const OptionMenu = ({ openOptions, setOpenOptions, bgColor, setNewBgColor, restaurantID, serverData, allowPremiumColor }) => {
  const [localServerData, setLocalServerData] = useState(serverData);
  const [isEditingMenu, setIsEditingMenu] = useState(false);
  const [editedBgColor, setEditedBgColor] = useState(bgColor ?? "");
  const [editedFont, setEditedFont] = useState("Arial");
  const [editedHeadingFont, setEditedHeadingFont] = useState("");
  const [editedDensity, setEditedDensity] = useState("normal");
  const [pendingTheme, setPendingTheme] = useState(null);
  const [applyingTheme, setApplyingTheme] = useState(false);

  const { data: session } = useSession();
  const userID = session?.user?.id;

  // Sync wenn Parent-Daten asynchron ankommen
  useEffect(() => {
    setLocalServerData(serverData);
  }, [serverData]);

  useEffect(() => {
    if (bgColor) setEditedBgColor(bgColor);
  }, [bgColor]);

  useEffect(() => {
    const menu = serverData?.userData?.restaurant?.menu?.[0];
    if (menu?.font) setEditedFont(menu.font);
    setEditedHeadingFont(menu?.headingFont ?? "");
    setEditedDensity(menu?.density || "normal");
  }, [serverData]);

  const handleSaveMenu = async () => {
    const response = await fetch(`/api/user/profil/updateMenu`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        bgColor: editedBgColor,
        font: editedFont,
        headingFont: editedHeadingFont,
        density: editedDensity,
        restaurantID,
        userID,
      }),
      credentials: "include",
    });

    if (response.ok) {
      setNewBgColor(editedBgColor);
      setIsEditingMenu(false);
      toast.success("Design gespeichert!");
      location.reload();
    } else {
      toast.error("Fehler beim Speichern des Designs");
    }
  };

  const handleCancelMenu = () => {
    const menu = serverData?.userData?.restaurant?.menu?.[0];
    setEditedBgColor(bgColor ?? "");
    setEditedFont(menu?.font || "Arial");
    setEditedHeadingFont(menu?.headingFont ?? "");
    setEditedDensity(menu?.density || "normal");
    setIsEditingMenu(false);
  };

  const applyTheme = async (themeKey) => {
    setApplyingTheme(true);
    try {
      const response = await fetch(`/api/user/profil/applyTheme`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ restaurantID, theme: themeKey }),
        credentials: "include",
      });
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      toast.success("Theme angewendet!");
      location.reload();
    } catch {
      toast.error("Theme konnte nicht angewendet werden");
      setApplyingTheme(false);
    }
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
                  <option value="#343A40" className="text-white bg-gray-800">
                    Schwarzgrau
                  </option>
                  <option value="#000000" className="text-white bg-black">
                    Schwarz
                  </option>
                </select>
              </>
            )}

            <Label>Schriftart</Label>
            {isEditingMenu ? (
              <FontSelector onFontChange={setEditedFont} value={editedFont} />
            ) : (
              <p className="text-sm text-gray-600 py-1" style={{ fontFamily: editedFont || "inherit" }}>
                {editedFont || "Standard"}
              </p>
            )}

            <Label>Überschriften-Schriftart</Label>
            {isEditingMenu ? (
              <div className="space-y-2">
                <FontSelector onFontChange={setEditedHeadingFont} value={editedHeadingFont || editedFont} />
                {editedHeadingFont && (
                  <button type="button" onClick={() => setEditedHeadingFont("")} className="text-xs text-gray-400 hover:text-gray-700">
                    ✕ Zurücksetzen (wie Fließtext)
                  </button>
                )}
              </div>
            ) : (
              <p className="text-sm text-gray-600 py-1" style={{ fontFamily: editedHeadingFont || editedFont || "inherit" }}>
                {editedHeadingFont || "Wie Fließtext"}
              </p>
            )}

            <Label>Zeilendichte</Label>
            <div className="flex gap-2">
              {DENSITY_OPTIONS.map(({ value, label }) => (
                <button
                  key={value}
                  type="button"
                  disabled={!isEditingMenu}
                  onClick={() => setEditedDensity(value)}
                  className={`flex-1 py-2 text-sm rounded-xl border-2 transition-all disabled:opacity-50 ${editedDensity === value ? "border-gray-900 bg-gray-900 text-white font-semibold" : "border-gray-200 text-gray-600 hover:border-gray-400"}`}
                >
                  {label}
                </button>
              ))}
            </div>

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

            <div className="pt-4 border-t space-y-3">
              <Label>Design-Themes</Label>
              {!allowPremiumColor && (
                <p className="text-xs text-amber-600">
                  Premium-Feature —{" "}
                  <Link href="/pricing" className="underline font-medium">
                    Upgrade
                  </Link>
                  , um Themes zu nutzen.
                </p>
              )}
              <div className="grid grid-cols-2 gap-3">
                {Object.entries(MENU_THEMES).map(([key, theme]) => (
                  <button
                    key={key}
                    type="button"
                    disabled={!allowPremiumColor || applyingTheme}
                    onClick={() => setPendingTheme(key)}
                    className="rounded-xl border-2 border-gray-200 hover:border-gray-400 disabled:opacity-50 disabled:cursor-not-allowed text-left overflow-hidden transition-all"
                  >
                    <div className="h-10 flex">
                      <span className="flex-1" style={{ backgroundColor: theme.menu.bgColor }} />
                      <span className="flex-1" style={{ backgroundColor: theme.category.bgColor }} />
                      <span className="flex-1" style={{ backgroundColor: theme.category.fontColor }} />
                    </div>
                    <div className="p-2">
                      <p className="text-sm font-semibold" style={{ fontFamily: theme.menu.headingFont }}>
                        {theme.label}
                      </p>
                      <p className="text-xs text-gray-500">{theme.description}</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            <ConfirmDialog
              open={pendingTheme !== null}
              onOpenChange={(open) => !open && setPendingTheme(null)}
              title={`Theme „${MENU_THEMES[pendingTheme]?.label ?? ""}“ anwenden?`}
              description="Das Theme überschreibt Farben, Schriftarten, Ränder und Punktlinien aller Kategorien und Gruppen. Das kann nicht rückgängig gemacht werden."
              confirmLabel="Anwenden"
              onConfirm={() => {
                const themeKey = pendingTheme;
                setPendingTheme(null);
                applyTheme(themeKey);
              }}
            />
          </div>

          {localServerData && <RestaurantData serverData={localServerData} setServerData={setLocalServerData} restaurantID={restaurantID} userID={userID} />}
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
};

export { OptionMenu };

const SOCIAL_PLATFORMS = [
  { key: "instagram", label: "Instagram", placeholder: "https://instagram.com/deinrestaurant" },
  { key: "facebook", label: "Facebook", placeholder: "https://facebook.com/deinrestaurant" },
  { key: "tiktok", label: "TikTok", placeholder: "https://tiktok.com/@deinrestaurant" },
  { key: "twitter", label: "X / Twitter", placeholder: "https://x.com/deinrestaurant" },
  { key: "whatsapp", label: "WhatsApp", placeholder: "https://wa.me/49123456789" },
  { key: "website", label: "Website", placeholder: "https://www.deinrestaurant.de" },
  { key: "google", label: "Google-Bewertungslink", placeholder: "https://g.page/r/.../review", hint: "Gäste sehen nach einer Bestellung einen Button, der direkt zu deiner Google-Bewertungsseite führt. Den Link findest du im Google-Unternehmensprofil unter „Rezensionen erhalten“." },
];

const SocialLinksEditor = ({ restaurantId, userID, initialLinks }) => {
  const [links, setLinks] = useState(initialLinks ?? {});
  const [isEditing, setIsEditing] = useState(false);
  const [saved, setSaved] = useState(links);
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await fetch("/api/user/profil/updateRestaurant", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          restaurant: { id: restaurantId, socialLinks: links },
          locations: [],
          userID,
        }),
      });
      if (!res.ok) throw new Error("Fehler");
      setSaved(links);
      setIsEditing(false);
      toast.success("Social-Media-Links gespeichert!");
    } catch {
      toast.error("Fehler beim Speichern");
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setLinks(saved);
    setIsEditing(false);
  };

  return (
    <Card>
      <CardHeader>
        <h2 className="text-xl font-semibold">Social Media</h2>
      </CardHeader>
      <CardContent className="space-y-3">
        {SOCIAL_PLATFORMS.map(({ key, label, placeholder, hint }) => (
          <div key={key}>
            <Label className="text-sm text-gray-600">{label}</Label>
            {isEditing ? (
              <>
                <Input value={links[key] ?? ""} placeholder={placeholder} onChange={(e) => setLinks((prev) => ({ ...prev, [key]: e.target.value }))} />
                {hint && <p className="text-xs text-gray-400 mt-1">{hint}</p>}
              </>
            ) : (
              <p className="text-sm truncate">
                {saved[key] ? (
                  <a href={saved[key]} target="_blank" rel="noopener noreferrer" className="text-amber-600 hover:underline">
                    {saved[key]}
                  </a>
                ) : (
                  <span className="text-gray-400 italic">Nicht angegeben</span>
                )}
              </p>
            )}
          </div>
        ))}

        <div className="flex gap-3 pt-2">
          {isEditing ? (
            <>
              <Button onClick={handleSave} disabled={saving}>
                {saving ? "Speichern..." : "Speichern"}
              </Button>
              <Button variant="outline" onClick={handleCancel}>
                Abbrechen
              </Button>
            </>
          ) : (
            <Button onClick={() => setIsEditing(true)}>Bearbeiten</Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export { SocialLinksEditor };

const RestaurantData = ({ serverData, setServerData, restaurantID, userID }) => {
  const restaurant = serverData?.userData?.restaurant;

  const [isEditing, setIsEditing] = useState(false);
  const [editedRestaurant, setEditedRestaurant] = useState(null);
  const [editedLocations, setEditedLocations] = useState([]);
  const [originalRestaurant, setOriginalRestaurant] = useState(null);
  const [originalLocations, setOriginalLocations] = useState([]);
  const [errors, setErrors] = useState({});
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);
  const router = useRouter();

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

  const deleteRestaurant = () => {
    setConfirmDeleteOpen(true);
  };

  const handleConfirmDelete = async () => {
    setConfirmDeleteOpen(false);
    const resp = await fetch(`/api/deleteAccount/${userID}`, { method: "DELETE" });
    if (resp.ok) {
      toast.success("Account erfolgreich gelöscht!");
      await signOut().then(() => {
        router.push("./");
      });
    } else {
      toast.error("Fehler beim Löschen des Accounts");
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
              <Label>Beschreibung</Label>
              <textarea value={editedRestaurant?.description || ""} onChange={(e) => updateRestaurantField("description", e.target.value)} rows={3} placeholder="Kurze Beschreibung des Restaurants..." className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring resize-none" />
              <Label>Muttergesellschaft</Label>
              <Input value={editedRestaurant?.parentCompany || ""} onChange={(e) => updateRestaurantField("parentCompany", e.target.value)} />
            </>
          ) : (
            <>
              <p>
                <strong>Name:</strong> {restaurant?.name}
              </p>
              {restaurant?.description && (
                <p>
                  <strong>Beschreibung:</strong> {restaurant.description}
                </p>
              )}
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
      <div className="flex gap-3 flex-wrap">
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
        <Button asChild variant="outline">
          <Link href={{ pathname: "/settings", query: { ...(userID && { userID }), ...(restaurantID && { restaurantID }) } }}>⚙️ Einstellungen</Link>
        </Button>
      </div>
      <OpeningHoursEditor restaurantId={restaurant?.id} userID={userID} initialHours={restaurant?.openingHours ?? null} />
      <SocialLinksEditor restaurantId={restaurant?.id} userID={userID} initialLinks={restaurant?.socialLinks ?? {}} />
      <div>
        <Button variant="destructive" onClick={deleteRestaurant}>
          Account löschen
        </Button>
      </div>

      <ConfirmDialog open={confirmDeleteOpen} onOpenChange={setConfirmDeleteOpen} title="Account wirklich löschen?" description="Gelöschte Daten können nicht wiederhergestellt werden!" confirmLabel="Endgültig löschen" onConfirm={handleConfirmDelete} />
    </div>
  );
};
