"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { DynamicLink } from "@/app/components/DynamicLink";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetFooter, SheetTrigger } from "@/components/ui/sheet";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

import { toast } from "sonner";
import { FaPen } from "react-icons/fa";
import { ArrowLeft, ClipboardList, ClipboardPaste, Eye, Percent, Printer, Save } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";

import { menuSchema } from "./components/menuSchema";
import { OptionMenu } from "./components/optionMenu";
import { TierSystem } from "./components/TierLimits";
import { useRestaurantData, markUserAnsichtNavigation } from "./components/fetchData";
import { EdditCategoryGroup } from "./components/edditCategoryGroup";
import { SortComponents } from "./components/sortMenu";
import { bgColorClass, bgColorStyle } from "./components/ColorPicker";
import { CalendarWin } from "./components/calendarWin";
import { MenuSection } from "./components/menuSection";
import { BulkImport } from "./components/bulkImport";
import { BulkPriceDialog } from "./components/bulkPrice";
import { MoveDishDialog } from "./components/moveDish";
import { clearDraft, formatDraftAge, loadDraft, saveDraft } from "./components/draftStorage";
import { applyPriceChange } from "@/lib/priceRules";

const HERO_COLOR_PRESETS = [
  { key: "amber", label: "Amber", gradient: "from-amber-700 via-orange-600 to-amber-600" },
  { key: "green", label: "Grün", gradient: "from-emerald-700 via-green-600 to-teal-600" },
  { key: "blue", label: "Blau", gradient: "from-blue-700 via-indigo-600 to-blue-600" },
  { key: "red", label: "Rot", gradient: "from-red-700 via-rose-600 to-red-500" },
  { key: "purple", label: "Lila", gradient: "from-purple-700 via-violet-600 to-purple-500" },
  { key: "dark", label: "Dunkel", gradient: "from-gray-900 via-gray-800 to-gray-700" },
  { key: "white", label: "Weiß", gradient: "white" },
];

const HERO_GRADIENT_MAP = Object.fromEntries(HERO_COLOR_PRESETS.map(({ key, gradient }) => [key, gradient]));

