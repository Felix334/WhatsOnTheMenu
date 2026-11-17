import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
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

import createAddressSchema from "./Schema/adressSchema";
import FontSelector from "./fontList";
import { OpeningHoursEditor } from "./openingHours";
import { BgImageUpload } from "./bgImageUpload";
import { MENU_THEMES } from "@/lib/menuThemes";
import { MENU_BG_PRESETS, MENU_FONT_PRESETS } from "@/lib/schemas/colorPresets";
import { useUiLanguage } from "@/app/components/useUiLanguage";
import { localizedPath } from "@/i18n/config";
import { fmt } from "@/i18n/format";

// Beschriftungen aus dashboard.design.density
const DENSITY_OPTIONS = ["compact", "normal", "airy"];

/* ===================== OPTION MENU ===================== */

const OptionMenu = ({ openOptions, setOpenOptions, bgColor, setNewBgColor, fontColor, setNewFontColor, restaurantID, serverData, allowPremiumColor, onPreviewChange, onDesignSaved, onThemeChanged, onBgImageChange }) => {
  const { t: uiDict, locale } = useUiLanguage();
  const t = uiDict.dashboard;
  const td = t.design;
  const themeLabel = (theme) => (locale === "de" ? theme?.label : (theme?.labelEn ?? theme?.label));
  const [localServerData, setLocalServerData] = useState(serverData);
  const [isEditingMenu, setIsEditingMenu] = useState(false);
  const [editedBgColor, setEditedBgColor] = useState(bgColor ?? "");
  const [editedFontColor, setEditedFontColor] = useState(fontColor ?? "");
  const [editedFont, setEditedFont] = useState("Arial");
  const [editedHeadingFont, setEditedHeadingFont] = useState("");
  const [editedDensity, setEditedDensity] = useState("normal");
  const [pendingTheme, setPendingTheme] = useState(null);
  const [applyingTheme, setApplyingTheme] = useState(false);
  const [savingMenu, setSavingMenu] = useState(false);
  const [confirmUndoTheme, setConfirmUndoTheme] = useState(false);

  const hasThemeSnapshot = !!serverData?.userData?.restaurant?.menu?.[0]?.hasThemeSnapshot;

  // Live-Vorschau: während der Bearbeitung zeigt die Karte hinter dem Panel
  // die ungespeicherten Werte. Beim Beenden (Speichern/Abbrechen) zurück auf null.
  useEffect(() => {
    if (!isEditingMenu) return;
    onPreviewChange?.({
      bgColor: editedBgColor,
      fontColor: editedFontColor,
      font: editedFont,
      headingFont: editedHeadingFont,
      density: editedDensity,
    });
  }, [isEditingMenu, editedBgColor, editedFontColor, editedFont, editedHeadingFont, editedDensity, onPreviewChange]);

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
    setEditedFontColor(fontColor ?? "");
  }, [fontColor]);

  useEffect(() => {
    const menu = serverData?.userData?.restaurant?.menu?.[0];
    if (menu?.font) setEditedFont(menu.font);
    setEditedHeadingFont(menu?.headingFont ?? "");
    setEditedDensity(menu?.density || "normal");
  }, [serverData]);

  const handleSaveMenu = async () => {
    setSavingMenu(true);
    try {
      const response = await fetch(`/api/user/profil/updateMenu`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          bgColor: editedBgColor,
          fontColor: editedFontColor,
          font: editedFont,
          headingFont: editedHeadingFont,
          density: editedDensity,
          restaurantID,
          userID,
        }),
        credentials: "include",
      });

      if (!response.ok) {
        const err = await response.json().catch(() => ({}));
        throw new Error(err.message || `HTTP ${response.status}`);
      }

      setNewBgColor(editedBgColor);
      setNewFontColor(editedFontColor);
      setIsEditingMenu(false);
      // Gleiche Normalisierung wie updateMenu: leere Werte = Standard (null)
      onDesignSaved?.({
        bgColor: editedBgColor || bgColor,
        fontColor: editedFontColor || null,
        font: editedFont,
        headingFont: editedHeadingFont || null,
        density: editedDensity || null,
      });
      toast.success(td.saved);
    } catch (err) {
      toast.error(td.saveError + err.message);
    } finally {
      setSavingMenu(false);
    }
  };

  const handleCancelMenu = () => {
    const menu = serverData?.userData?.restaurant?.menu?.[0];
    setEditedBgColor(bgColor ?? "");
    setEditedFontColor(fontColor ?? "");
    setEditedFont(menu?.font || "Arial");
    setEditedHeadingFont(menu?.headingFont ?? "");
    setEditedDensity(menu?.density || "normal");
    setIsEditingMenu(false);
    onPreviewChange?.(null);
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
      setIsEditingMenu(false);
      await onThemeChanged?.();
      toast.success(td.themeApplied, {
        action: { label: td.undo, onClick: () => undoTheme() },
      });
    } catch {
      toast.error(td.themeError);
    } finally {
      setApplyingTheme(false);
    }
  };

  const undoTheme = async () => {
    setApplyingTheme(true);
    try {
      const response = await fetch(`/api/user/profil/undoTheme`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ restaurantID }),
        credentials: "include",
      });
      if (!response.ok) {
        const err = await response.json().catch(() => ({}));
        throw new Error(err.message || `HTTP ${response.status}`);
      }
      setIsEditingMenu(false);
      await onThemeChanged?.();
      toast.success(td.undone);
    } catch (err) {
      toast.error(td.undoError + err.message);
    } finally {
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
            <SheetTitle>{td.title}</SheetTitle>
            <SheetDescription>{td.description}</SheetDescription>
          </SheetHeader>

          <div className="p-4 space-y-4">
            <Label>{td.background}</Label>
            {allowPremiumColor ? (
              <>
                <Input type="color" value={isEditingMenu ? editedBgColor : bgColor} disabled={!isEditingMenu} onChange={(e) => setEditedBgColor(e.target.value)} />
              </>
            ) : (
              <>
                <select value={isEditingMenu ? editedBgColor : bgColor} disabled={!isEditingMenu} onChange={(e) => setEditedBgColor(e.target.value)} className="border rounded px-2 py-1">
                  <option value="">{t.common.chooseColor}</option>
                  {MENU_BG_PRESETS.map((p) => (
                    <option key={p.value} className={p.className} value={p.value}>
                      {locale === "de" ? p.label : (p.labelEn ?? p.label)}
                    </option>
                  ))}
                </select>
              </>
            )}

            {/* Wird sofort gespeichert, unabhängig von „Menü bearbeiten“ */}
            <BgImageUpload restaurantID={restaurantID} bgImageUrl={serverData?.userData?.restaurant?.menu?.[0]?.bgImageUrl ?? null} onChange={onBgImageChange} />

            <Label>{t.style.fontColor}</Label>
            {allowPremiumColor ? (
              <>
                <Input type="color" value={isEditingMenu ? editedFontColor || "#212529" : fontColor || "#212529"} disabled={!isEditingMenu} onChange={(e) => setEditedFontColor(e.target.value)} />
                {isEditingMenu && editedFontColor && (
                  <button type="button" onClick={() => setEditedFontColor("")} className="text-xs text-gray-400 hover:text-gray-700 whitespace-nowrap">
                    {td.resetDefault}
                  </button>
                )}
              </>
            ) : (
              <select value={isEditingMenu ? editedFontColor : fontColor || ""} disabled={!isEditingMenu} onChange={(e) => setEditedFontColor(e.target.value)} className="border rounded px-2 py-1">
                <option value="">{t.style.default}</option>
                {MENU_FONT_PRESETS.map((p) => (
                  <option key={p.value} className={p.className} value={p.value}>
                    {locale === "de" ? p.label : (p.labelEn ?? p.label)}
                  </option>
                ))}
              </select>
            )}

            <Label>{td.font}</Label>
            {isEditingMenu ? (
              <FontSelector onFontChange={setEditedFont} value={editedFont} />
            ) : (
              <p className="text-sm text-gray-600 py-1" style={{ fontFamily: editedFont || "inherit" }}>
                {editedFont || t.style.default}
              </p>
            )}

            <Label>{td.headingFont}</Label>
            {isEditingMenu ? (
              <div className="space-y-2">
                <FontSelector onFontChange={setEditedHeadingFont} value={editedHeadingFont || editedFont} />
                {editedHeadingFont && (
                  <button type="button" onClick={() => setEditedHeadingFont("")} className="text-xs text-gray-400 hover:text-gray-700">
                    {td.resetLikeBody}
                  </button>
                )}
              </div>
            ) : (
              <p className="text-sm text-gray-600 py-1" style={{ fontFamily: editedHeadingFont || editedFont || "inherit" }}>
                {editedHeadingFont || td.likeBody}
              </p>
            )}

            <Label>{td.densityLabel}</Label>
            <div className="flex gap-2">
              {DENSITY_OPTIONS.map((value) => (
                <button
                  key={value}
                  type="button"
                  disabled={!isEditingMenu}
                  onClick={() => setEditedDensity(value)}
                  className={`flex-1 py-2 text-sm rounded-xl border-2 transition-all disabled:opacity-50 ${editedDensity === value ? "border-gray-900 bg-gray-900 text-white font-semibold" : "border-gray-200 text-gray-600 hover:border-gray-400"}`}
                >
                  {td.density[value]}
                </button>
              ))}
            </div>

            {isEditingMenu ? (
              <>
                <p className="text-xs text-gray-500">{td.previewHint}</p>
                <div className="flex gap-2">
                  <Button onClick={handleSaveMenu} disabled={savingMenu}>
                    {savingMenu ? t.common.saving : t.common.save}
                  </Button>
                  <Button variant="outline" onClick={handleCancelMenu} disabled={savingMenu}>
                    {t.common.cancel}
                  </Button>
                </div>
              </>
            ) : (
              <Button onClick={() => setIsEditingMenu(true)}>{td.editMenu}</Button>
            )}

            <div className="pt-4 border-t space-y-3">
              <Label>{td.themes}</Label>
              {!allowPremiumColor && (
                <p className="text-xs text-amber-600">
                  {td.themesPremiumBefore}{" "}
                  <Link href={localizedPath("/pricing", locale)} className="underline font-medium">
                    {t.common.upgrade}
                  </Link>
                  {td.themesPremiumAfter}
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
                        {themeLabel(theme)}
                      </p>
                      <p className="text-xs text-gray-500">{locale === "de" ? theme.description : (theme.descriptionEn ?? theme.description)}</p>
                    </div>
                  </button>
                ))}
              </div>
              {hasThemeSnapshot && (
                <Button variant="outline" size="sm" onClick={() => setConfirmUndoTheme(true)} disabled={applyingTheme}>
                  {td.undoLastTheme}
                </Button>
              )}
            </div>

            <ConfirmDialog
              open={pendingTheme !== null}
              onOpenChange={(open) => !open && setPendingTheme(null)}
              title={fmt(td.applyThemeTitle, { name: themeLabel(MENU_THEMES[pendingTheme]) ?? "" })}
              description={td.applyThemeText}
              confirmLabel={td.apply}
              destructive={false}
              onConfirm={() => {
                const themeKey = pendingTheme;
                setPendingTheme(null);
                applyTheme(themeKey);
              }}
            />

            <ConfirmDialog
              open={confirmUndoTheme}
              onOpenChange={setConfirmUndoTheme}
              title={td.undoThemeTitle}
              description={td.undoThemeText}
              confirmLabel={td.undoConfirm}
              onConfirm={() => {
                setConfirmUndoTheme(false);
                undoTheme();
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
  // Beschriftung und Hinweis aus dashboard.social (googleLabel, googleHint)
  { key: "google", placeholder: "https://g.page/r/.../review" },
];

const SocialLinksEditor = ({ restaurantId, userID, initialLinks }) => {
  const { t: uiDict } = useUiLanguage();
  const t = uiDict.dashboard;
  const ts = t.social;
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
      if (!res.ok) throw new Error("save failed");
      setSaved(links);
      setIsEditing(false);
      toast.success(ts.saved);
    } catch {
      toast.error(t.common.saveError);
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
        <h2 className="text-xl font-semibold">{ts.title}</h2>
      </CardHeader>
      <CardContent className="space-y-3">
        {SOCIAL_PLATFORMS.map(({ key, label = ts.googleLabel, placeholder, hint = key === "google" ? ts.googleHint : null }) => (
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
                  <span className="text-gray-400 italic">{ts.notSet}</span>
                )}
              </p>
            )}
          </div>
        ))}

        <div className="flex gap-3 pt-2">
          {isEditing ? (
            <>
              <Button onClick={handleSave} disabled={saving}>
                {saving ? t.common.saving : t.common.save}
              </Button>
              <Button variant="outline" onClick={handleCancel}>
                {t.common.cancel}
              </Button>
            </>
          ) : (
            <Button onClick={() => setIsEditing(true)}>{t.common.edit}</Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export { SocialLinksEditor };

const RestaurantData = ({ serverData, setServerData, restaurantID, userID }) => {
  const { t: uiDict } = useUiLanguage();
  const t = uiDict.dashboard;
  const tr = t.restaurant;
  const addressSchema = useMemo(() => createAddressSchema(tr.addressErrors), [tr]);
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
      toast.success(tr.accountDeleted);
      await signOut().then(() => {
        router.push("./");
      });
    } else {
      toast.error(tr.accountDeleteError);
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
          <h2 className="text-xl font-semibold">{tr.title}</h2>
        </CardHeader>
        <CardContent className="space-y-2">
          {isEditing ? (
            <>
              <Label>{t.style.name}</Label>
              <Input value={editedRestaurant?.name || ""} onChange={(e) => updateRestaurantField("name", e.target.value)} />
              <Label>{tr.description}</Label>
              <textarea value={editedRestaurant?.description || ""} onChange={(e) => updateRestaurantField("description", e.target.value)} rows={3} placeholder={tr.descriptionPlaceholder} className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring resize-none" />
              <Label>{tr.parentCompany}</Label>
              <Input value={editedRestaurant?.parentCompany || ""} onChange={(e) => updateRestaurantField("parentCompany", e.target.value)} />
            </>
          ) : (
            <>
              <p>
                <strong>{t.style.name}:</strong> {restaurant?.name}
              </p>
              {restaurant?.description && (
                <p>
                  <strong>{tr.description}:</strong> {restaurant.description}
                </p>
              )}
              <p>
                <strong>{tr.parentCompany}:</strong> {restaurant?.parentCompany}
              </p>
            </>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <h2 className="text-xl font-semibold">{tr.locations}</h2>
        </CardHeader>
        <CardContent className="space-y-4">
          {(isEditing ? editedLocations : restaurant?.locations || []).map((loc, index) => (
            <div key={index} className="border p-4 rounded space-y-2">
              {!isEditing && (
                <p>
                  <strong>{tr.address}:</strong> {loc.street} {loc.houseNumber} {loc.postalCode} {loc.city}, {loc.country}
                </p>
              )}
              {isEditing && (
                <>
                  {[
                    { value: "street", name: tr.fields.street },
                    { value: "houseNumber", name: tr.fields.houseNumber },
                    { value: "city", name: tr.fields.city },
                    { value: "postalCode", name: tr.fields.postalCode },
                    { value: "country", name: tr.fields.country },
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
              {tr.addAddress}
            </Button>
          )}
        </CardContent>
      </Card>

      <div className="flex justify-end gap-3">
        {isEditing ? (
          <>
            <Button variant="outline" onClick={() => setIsEditing(false)}>
              {t.common.cancel}
            </Button>
            <Button onClick={handleSave}>{t.common.save}</Button>
          </>
        ) : (
          <Button onClick={() => setIsEditing(true)}>{t.common.edit}</Button>
        )}
      </div>
      <div className="flex gap-3 flex-wrap">
        <Button asChild>
          <Link
            href={{
              pathname: "/dashboard/qr-codes",
              query: {
                ...(userID && { userID }),
                ...(restaurantID && { restaurantID }),
              },
            }}
          >
            {tr.createQr}
          </Link>
        </Button>
        <Button asChild variant="outline">
          <Link href={{ pathname: "/settings", query: { ...(userID && { userID }), ...(restaurantID && { restaurantID }) } }}>{tr.settings}</Link>
        </Button>
      </div>
      <OpeningHoursEditor restaurantId={restaurant?.id} userID={userID} initialHours={restaurant?.openingHours ?? null} />
      <SocialLinksEditor restaurantId={restaurant?.id} userID={userID} initialLinks={restaurant?.socialLinks ?? {}} />
      <div>
        <Button variant="destructive" onClick={deleteRestaurant}>
          {tr.deleteAccount}
        </Button>
      </div>

      <ConfirmDialog open={confirmDeleteOpen} onOpenChange={setConfirmDeleteOpen} title={tr.confirmDeleteTitle} description={tr.confirmDeleteText} confirmLabel={tr.confirmDeleteButton} onConfirm={handleConfirmDelete} />
    </div>
  );
};