export default function PageBuilder() {
  const router = useRouter();

  const [components, setComponents] = useState([]);
  const [deletedDishes, setDeletedDishes] = useState([]);
  const [deletedCategories, setDeletedCategories] = useState([]);
  const [deleteCategoryGroups, setDeleteCategoryGroups] = useState([]);
  const [, setNewBgColor] = useState();
  const [, setNewFontColor] = useState();

  const deletedDishesRef = useRef([]);
  const deletedCategoriesRef = useRef([]);
  const deletedCategoryGroupRef = useRef([]);

  const [userID, setUserID] = useState("");

  const { serverData, setServerData, refetch, isLoading, restaurantID, bgColor, fontColor, font, headingFont, density, positionNum } = useRestaurantData(userID);

  const [isSaving, setIsSaving] = useState(false);

  // Controlled sheets
  const [openEditor, setOpenEditor] = useState(false);
  const [openOptions, setOpenOptions] = useState(false);
  const [openCalendarWin, setOpenCalendarWin] = useState(false);
  const [autherized, setIsAutherizedUser] = useState(false);

  // Hero editing
  const [isEditingHero, setIsEditingHero] = useState(false);
  const [heroName, setHeroName] = useState("");
  const [heroDescription, setHeroDescription] = useState("");
  const [heroColor, setHeroColor] = useState(null);
  const [heroTextColor, setHeroTextColor] = useState("#ffffff");
  const [savingHero, setSavingHero] = useState(false);
  const heroBaselineRef = useRef({ name: "", description: "", heroColor: null, heroTextColor: "#ffffff" });
  const [Limit, setLimit] = useState({});
  const [exeedCatLimit, setExeedCatLimit] = useState(false);
  const [exeedDishLimit, setExeedDishLimit] = useState(false);
  const [catCount, setCatCount] = useState(0);
  const [dishCount, setDishCount] = useState(0);
  const [allowPremiumColor, setAllowPremiumColor] = useState(false);
  const [allowAvailability, setAllowAvailability] = useState(false);
  const [renderCatGroupMenu, setRenderCatGroupMenu] = useState(null);
  const [groupBorderMap, setGroupBorderMap] = useState({});
  const [groupColorMap, setGroupColorMap] = useState({});
  const [groupFontColorMap, setGroupFontColorMap] = useState({});
  const [groupAlignMap, setGroupAlignMap] = useState({});

  // Schnellerfassung, Preis-Massenänderung, Gericht verschieben
  const [openBulkImport, setOpenBulkImport] = useState(false);
  const [openBulkPrice, setOpenBulkPrice] = useState(false);
  const [moveTarget, setMoveTarget] = useState(null); // { dish, categoryId } | null
  const [confirmDiscard, setConfirmDiscard] = useState(false);

  // Entwurf: erst nach dem Laden schreiben, sonst überschreibt der leere
  // Anfangszustand einen vorhandenen Entwurf, bevor er wiederhergestellt wurde.
  const [draftRestored, setDraftRestored] = useState(null); // savedAt | null
  const draftReadyRef = useRef(false);
  // Zwischen "Entwurf geladen" und "Entwurf im State angekommen" liegt ein
  // Render. Liefe der Schreib-Effekt in diesem Fenster, würde er den gerade
  // geladenen Entwurf mit dem noch leeren State überschreiben. Gemerkt wird
  // deshalb das geladene Array selbst — erst wenn es identisch im State steht,
  // darf wieder geschrieben werden (robust auch bei mehrfachen Effekt-Läufen
  // wie im StrictMode).
  const pendingRestoreRef = useRef(null);

  const { data: session, status } = useSession();

  useEffect(() => {
    if (status !== "authenticated" || !session?.user || autherized) return;

    if (session.user.role !== "Owner") return;

    setUserID(session.user.id);

    const sub = session.user.subscription;

    switch (sub) {
      case "FreeTier":
        setLimit(TierSystem.FreeTier);
        break;
      case "Professional":
        setLimit(TierSystem.Professional);
        setAllowPremiumColor(true);
        setAllowAvailability(true);
        break;
      case "Business":
        setLimit(TierSystem.Business);
        setAllowPremiumColor(true);
        break;
      default:
        setLimit(TierSystem.FreeTier);
        break;
    }

    setIsAutherizedUser(true);
  }, [status, autherized, session]);

  useEffect(() => {
    if (!serverData) return;
    const name = serverData?.userData?.restaurant?.name || "";
    const description = serverData?.userData?.restaurant?.menu?.[0]?.description || "";
    const heroColorVal = serverData?.userData?.restaurant?.menu?.[0]?.heroColor || null;
    const heroTextColorVal = serverData?.userData?.restaurant?.menu?.[0]?.heroTextColor || "#ffffff";

    setHeroName(name);
    setHeroDescription(description);
    setHeroColor(heroColorVal);
    setHeroTextColor(heroTextColorVal);
    heroBaselineRef.current = { name, description, heroColor: heroColorVal, heroTextColor: heroTextColorVal };
  }, [serverData]);

  const saveHero = async () => {
    const restaurantId = serverData?.userData?.restaurant?.id;
    if (!restaurantId) return;

    // Nur die Felder senden, die sich gegenüber der Baseline geändert haben.
    const base = heroBaselineRef.current;
    const changed = {};
    if (heroName !== base.name) changed.name = heroName;
    if (heroDescription !== base.description) changed.description = heroDescription;
    if (heroColor !== base.heroColor) changed.heroColor = heroColor;
    if (heroTextColor !== base.heroTextColor) changed.heroTextColor = heroTextColor;

    // Nichts geändert → keine Anfrage.
    if (Object.keys(changed).length === 0) {
      setIsEditingHero(false);
      return;
    }

    setSavingHero(true);
    try {
      const res = await fetch("/api/user/profil/updateHero", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ restaurantId, ...changed }),
      });
      if (!res.ok) throw new Error("Fehler beim Speichern");
      // Baseline auf die gespeicherten Werte anheben, damit ein erneutes
      // Speichern in derselben Sitzung nicht wieder unveränderte Felder schickt.
      heroBaselineRef.current = { ...base, ...changed };
      toast.success("Header gespeichert!");
      setIsEditingHero(false);
    } catch (err) {
      toast.error("Fehler: " + err.message);
    } finally {
      setSavingHero(false);
    }
  };

  // Moved calculateLimit to useEffect below to fix ReferenceError

  useEffect(() => {
    if (!serverData || !Limit) return;
    const cats = (serverData?.userData?.restaurant?.menu?.[0]?.categoryGroup?.flatMap((cg) => cg.categories || []).length || 0) + (components.length || 0);
    const dishes = (serverData?.userData?.restaurant?.menu?.[0]?.categoryGroup?.flatMap((cg) => cg.categories?.flatMap((c) => c.dishes || []) || []).length || 0) + components.reduce((acc, c) => acc + (c.section.items?.length || 0), 0);
    setCatCount(cats);
    setDishCount(dishes);
    setExeedCatLimit(cats >= Limit.CategoryLimit);
    setExeedDishLimit(dishes >= Limit.DishLimit);
  }, [components, serverData, Limit]);

  const form = useForm({
    resolver: zodResolver(menuSchema),
    defaultValues: {
      menu_col: "",
      menu_name: "",
      items: [{ name: "", price: 0, description: "" }],
    },
  });

  const { control, handleSubmit, reset } = form;
  const { fields, append, remove } = useFieldArray({ control, name: "items" });

  const renderCategoryGroupEdit = (id) => {
    setRenderCatGroupMenu((prev) => (prev === id ? null : id));
  };

  const updateDeletedDishes = (id) => {
    setDeletedDishes((prev) => {
      const updated = [...prev, id];
      deletedDishesRef.current = updated;
      return updated;
    });
  };

  const updateDeletedCategories = (id) => {
    setDeletedCategories((prev) => {
      const updated = [...prev, id];
      deletedCategoriesRef.current = updated;
      return updated;
    });
  };
  const updateDeleteCategorieGroups = (id) => {
    setDeleteCategoryGroups((prev) => {
      const updated = [...prev, id];
      deletedCategoryGroupRef.current = updated;
      return updated;
    });
  };

  const submitToServer = (data) => {
    const newSection = {
      categoryGroup: data.menu_col, // ← hinzufügen
      title: data.menu_name,
      items: data.items,
    };
    setComponents((prev) => [...prev, { type: "menuSection", section: newSection }]);
  };
  // Duplicate hook removed - using one above

  const onSubmit = async (data) => {
    submitToServer(data);
    setOpenEditor(false);
  };

  // ── Entwurf (localStorage) ────────────────────────────────────────────────
  // Wiederherstellen, sobald das Restaurant bekannt ist. Läuft genau einmal —
  // danach übernimmt der Schreib-Effekt unten.
  useEffect(() => {
    if (!restaurantID || draftReadyRef.current) return;

    const draft = loadDraft(restaurantID);
    if (draft) {
      setComponents(draft.components);
      setDeletedDishes(draft.deletedDishes);
      setDeletedCategories(draft.deletedCategories);
      setDeleteCategoryGroups(draft.deletedCategoryGroups);
      // Die Refs füttern submitData/deleteData — ohne sie würden die
      // wiederhergestellten Löschungen beim Speichern verschluckt.
      deletedDishesRef.current = draft.deletedDishes;
      deletedCategoriesRef.current = draft.deletedCategories;
      deletedCategoryGroupRef.current = draft.deletedCategoryGroups;
      setDraftRestored(draft.savedAt);
      pendingRestoreRef.current = draft;
    }

    draftReadyRef.current = true;
  }, [restaurantID]);

  // Jede Änderung an den vorgemerkten Daten sichern.
  useEffect(() => {
    if (!restaurantID || !draftReadyRef.current) return;

    if (pendingRestoreRef.current) {
      // Referenz-Vergleich: setComponents hat genau dieses Array gespeichert.
      if (components !== pendingRestoreRef.current.components) return;
      pendingRestoreRef.current = null;
    }

    saveDraft(restaurantID, {
      components,
      deletedDishes,
      deletedCategories,
      deletedCategoryGroups: deleteCategoryGroups,
    });
  }, [restaurantID, components, deletedDishes, deletedCategories, deleteCategoryGroups]);

  // Setzt alle vorgemerkten Änderungen zurück — von "Verwerfen" und nach
  // erfolgreichem Speichern genutzt.
  const resetPendingChanges = () => {
    setComponents([]);
    setDeletedDishes([]);
    setDeletedCategories([]);
    setDeleteCategoryGroups([]);
    deletedDishesRef.current = [];
    deletedCategoriesRef.current = [];
    deletedCategoryGroupRef.current = [];
    pendingRestoreRef.current = null;
    clearDraft(restaurantID);
    setDraftRestored(null);
  };

  const discardDraft = () => {
    resetPendingChanges();
    toast.success("Änderungen verworfen");
  };

  // ── Duplizieren ───────────────────────────────────────────────────────────
  // Kopien laufen über denselben Weg wie jede Neuanlage: als menuSection in
  // `components` vorgemerkt und beim Speichern von setData angelegt. Sie sind
  // deshalb erst nach dem Speichern in der Karte sichtbar.
  const uniqueCopyName = (baseName, existingNames) => {
    let candidate = `${baseName} (Kopie)`;
    let counter = 2;
    while (existingNames.includes(candidate)) {
      candidate = `${baseName} (Kopie ${counter})`;
      counter += 1;
    }
    return candidate;
  };

  const duplicateDish = ({ dish, categoryName, groupName }) => {
    if (exeedDishLimit) {
      toast.error(`Gericht-Limit (${Limit.DishLimit}) erreicht`);
      return;
    }
    // Ohne id → setData legt ein neues Gericht an, statt das bestehende zu ändern.
    setComponents((prev) => [
      ...prev,
      {
        type: "menuSection",
        section: {
          categoryGroup: groupName,
          title: categoryName,
          items: [
            {
              name: `${dish.name} (Kopie)`,
              description: dish.description ?? "",
              price: Number(dish.price ?? 0).toFixed(2),
            },
          ],
        },
      },
    ]);
    toast.success("Kopie vorgemerkt — erscheint nach dem Speichern");
  };

  const duplicateCategory = ({ categoryName, groupName, dishes }) => {
    if (exeedCatLimit) {
      toast.error(`Kategorie-Limit (${Limit.CategoryLimit}) erreicht`);
      return;
    }

    const freeDishSlots = Math.max(0, (Limit.DishLimit ?? 0) - dishCount);
    const items = (dishes ?? []).slice(0, freeDishSlots).map((d) => ({
      name: d.name,
      description: d.description ?? "",
      price: Number(d.price ?? 0).toFixed(2),
    }));

    // Der Name muss neu sein: setData ordnet Kategorien innerhalb einer Gruppe
    // über den Namen zu — ein identischer Name würde das Original befüllen.
    const newName = uniqueCopyName(categoryName, categoryNames);

    setComponents((prev) => [...prev, { type: "menuSection", section: { categoryGroup: groupName, title: newName, items } }]);

    const skipped = (dishes?.length ?? 0) - items.length;
    toast.success(`„${newName}“ vorgemerkt${skipped > 0 ? ` — ${skipped} Gerichte wegen Limit ausgelassen` : ""}`);
  };

  const handleBulkImport = (section) => {
    setComponents((prev) => [...prev, section]);
  };

  // ── Verschobenes Gericht lokal nachziehen ─────────────────────────────────
  // Die API hat bereits gespeichert; hier wird nur der geladene Datenstand
  // angeglichen, damit kein kompletter Reload nötig ist.
  const handleDishMoved = (dishId, fromCategoryId, toCategoryId) => {
    setServerData((prev) => {
      const menu = prev?.userData?.restaurant?.menu?.[0];
      if (!menu) return prev;

      let movedDish = null;
      const groupsWithout = menu.categoryGroup.map((group) => ({
        ...group,
        categories: (group.categories ?? []).map((cat) => {
          if (cat.id !== fromCategoryId) return cat;
          const remaining = [];
          for (const dish of cat.dishes ?? []) {
            if (dish.id === dishId) movedDish = dish;
            else remaining.push(dish);
          }
          return { ...cat, dishes: remaining };
        }),
      }));

      if (!movedDish) return prev;

      const groupsWithDish = groupsWithout.map((group) => ({
        ...group,
        categories: group.categories.map((cat) => (cat.id === toCategoryId ? { ...cat, dishes: [...(cat.dishes ?? []), movedDish] } : cat)),
      }));

      return {
        ...prev,
        userData: {
          ...prev.userData,
          restaurant: {
            ...prev.userData.restaurant,
            menu: [{ ...menu, categoryGroup: groupsWithDish }, ...prev.userData.restaurant.menu.slice(1)],
          },
        },
      };
    });
  };

  // ── Preis-Massenänderung lokal nachziehen ─────────────────────────────────
  // Dieselbe Formel wie die API (src/lib/priceRules.js) — die angezeigten
  // Preise stimmen daher mit den gespeicherten überein.
  const handleBulkPriceApplied = ({ scope, categoryId, mode, value, rounding }) => {
    setServerData((prev) => {
      const menu = prev?.userData?.restaurant?.menu?.[0];
      if (!menu) return prev;

      const updatedGroups = menu.categoryGroup.map((group) => ({
        ...group,
        categories: (group.categories ?? []).map((cat) => {
          if (scope === "category" && cat.id !== categoryId) return cat;
          return {
            ...cat,
            dishes: (cat.dishes ?? []).map((dish) => {
              const next = applyPriceChange(Number(dish.price), mode, value, rounding);
              return next === null ? dish : { ...dish, price: next };
            }),
          };
        }),
      }));

      return {
        ...prev,
        userData: {
          ...prev.userData,
          restaurant: {
            ...prev.userData.restaurant,
            menu: [{ ...menu, categoryGroup: updatedGroups }, ...prev.userData.restaurant.menu.slice(1)],
          },
        },
      };
    });
  };

  const submitData = async () => {
    const restaurantID = serverData.userData.restaurant.id;
    setIsSaving(true);

    try {
      const payload = JSON.stringify({
        restaurantId: restaurantID,
        data: components,
      });

      if (process.env.NODE_ENV === "development") {
        console.log("Size:", new TextEncoder().encode(payload).length, "Bytes");
      }

      const response = await fetch("/api/user/profil/setData", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: payload,
      });

      const resData = await response.json();

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}, Message: ${resData.message || "N/A"}, Error: ${resData.error || "N/A"}`);
      }

      if (deletedDishesRef.current.length > 0 || deletedCategoriesRef.current.length > 0 || deletedCategoryGroupRef.current.length > 0) {
        const deleteResponse = await fetch("/api/user/profil/deleteData", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            restaurantId: restaurantID,
            dishes: deletedDishesRef.current,
            categories: deletedCategoriesRef.current,
            categoryGroups: deletedCategoryGroupRef.current,
          }),
        });

        const deleteResData = await deleteResponse.json();

        if (!deleteResponse.ok) {
          throw new Error(`Delete error! status: ${deleteResponse.status}, Message: ${deleteResData.message || "N/A"}, Error: ${deleteResData.error || "N/A"}`);
        }
      }

      // Alle vorgemerkten Änderungen sind jetzt in der DB. Zurücksetzen ist
      // Pflicht, nicht Kosmetik: ohne das würde ein zweiter Klick auf
      // "Speichern" dieselben Gerichte ein zweites Mal anlegen (die
      // vorgemerkten Einträge haben keine id, setData legt sie also neu an).
      resetPendingChanges();

      // Frisch laden, damit die neuen Einträge (inkl. ihrer Server-IDs) sichtbar werden.
      await refetch();

      toast.success("Daten erfolgreich gespeichert!");
    } catch (err) {
      console.error("Failed to save data:", err);
      toast.error("Fehler beim Speichern: " + err.message);
    } finally {
      setIsSaving(false);
    }
  };

  const goBackBtn = () => {
    markUserAnsichtNavigation();
    router.push("../");
  };

  const categoryGroups = serverData?.userData?.restaurant?.menu?.[0]?.categoryGroup ?? [];
  const categoryGroupNames = [...new Set([...categoryGroups.map((group) => group.name), "Mittagessen", "Abendessen", "Frühstück", "Snacks", "Getränke"])].filter((name) => name && name.trim());
  const categoryNames = categoryGroups.flatMap((group) => (group.categories ?? []).map((cat) => cat.name)).filter((name) => name && name.trim());

  // Bezahlte Tarife — Preis-Massenänderung und Druckansicht. Die eigentliche
  // Durchsetzung passiert serverseitig (api/user/profil/bulkPrice); hier geht
  // es nur darum, keine Buttons zu zeigen, die ohnehin abgelehnt würden.
  const isPaidTier = ["Professional", "Business"].includes(session?.user?.subscription);
  const remainingDishes = Math.max(0, (Limit.DishLimit ?? 0) - dishCount);

  const MenuEditor = ({ categoryGroupNames }) => (
    <Sheet open={openEditor} onOpenChange={setOpenEditor}>
      <div></div>
      <SheetTrigger asChild>
        <Button variant="outline">Hinzufügen</Button>
      </SheetTrigger>
      <SheetContent side="right" className="w-full max-w-3xl">
        <SheetHeader>
          <SheetTitle>Menü-Dashboard</SheetTitle>
          <SheetDescription>Hier können Sie ganz einfach eine neue Kategoriegruppe erstellen oder etwas zu einer bestehenden Gruppe/Kategorie hinzufügen</SheetDescription>
        </SheetHeader>
        <ScrollArea className="h-[70vh]">
          <div className="pl-2 pt-1">
            <Form {...form}>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={control}
                  name="menu_col"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Kategorie-Gruppe</FormLabel>
                      <>
                        <FormControl>
                          <Input list="categoryGroup" minLength={1} autoComplete="new-password" autoCorrect="off" spellCheck="false" placeholder="Hinzufügen oder erstellen" {...field} className="w-[90%]" />
                        </FormControl>
                        <datalist id="categoryGroup">
                          {categoryGroupNames.map((name) => (
                            <option key={name} value={name} />
                          ))}
                        </datalist>
                      </>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={control}
                  name="menu_name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Kategorie</FormLabel>
                      <>
                        <FormControl>
                          <Input list="categoryNames" autoComplete="off" autoCorrect="off" spellCheck="false" placeholder="z.B. Pasta Menü" {...field} className="w-[90%]" />
                        </FormControl>
                        <datalist id="categoryNames">
                          {categoryNames.map((name) => (
                            <option key={name} value={name} />
                          ))}
                        </datalist>
                      </>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="space-y-4 border-t pt-4">
                  <h3 className="text-lg font-semibold">Gerichte:</h3>
                  {fields.map((item, index) => (
                    <div key={item.id} className="p-4 border rounded-xl bg-gray-50 relative">
                      <FormField
                        control={control}
                        name={`items.${index}.name`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="pt-3">Gerichtname:</FormLabel>
                            <FormControl>
                              <Input placeholder="z.B. Spaghetti" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={control}
                        name={`items.${index}.description`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="pt-3">Beschreibung:</FormLabel>
                            <FormControl>
                              <div className="pt-0.5">
                                <Input placeholder="z.B. Mit Sahnesauce" {...field} />
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={control}
                        name={`items.${index}.price`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="pt-3">Preis:</FormLabel>
                            <FormControl>
                              <div className="flex items-center gap-2 pt-0.5">
                                <Input placeholder="z.B. 9.50" type="text" inputMode="decimal" {...field} className="w-24" />
                                <span className="text-gray-600">€</span>
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <Button type="button" variant="ghost" className="absolute top-2 right-2 text-red-500" onClick={() => remove(index)}>
                        Entfernen
                      </Button>
                    </div>
                  ))}
                </div>

                <div className="flex justify-between pt-4">
                  <Button type="submit">Speichern</Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      reset();
                      setOpenEditor(false);
                    }}
                  >
                    Abbrechen
                  </Button>
                </div>
              </form>
            </Form>
          </div>
        </ScrollArea>

        <SheetFooter>
          {exeedDishLimit ? (
            <div className="flex items-center gap-3 text-sm text-amber-800 bg-amber-50 border border-amber-200 rounded-lg px-4 py-2 w-full">
              <span>Gericht-Limit ({Limit.DishLimit}) erreicht.</span>
              <DynamicLink href="/pricing" className="ml-auto font-semibold underline text-amber-600 hover:text-amber-700 whitespace-nowrap">
                ↑ Upgrade
              </DynamicLink>
            </div>
          ) : (
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                append({ name: "", price: 0, description: "" });
              }}
            >
              Gericht hinzufügen
            </Button>
          )}
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  const RADIUS_CLASS = { none: "rounded-none", sm: "rounded-lg", md: "rounded-xl", xl: "rounded-3xl" };

  return (
    <div className="min-h-screen flex flex-col" style={{ fontFamily: font }}>
      <link href="https://fonts.googleapis.com/css2?family=Roboto:wght@400;500;700&family=Open+Sans:wght@400;600;700&family=Lato:wght@400;700&family=Montserrat:wght@400;700&family=Poppins:wght@400;500;700&family=Inter:wght@400;500;700&family=Merriweather:wght@400;700&family=Playfair+Display:wght@400;700&family=Roboto+Slab:wght@400;700&family=JetBrains+Mono:wght@400;700&display=swap"></link>

      <header className="sticky top-0 z-50 w-full bg-white border-b border-gray-200 shadow-sm">
        {/* Zeile 1: Navigation */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 py-2 flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 min-w-0">
            <Button variant="ghost" size="sm" onClick={goBackBtn} style={{ fontFamily: font }}>
              <ArrowLeft className="size-4" />
              <span className="hidden sm:inline">Zurück</span>
            </Button>
            <Separator orientation="vertical" className="h-5" />
            <span className="text-sm font-semibold text-gray-900 truncate">Speisekarte bearbeiten</span>
          </div>

          <div className="flex items-center gap-2">
            {isPaidTier ? (
              <Button asChild variant="outline" size="sm">
                <Link href="/Profil/Drucken">
                  <Printer className="size-4" />
                  <span className="hidden sm:inline">Drucken</span>
                </Link>
              </Button>
            ) : (
              <Tooltip>
                <TooltipTrigger asChild>
                  <span>
                    <Button variant="outline" size="sm" disabled>
                      <Printer className="size-4" />
                      <span className="hidden sm:inline">Drucken</span>
                    </Button>
                  </span>
                </TooltipTrigger>
                <TooltipContent side="bottom">
                  Druck-/PDF-Ansicht ist ein Premium-Feature —{" "}
                  <DynamicLink href="/pricing" className="underline font-medium">
                    Upgrade
                  </DynamicLink>
                </TooltipContent>
              </Tooltip>
            )}
            <Button asChild variant="outline" size="sm" onClick={markUserAnsichtNavigation}>
              <Link href={`/Profil/Bestellungen?restaurantID=${restaurantID}`}>
                <ClipboardList className="size-4" />
                <span className="hidden sm:inline">Bestellungen</span>
              </Link>
            </Button>
            <Button asChild size="sm" onClick={markUserAnsichtNavigation}>
              <Link href={`/UnserePartner/Restaurants/Menu/${restaurantID}`}>
                <Eye className="size-4" />
                <span className="hidden sm:inline">User-Ansicht</span>
              </Link>
            </Button>
          </div>
        </div>

        {/* Zeile 2: Bearbeitungswerkzeuge + Abo-Status */}
        <div className="border-t border-gray-100 bg-gray-50/60">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 py-1.5 flex items-center justify-between gap-3 overflow-x-auto">
            <div className="flex items-center gap-2 shrink-0">
              <OptionMenu openOptions={openOptions} setOpenOptions={setOpenOptions} bgColor={bgColor} setNewBgColor={setNewBgColor} fontColor={fontColor} setNewFontColor={setNewFontColor} router={router} restaurantID={restaurantID} serverData={serverData} allowPremiumColor={allowPremiumColor} />

              {exeedCatLimit ? (
                <Tooltip>
                  <TooltipTrigger asChild>
                    <span>
                      <Button variant="outline" disabled>
                        Hinzufügen
                      </Button>
                    </span>
                  </TooltipTrigger>
                  <TooltipContent side="bottom">
                    Kategorie-Limit ({Limit.CategoryLimit}) erreicht —{" "}
                    <DynamicLink href="/pricing" className="underline font-medium">
                      Upgrade
                    </DynamicLink>
                  </TooltipContent>
                </Tooltip>
              ) : (
                <MenuEditor categoryGroupNames={categoryGroupNames} />
              )}

              {exeedDishLimit ? (
                <Tooltip>
                  <TooltipTrigger asChild>
                    <span>
                      <Button variant="outline" size="sm" disabled>
                        <ClipboardPaste className="size-4" />
                        Schnellerfassung
                      </Button>
                    </span>
                  </TooltipTrigger>
                  <TooltipContent side="bottom">
                    Gericht-Limit ({Limit.DishLimit}) erreicht —{" "}
                    <DynamicLink href="/pricing" className="underline font-medium">
                      Upgrade
                    </DynamicLink>
                  </TooltipContent>
                </Tooltip>
              ) : (
                <Button variant="outline" size="sm" onClick={() => setOpenBulkImport(true)}>
                  <ClipboardPaste className="size-4" />
                  Schnellerfassung
                </Button>
              )}

              {isPaidTier ? (
                <Button variant="outline" size="sm" onClick={() => setOpenBulkPrice(true)}>
                  <Percent className="size-4" />
                  Preise
                </Button>
              ) : (
                <Tooltip>
                  <TooltipTrigger asChild>
                    <span>
                      <Button variant="outline" size="sm" disabled>
                        <Percent className="size-4" />
                        Preise
                      </Button>
                    </span>
                  </TooltipTrigger>
                  <TooltipContent side="bottom">
                    Preis-Massenänderung ist ein Premium-Feature —{" "}
                    <DynamicLink href="/pricing" className="underline font-medium">
                      Upgrade
                    </DynamicLink>
                  </TooltipContent>
                </Tooltip>
              )}

              {allowPremiumColor ? (
                <Button variant="outline" size="sm" onClick={() => setOpenCalendarWin(true)}>
                  Event-Kalender
                </Button>
              ) : (
                <Tooltip>
                  <TooltipTrigger asChild>
                    <span>
                      <Button variant="outline" size="sm" disabled>
                        Aktionen
                      </Button>
                    </span>
                  </TooltipTrigger>
                  <TooltipContent side="bottom">
                    Aktionen &amp; Events sind ein Premium-Feature —{" "}
                    <DynamicLink href="/pricing" className="underline font-medium">
                      Upgrade
                    </DynamicLink>
                  </TooltipContent>
                </Tooltip>
              )}
              <SortComponents
                componentList={categoryGroups}
                onSave={(newGroups) =>
                  setServerData((prev) => ({
                    ...prev,
                    userData: {
                      ...prev.userData,
                      restaurant: {
                        ...prev.userData.restaurant,
                        menu: [{ ...prev.userData.restaurant.menu[0], categoryGroup: newGroups }, ...prev.userData.restaurant.menu.slice(1)],
                      },
                    },
                  }))
                }
              />
            </div>

            {/* Abo-Status mit Live-Zähler — auch mobil sichtbar */}
            <div className="flex items-center gap-2 text-xs shrink-0">
              <Badge variant="outline" className={session?.user?.subscription === "Professional" ? "border-amber-300 text-amber-600" : session?.user?.subscription === "Business" ? "border-orange-300 text-orange-500" : "text-gray-500"}>
                {session?.user?.subscription === "NoSubscription" ? "Kein Abo" : (session?.user?.subscription ?? "Kein Abo")}
              </Badge>
              <span className={catCount >= Limit.CategoryLimit ? "text-red-500 font-medium" : "text-gray-500"}>
                {catCount}/{Limit.CategoryLimit ?? "?"} <span className="hidden sm:inline">Kategorien</span>
                <span className="sm:hidden">Kat.</span>
              </span>
              <span className="text-gray-300">|</span>
              <span className={dishCount >= Limit.DishLimit ? "text-red-500 font-medium" : "text-gray-500"}>
                {dishCount}/{Limit.DishLimit ?? "?"} <span className="hidden sm:inline">Gerichte</span>
                <span className="sm:hidden">Ger.</span>
              </span>
              {(exeedCatLimit || exeedDishLimit) && (
                <DynamicLink href="/pricing" className="text-amber-600 hover:text-amber-700 font-semibold hover:underline whitespace-nowrap">
                  ↑ Upgrade
                </DynamicLink>
              )}
            </div>
          </div>
        </div>
      </header>
      {session?.user?.subscription === "Professional" || session?.user?.subscription === "Business" ? (
        <>
          <CalendarWin open={openCalendarWin} onOpenChange={setOpenCalendarWin} restaurantId={restaurantID} dishes={serverData?.userData?.restaurant?.menu?.[0]?.categoryGroup?.flatMap((cg) => cg.categories?.flatMap((c) => c.dishes || []) || []) ?? []} />
        </>
      ) : (
        <div className="line-through">Event-Kalender</div>
      )}

      <div className={`w-full ${heroColor?.startsWith("#") ? "" : `bg-linear-to-r ${HERO_GRADIENT_MAP[heroColor] ?? HERO_GRADIENT_MAP.amber}`} text-white py-10 px-4 text-center relative`} style={heroColor?.startsWith("#") ? { background: heroColor } : {}}>
        {isEditingHero ? (
          <div className="flex flex-col items-center gap-3 max-w-lg mx-auto mt-1">
            <input value={heroName} onChange={(e) => setHeroName(e.target.value)} style={{ color: heroTextColor }} className="text-2xl font-serif font-bold text-center bg-white/20 backdrop-blur placeholder-white/50 border border-white/40 rounded-xl px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-white/60" placeholder="Restaurant Name" />
            <input value={heroDescription} onChange={(e) => setHeroDescription(e.target.value)} style={{ color: heroTextColor }} className="text-sm text-center bg-white/20 backdrop-blur placeholder-white/50 border border-white/40 rounded-xl px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-white/60" placeholder="Kurze Beschreibung (z.B. Authentische italienische Küche)" />

            {/* Hintergrundfarbe */}
            <p className="text-xs text-white/60 uppercase tracking-widest">Hintergrundfarbe</p>
            <div className="flex flex-wrap justify-center gap-2">
              {HERO_COLOR_PRESETS.map(({ key, label, gradient }) => (
                <button key={key} title={label} onClick={() => setHeroColor(key)} className={`w-8 h-8 rounded-full bg-gradient-to-br ${gradient} border-4 transition-all ${heroColor === key ? "border-white scale-110 shadow-lg" : "border-white/30 hover:border-white/70"}`} />
              ))}
              {[
                { color: "#ffffff", label: "Weiß" },
                { color: "#f5f5f5", label: "Hellgrau" },
                { color: "#d1d5db", label: "Grau" },
                { color: "#6b7280", label: "Mittelgrau" },
                { color: "#1f2937", label: "Dunkelgrau" },
                { color: "#000000", label: "Schwarz" },
                { color: "#fbbf24", label: "Amber" },
                { color: "#f59e0b", label: "Orange" },
                { color: "#f97316", label: "Orange-Rot" },
                { color: "#f87171", label: "Rot" },
                { color: "#ef4444", label: "Kräftig Rot" },
                { color: "#ec4899", label: "Pink" },
                { color: "#a855f7", label: "Lila" },
                { color: "#6366f1", label: "Indigo" },
                { color: "#60a5fa", label: "Blau" },
                { color: "#22d3ee", label: "Cyan" },
                { color: "#34d399", label: "Grün" },
                { color: "#86efac", label: "Hellgrün" },
                { color: "#fde68a", label: "Gelb" },
              ].map(({ color, label }) => (
                <button key={color} title={label} onClick={() => setHeroColor(color)} className={`w-8 h-8 rounded-full border-4 transition-all ${heroColor === color ? "border-white scale-110 shadow-lg" : "border-white/30 hover:border-white/70"}`} style={{ backgroundColor: color }} />
              ))}
              {session.user.subscription === "Professional" ? (
                <div className="flex items-center justify-between gap-4">
                  <h1 className="text-sm font-medium" style={{ color: "black" }}>
                    Fortgeschrittene Farbauswahl:
                  </h1>
                  <input type="color" title="Eigene Farbe wählen" value={heroColor?.startsWith("#") ? heroColor : "#ffffff"} onChange={(e) => setHeroColor(e.target.value)} className="justify-self-end w-8 h-8 rounded-full border-4 border-white/30 hover:border-white/70 transition-all cursor-pointer bg-transparent p-0 [&::-webkit-color-swatch-wrapper]:p-0 [&::-webkit-color-swatch]:rounded-full [&::-webkit-color-swatch]:border-none" />
                </div>
              ) : (
                <></>
              )}
            </div>

            {/* Textfarbe */}
            <p className="text-xs text-white/60 uppercase tracking-widest">Textfarbe</p>
            <div className="flex flex-wrap justify-center gap-2">
              {[
                { color: "#ffffff", label: "Weiß" },
                { color: "#f5f5f5", label: "Hellgrau" },
                { color: "#d1d5db", label: "Grau" },
                { color: "#6b7280", label: "Mittelgrau" },
                { color: "#1f2937", label: "Dunkelgrau" },
                { color: "#000000", label: "Schwarz" },
                { color: "#fbbf24", label: "Amber" },
                { color: "#f59e0b", label: "Orange" },
                { color: "#f97316", label: "Orange-Rot" },
                { color: "#f87171", label: "Rot" },
                { color: "#ef4444", label: "Kräftig Rot" },
                { color: "#ec4899", label: "Pink" },
                { color: "#a855f7", label: "Lila" },
                { color: "#6366f1", label: "Indigo" },
                { color: "#60a5fa", label: "Blau" },
                { color: "#22d3ee", label: "Cyan" },
                { color: "#34d399", label: "Grün" },
                { color: "#86efac", label: "Hellgrün" },
                { color: "#fde68a", label: "Gelb" },
              ].map(({ color, label }) => (
                <button key={color} title={label} onClick={() => setHeroTextColor(color)} className={`w-8 h-8 rounded-full border-4 transition-all ${heroTextColor === color ? "border-white scale-110 shadow-lg" : "border-white/30 hover:border-white/70"}`} style={{ backgroundColor: color }} />
              ))}
              {session.user.subscription === "Professional" ? (
                <div className="w-full flex items-center justify-center gap-4">
                  <h1 className="text-sm font-medium" style={{ color: "black" }}>
                    Fortgeschrittene Farbauswahl:
                  </h1>

                  <input type="color" title="Eigene Farbe wählen" value={heroTextColor?.startsWith("#") ? heroTextColor : "#ffffff"} onChange={(e) => setHeroTextColor(e.target.value)} className="w-8 h-8 rounded-full border-4 border-white/30 hover:border-white/70 transition-all cursor-pointer bg-transparent p-0 [&::-webkit-color-swatch-wrapper]:p-0 [&::-webkit-color-swatch]:rounded-full [&::-webkit-color-swatch]:border-none" />
                </div>
              ) : (
                <></>
              )}
            </div>

            <div className="flex gap-2 mt-1">
              <Button size="sm" onClick={saveHero} disabled={savingHero} className="bg-white text-gray-800 hover:bg-white/90 font-semibold">
                {savingHero ? "Speichern..." : "Speichern"}
              </Button>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => {
                  setIsEditingHero(false);
                  setHeroName(serverData?.userData?.restaurant?.name || "");
                  setHeroDescription(serverData?.userData?.restaurant?.menu?.[0]?.description || "");
                  setHeroColor(serverData?.userData?.restaurant?.menu?.[0]?.heroColor || null);
                  setHeroTextColor(serverData?.userData?.restaurant?.menu?.[0]?.heroTextColor || "#ffffff");
                }}
                className="text-white border border-white/40 hover:bg-white/10"
              >
                Abbrechen
              </Button>
            </div>
          </div>
        ) : (
          <>
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-serif font-bold tracking-wide drop-shadow" style={{ color: heroTextColor }}>
              {heroName || serverData?.userData?.restaurant?.name || "Restaurant"}
            </h1>
            {heroDescription && (
              <p className="mt-3 text-sm max-w-md mx-auto" style={{ color: heroTextColor, opacity: 0.85 }}>
                {heroDescription}
              </p>
            )}
          </>
        )}

        {!isEditingHero && (
          <button onClick={() => setIsEditingHero(true)} className="absolute top-3 right-3 p-2 rounded-lg bg-white/10 hover:bg-white/20 text-white/70 hover:text-white transition-all" title="Header bearbeiten">
            <FaPen className="w-4 h-4 " />
          </button>
        )}
      </div>

      <div className={`flex-1 font-sans ${!bgColor ? "bg-amber-50" : ""} ${!fontColor ? "text-gray-900" : ""}`} style={{ ...(bgColor ? { backgroundColor: bgColor } : {}), ...(fontColor ? { color: fontColor } : {}) }}>
        <main className="w-full">
          <div className="max-w-7xl mx-auto px-4 py-8 space-y-12">
            {serverData?.userData?.restaurant?.menu?.[0]?.categoryGroup?.length ? (
              serverData.userData.restaurant.menu[0].categoryGroup.map((group) => (
                <div key={group.id} className={`${RADIUS_CLASS[groupBorderMap[group.id] ?? group.borderRadius] ?? "rounded-2xl"} shadow-sm p-6 border border-amber-100 ${bgColorClass(groupColorMap[group.id] ?? group.color) || "bg-white"}`} style={bgColorStyle(groupColorMap[group.id] ?? group.color)}>
                  <div>
                    <Button onClick={() => renderCategoryGroupEdit(group.id)}>
                      <FaPen />
                    </Button>
                  </div>
                  {renderCatGroupMenu === group.id && (
                    <EdditCategoryGroup
                      renderCatGroupMenu={renderCatGroupMenu}
                      setRenderCatGroupMenu={setRenderCatGroupMenu}
                      id={group.id}
                      name={group.name}
                      position={group.position}
                      bgColor={groupColorMap[group.id] ?? group.color}
                      fontColor={groupFontColorMap[group.id] ?? group.fontColor ?? ""}
                      borderRadius={groupBorderMap[group.id] ?? group.borderRadius}
                      titleAlign={groupAlignMap[group.id] ?? group.titleAlign}
                      restaurantID={restaurantID}
                      allowPremiumColor={allowPremiumColor}
                      onBorderRadiusChange={(val) => setGroupBorderMap((prev) => ({ ...prev, [group.id]: val }))}
                      onColorChange={(val) => setGroupColorMap((prev) => ({ ...prev, [group.id]: val }))}
                      onFontColorChange={(val) => setGroupFontColorMap((prev) => ({ ...prev, [group.id]: val }))}
                      onTitleAlignChange={(val) => setGroupAlignMap((prev) => ({ ...prev, [group.id]: val }))}
                    />
                  )}
                  <h2 className="text-2xl font-semibold mb-6 border-b pb-4" style={{ ...((groupFontColorMap[group.id] ?? group.fontColor) ? { color: groupFontColorMap[group.id] ?? group.fontColor } : {}), textAlign: groupAlignMap[group.id] ?? group.titleAlign ?? "left", ...(headingFont ? { fontFamily: headingFont } : {}) }}>
                    {group.name}
                  </h2>
                  <div className="space-y-8">
                    {group.categories?.map((category) => (
                      <MenuSection
                        key={category.id}
                        title={category.name}
                        menuItems={category.dishes}
                        categoryId={category.id}
                        groupName={group.name}
                        bgColor={category.bgColor}
                        fontColor={category.fontColor}
                        borderRadius={category.borderRadius}
                        elevated={category.elevated}
                        leaderDots={category.leaderDots}
                        titleAlign={category.titleAlign}
                        titleUppercase={category.titleUppercase}
                        density={density}
                        font={font}
                        headingFont={headingFont}
                        deletedDishes={deletedDishes}
                        deletedCategories={deletedCategories}
                        onDeleteDish={updateDeletedDishes}
                        onDeleteCategory={updateDeletedCategories}
                        onDuplicateDish={duplicateDish}
                        onDuplicateCategory={duplicateCategory}
                        onRequestMoveDish={setMoveTarget}
                        restaurantId={restaurantID}
                        userID={userID}
                        positionNum={positionNum}
                        allowPremiumColor={allowPremiumColor}
                        allowAvailability={allowAvailability}
                      />
                    ))}
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center text-gray-500 py-10">Keine Daten vorhanden</div>
            )}
          </div>
        </main>
      </div>

      {/* Schnellerfassung */}
      <BulkImport open={openBulkImport} onOpenChange={setOpenBulkImport} categoryGroupNames={categoryGroupNames} categoryNames={categoryNames} remainingDishes={remainingDishes} onImport={handleBulkImport} />

      {/* Preis-Massenänderung (Premium) */}
      {isPaidTier && <BulkPriceDialog open={openBulkPrice} onOpenChange={setOpenBulkPrice} categoryGroups={categoryGroups} onApplied={handleBulkPriceApplied} />}

      {/* Gericht in andere Kategorie verschieben */}
      <MoveDishDialog open={moveTarget !== null} onOpenChange={(open) => !open && setMoveTarget(null)} dish={moveTarget?.dish} currentCategoryId={moveTarget?.categoryId} categoryGroups={categoryGroups} onMoved={handleDishMoved} />

      {/* Ungespeicherte Änderungen verwerfen — unwiderruflich, deshalb mit Rückfrage */}
      <ConfirmDialog
        open={confirmDiscard}
        onOpenChange={setConfirmDiscard}
        title="Änderungen verwerfen?"
        description="Alle vorgemerkten Neuanlagen und Löschungen gehen verloren. Bereits gespeicherte Daten bleiben unberührt."
        confirmLabel="Verwerfen"
        onConfirm={() => {
          discardDraft();
          setConfirmDiscard(false);
        }}
      />

      {/* Speichern-Leiste — erscheint nur bei ungespeicherten Änderungen */}
      {(components.length > 0 || deletedDishes.length > 0 || deletedCategories.length > 0 || deleteCategoryGroups.length > 0) && (
        <div className="fixed bottom-4 inset-x-0 z-40 flex justify-center px-4 pointer-events-none">
          <div className="pointer-events-auto flex flex-col items-center gap-1 bg-white border border-gray-200 shadow-lg rounded-2xl px-4 py-2">
            {draftRestored && <span className="text-xs text-amber-700">Entwurf von {formatDraftAge(draftRestored)} wiederhergestellt</span>}
            <div className="flex items-center gap-3">
              <span className="text-sm text-gray-600">
                Ungespeicherte Änderungen
                {components.length > 0 && ` · ${components.length} neu`}
                {deletedDishes.length + deletedCategories.length + deleteCategoryGroups.length > 0 && ` · ${deletedDishes.length + deletedCategories.length + deleteCategoryGroups.length} gelöscht`}
              </span>
              <Button variant="ghost" size="sm" onClick={() => setConfirmDiscard(true)} disabled={isSaving} className="rounded-full text-gray-500">
                Verwerfen
              </Button>
              <Button onClick={() => submitData()} disabled={isSaving} className="rounded-full">
                <Save className="size-4" />
                {isSaving ? "Speichert…" : "Speichern"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
