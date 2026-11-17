"use client";

import { useState, useEffect, useMemo, useRef } from "react";
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
import { FaPen, FaTrash } from "react-icons/fa";
import { ArrowLeft, CalendarDays, ClipboardList, ClipboardPaste, Eye, Globe, Package, Percent, Plus, Printer, Save, Search, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";

import { createMenuSchema } from "./components/menuSchema";
import { OptionMenu } from "./components/optionMenu";
import { TierSystem } from "./components/TierLimits";
import { useRestaurantData, markUserAnsichtNavigation } from "./components/fetchData";
import { EdditCategoryGroup } from "./components/edditCategoryGroup";
import { SortComponents } from "./components/sortMenu";
import { bgColorClass, bgColorStyle } from "./components/ColorPicker";
import { CalendarWin } from "./components/calendarWin";
import { InventoryWin } from "./components/inventoryWin";
import { SubdomainWin, buildSubdomainUrl } from "./components/subdomainWin";
import { ClaimLinkWin } from "./components/claimLinkWin";
import { MenuSection, dishMatchesSearch } from "./components/menuSection";
import { BulkImport } from "./components/bulkImport";
import { BulkPriceDialog } from "./components/bulkPrice";
import { MoveDishDialog } from "./components/moveDish";
import { clearDraft, formatDraftAge, loadDraft, saveDraft } from "./components/draftStorage";
import { applyPriceChange } from "@/lib/priceRules";
import { tierLabel } from "@/lib/tierLabels";
import { HERO_COLOR_PRESETS, RADIUS_CLASS, heroClass, heroStyle } from "./components/menuStyle";
import { MenuBackgroundImage } from "@/app/components/MenuBackgroundImage";
import { useUiLanguage } from "@/app/components/useUiLanguage";
import UiLanguageSwitcher from "@/app/components/UiLanguageSwitcher";
import { localizedPath } from "@/i18n/config";
import { fmt, plural } from "@/i18n/format";

// Farbauswahl im Kopfbereich — Namen kommen aus dashboard.colors.
const HERO_SWATCHES = [
  { color: "#ffffff", key: "white" },
  { color: "#f5f5f5", key: "lightGray" },
  { color: "#d1d5db", key: "gray" },
  { color: "#6b7280", key: "midGray" },
  { color: "#1f2937", key: "darkGray" },
  { color: "#000000", key: "black" },
  { color: "#fbbf24", key: "amber" },
  { color: "#f59e0b", key: "orange" },
  { color: "#f97316", key: "orangeRed" },
  { color: "#f87171", key: "red" },
  { color: "#ef4444", key: "strongRed" },
  { color: "#ec4899", key: "pink" },
  { color: "#a855f7", key: "purple" },
  { color: "#6366f1", key: "indigo" },
  { color: "#60a5fa", key: "blue" },
  { color: "#22d3ee", key: "cyan" },
  { color: "#34d399", key: "green" },
  { color: "#86efac", key: "lightGreen" },
  { color: "#fde68a", key: "yellow" },
];

export default function PageBuilder() {
  const router = useRouter();
  // Oberflächensprache aus User.language (nicht aus der URL — /Profil ist per
  // Middleware geschützt, ein Sprach-Präfix würde daran vorbeiführen).
  const { t: uiDict, locale } = useUiLanguage();
  const t = uiDict.dashboard;
  const tp = t.page;
  const pricingHref = localizedPath("/pricing", locale);
  const menuSchema = useMemo(() => createMenuSchema(t.menuSchema), [t]);

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

  const { serverData, setServerData, refetch, isLoading, restaurantID, bgColor: savedBgColor, fontColor: savedFontColor, font: savedFont, headingFont: savedHeadingFont, density: savedDensity, bgImageUrl: savedBgImageUrl, positionNum } = useRestaurantData(userID);

  // Live-Vorschau aus dem Design-Menü (OptionMenu): solange dort bearbeitet
  // wird, zeigt die Karte die ungespeicherten Werte. null = gespeicherter Stand.
  const [designPreview, setDesignPreview] = useState(null);
  const { bgColor, fontColor, font, headingFont, density } = designPreview ?? {
    bgColor: savedBgColor,
    fontColor: savedFontColor,
    font: savedFont,
    headingFont: savedHeadingFont,
    density: savedDensity,
  };

  // Suche im Editor (Name, Beschreibung, Größen, Kategoriename)
  const [searchTerm, setSearchTerm] = useState("");

  const [isSaving, setIsSaving] = useState(false);

  // Controlled sheets
  const [openEditor, setOpenEditor] = useState(false);
  const [openOptions, setOpenOptions] = useState(false);
  const [openCalendarWin, setOpenCalendarWin] = useState(false);
  const [openInventoryWin, setOpenInventoryWin] = useState(false);
  const [openSubdomainWin, setOpenSubdomainWin] = useState(false);
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
  const [confirmDeleteGroup, setConfirmDeleteGroup] = useState(null); // Gruppe | null

  // Entwurf: erst nach dem Laden schreiben, sonst überschreibt der leere
  // Anfangszustand einen vorhandenen Entwurf, bevor er wiederhergestellt wurde.
  const [draftRestored, setDraftRestored] = useState(null); // savedAt | null
  const draftReadyRef = useRef(false);

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
      if (!res.ok) throw new Error(t.common.saveError);
      // Baseline auf die gespeicherten Werte anheben, damit ein erneutes
      // Speichern in derselben Sitzung nicht wieder unveränderte Felder schickt.
      heroBaselineRef.current = { ...base, ...changed };
      toast.success(tp.heroSaved);
      setIsEditingHero(false);
    } catch (err) {
      toast.error(t.common.errorPrefix + err.message);
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
    toast.success(tp.discarded);
  };

  // ── Duplizieren ───────────────────────────────────────────────────────────
  // Kopien laufen über denselben Weg wie jede Neuanlage: als menuSection in
  // `components` vorgemerkt und beim Speichern von setData angelegt. Sie sind
  // deshalb erst nach dem Speichern in der Karte sichtbar.
  const uniqueCopyName = (baseName, existingNames) => {
    let candidate = `${baseName} ${tp.copySuffix}`;
    let counter = 2;
    while (existingNames.includes(candidate)) {
      candidate = `${baseName} ${fmt(tp.copySuffixN, { n: counter })}`;
      counter += 1;
    }
    return candidate;
  };

  // Alle Angaben eines Gerichts für eine Kopie — setData legt Allergene,
  // Zusatzstoffe, Merkmale und Größen gleich mit an.
  const copyDishDetails = (d) => ({
    name: d.name,
    description: d.description ?? "",
    price: Number(d.price ?? 0).toFixed(2),
    allergens: d.allergens ?? [],
    additives: d.additives ?? [],
    tags: d.tags ?? [],
    spiceLevel: d.spiceLevel ?? 0,
    variants: (d.variants ?? []).map((v) => ({ label: v.label, price: Number(v.price).toFixed(2) })),
  });

  const duplicateDish = ({ dish, categoryName, groupName }) => {
    if (exeedDishLimit) {
      toast.error(fmt(tp.dishLimitReached, { limit: Limit.DishLimit }));
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
          items: [{ ...copyDishDetails(dish), name: `${dish.name} ${tp.copySuffix}` }],
        },
      },
    ]);
    toast.success(tp.copyQueued);
  };

  const duplicateCategory = ({ categoryName, groupName, dishes }) => {
    if (exeedCatLimit) {
      toast.error(fmt(tp.categoryLimitReached, { limit: Limit.CategoryLimit }));
      return;
    }

    const freeDishSlots = Math.max(0, (Limit.DishLimit ?? 0) - dishCount);
    const items = (dishes ?? []).slice(0, freeDishSlots).map(copyDishDetails);

    // Der Name muss neu sein: setData ordnet Kategorien innerhalb einer Gruppe
    // über den Namen zu — ein identischer Name würde das Original befüllen.
    const newName = uniqueCopyName(categoryName, categoryNames);

    setComponents((prev) => [...prev, { type: "menuSection", section: { categoryGroup: groupName, title: newName, items } }]);

    const skipped = (dishes?.length ?? 0) - items.length;
    toast.success(fmt(tp.categoryCopyQueued, { name: newName }) + (skipped > 0 ? fmt(tp.categoryCopySkipped, { n: skipped }) : ""));
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
              // Mit Größen: jede Variante ändern, Gerichtpreis = kleinster Variantenpreis
              if (dish.variants?.length) {
                const variants = dish.variants.map((v) => {
                  const next = applyPriceChange(Number(v.price), mode, value, rounding);
                  return next === null ? v : { ...v, price: next };
                });
                return { ...dish, variants, price: Math.min(...variants.map((v) => Number(v.price))) };
              }
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

  // ── Kategorie umbenannt (Dialog hat bereits gespeichert) ────────────────────
  // Geladenen Stand nachziehen: Kopieren, Suche und die Namensvorschläge im
  // "Hinzufügen"-Dialog arbeiten mit dem Kategorienamen — setData ordnet
  // Kategorien über den Namen zu, ein veralteter Name legte eine neue an.
  const handleCategoryRenamed = (categoryId, name) => {
    setServerData((prev) => {
      const menu = prev?.userData?.restaurant?.menu?.[0];
      if (!menu) return prev;
      const categoryGroup = menu.categoryGroup.map((group) => ({
        ...group,
        categories: (group.categories ?? []).map((cat) => (cat.id === categoryId ? { ...cat, name } : cat)),
      }));
      return {
        ...prev,
        userData: {
          ...prev.userData,
          restaurant: {
            ...prev.userData.restaurant,
            menu: [{ ...menu, categoryGroup }, ...prev.userData.restaurant.menu.slice(1)],
          },
        },
      };
    });
  };

  // ── Design (OptionMenu) ───────────────────────────────────────────────────
  // Gespeichertes Design in den geladenen Stand übernehmen — kein Neuladen nötig.
  const handleDesignSaved = (values) => {
    setServerData((prev) => {
      const menu = prev?.userData?.restaurant?.menu?.[0];
      if (!menu) return prev;
      return {
        ...prev,
        userData: {
          ...prev.userData,
          restaurant: {
            ...prev.userData.restaurant,
            menu: [{ ...menu, ...values }, ...prev.userData.restaurant.menu.slice(1)],
          },
        },
      };
    });
    setDesignPreview(null);
  };

  // Hintergrundbild hochgeladen/entfernt: wird sofort gespeichert, deshalb nur
  // den geladenen Stand anpassen — eine laufende Design-Vorschau bleibt erhalten.
  const handleBgImageChange = (bgImageUrl) => {
    setServerData((prev) => {
      const menu = prev?.userData?.restaurant?.menu?.[0];
      if (!menu) return prev;
      return {
        ...prev,
        userData: {
          ...prev.userData,
          restaurant: {
            ...prev.userData.restaurant,
            menu: [{ ...menu, bgImageUrl }, ...prev.userData.restaurant.menu.slice(1)],
          },
        },
      };
    });
  };

  // Theme angewendet oder zurückgenommen: betrifft Menü, alle Gruppen und
  // Kategorien. Lokale Gruppen-Überschreibungen verwerfen und frisch laden.
  const handleThemeChanged = async () => {
    setDesignPreview(null);
    setGroupBorderMap({});
    setGroupColorMap({});
    setGroupFontColorMap({});
    setGroupAlignMap({});
    await refetch();
  };

  const submitData = async () => {
    const restaurantID = serverData.userData.restaurant.id;
    setIsSaving(true);

    try {
      // setData nur aufrufen, wenn es wirklich etwas anzulegen gibt. Die Route
      // antwortet auf eine leere Liste mit 400 ("Keine menuSection-Einträge
      // gefunden") — ein reiner Löschvorgang (Gericht/Kategorie/Gruppe
      // entfernen, ohne etwas Neues) wäre daher schon hier abgebrochen und die
      // Löschung nie ausgeführt worden.
      if (components.length > 0) {
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

      toast.success(tp.saved);
    } catch (err) {
      console.error("Failed to save data:", err);
      toast.error(tp.saveFailed + err.message);
    } finally {
      setIsSaving(false);
    }
  };

  const goBackBtn = () => {
    markUserAnsichtNavigation();
    router.push("../");
  };

  const categoryGroups = serverData?.userData?.restaurant?.menu?.[0]?.categoryGroup ?? [];
  const categoryGroupNames = [...new Set([...categoryGroups.map((group) => group.name), ...tp.groupSuggestions])].filter((name) => name && name.trim());
  const categoryNames = categoryGroups.flatMap((group) => (group.categories ?? []).map((cat) => cat.name)).filter((name) => name && name.trim());

  // Suche: dieselbe Regel wie in MenuSection — ein passender Kategoriename
  // zeigt die ganze Kategorie, sonst nur passende Gerichte.
  const searchQuery = searchTerm.trim().toLowerCase();
  const searching = searchQuery.length > 0;
  const categoryMatchesSearch = (cat) => cat.name?.toLowerCase().includes(searchQuery);
  const matchingDishesOf = (cat) => (categoryMatchesSearch(cat) ? (cat.dishes ?? []) : (cat.dishes ?? []).filter((d) => dishMatchesSearch(d, searchTerm)));
  const groupMatchesSearch = (group) => !searching || (group.categories ?? []).some((cat) => matchingDishesOf(cat).length > 0);
  const searchMatchCount = searching ? categoryGroups.reduce((n, g) => n + (g.categories ?? []).reduce((m, c) => m + matchingDishesOf(c).length, 0), 0) : 0;

  // Bezahlte Tarife — Preis-Massenänderung und Druckansicht. Die eigentliche
  // Durchsetzung passiert serverseitig (api/user/profil/bulkPrice); hier geht
  // es nur darum, keine Buttons zu zeigen, die ohnehin abgelehnt würden.
  const isPaidTier = ["Professional", "Business"].includes(session?.user?.subscription);
  const restaurantSubdomain = serverData?.userData?.restaurant?.subdomain ?? null;
  const remainingDishes = Math.max(0, (Limit.DishLimit ?? 0) - dishCount);

  const MenuEditor = ({ categoryGroupNames }) => (
    <Sheet open={openEditor} onOpenChange={setOpenEditor}>
      <div></div>
      <SheetTrigger asChild>
        <Button variant="outline" size="sm">
          <Plus className="size-4" />
          <span className="hidden md:inline">{tp.add}</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="w-full max-w-3xl">
        <SheetHeader>
          <SheetTitle>{t.editor.title}</SheetTitle>
          <SheetDescription>{t.editor.description}</SheetDescription>
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
                      <FormLabel>{t.editor.group}</FormLabel>
                      <>
                        <FormControl>
                          <Input list="categoryGroup" minLength={1} autoComplete="new-password" autoCorrect="off" spellCheck="false" placeholder={t.editor.groupPlaceholder} {...field} className="w-[90%]" />
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
                      <FormLabel>{t.editor.category}</FormLabel>
                      <>
                        <FormControl>
                          <Input list="categoryNames" autoComplete="off" autoCorrect="off" spellCheck="false" placeholder={t.editor.categoryPlaceholder} {...field} className="w-[90%]" />
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
                  <h3 className="text-lg font-semibold">{t.editor.dishes}</h3>
                  {fields.map((item, index) => (
                    <div key={item.id} className="p-4 border rounded-xl bg-gray-50 relative">
                      <FormField
                        control={control}
                        name={`items.${index}.name`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="pt-3">{t.editor.dishName}</FormLabel>
                            <FormControl>
                              <Input placeholder={t.editor.dishNamePlaceholder} {...field} />
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
                            <FormLabel className="pt-3">{t.editor.description2}</FormLabel>
                            <FormControl>
                              <div className="pt-0.5">
                                <Input placeholder={t.editor.descriptionPlaceholder} {...field} />
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
                            <FormLabel className="pt-3">{t.editor.price}</FormLabel>
                            <FormControl>
                              <div className="flex items-center gap-2 pt-0.5">
                                <Input placeholder={t.editor.pricePlaceholder} type="text" inputMode="decimal" {...field} className="w-24" />
                                <span className="text-gray-600">€</span>
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <Button type="button" variant="ghost" className="absolute top-2 right-2 text-red-500" onClick={() => remove(index)}>
                        {t.common.remove}
                      </Button>
                    </div>
                  ))}
                </div>

                <div className="flex justify-between pt-4">
                  <Button type="submit">{t.common.save}</Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      reset();
                      setOpenEditor(false);
                    }}
                  >
                    {t.common.cancel}
                  </Button>
                </div>
              </form>
            </Form>
          </div>
        </ScrollArea>

        <SheetFooter>
          {exeedDishLimit ? (
            <div className="flex items-center gap-3 text-sm text-amber-800 bg-amber-50 border border-amber-200 rounded-lg px-4 py-2 w-full">
              <span>{fmt(tp.dishLimitReachedDot, { limit: Limit.DishLimit })}</span>
              <DynamicLink href={pricingHref} className="ml-auto font-semibold underline text-amber-600 hover:text-amber-700 whitespace-nowrap">
                {t.common.upgradeArrow}
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
              {t.editor.addDish}
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


  return (
    <div className="min-h-screen flex flex-col isolate" style={{ fontFamily: font }}>
      <MenuBackgroundImage url={savedBgImageUrl} />
      <link href="https://fonts.googleapis.com/css2?family=Roboto:wght@400;500;700&family=Open+Sans:wght@400;600;700&family=Lato:wght@400;700&family=Montserrat:wght@400;700&family=Poppins:wght@400;500;700&family=Inter:wght@400;500;700&family=Merriweather:wght@400;700&family=Playfair+Display:wght@400;700&family=Roboto+Slab:wght@400;700&family=JetBrains+Mono:wght@400;700&display=swap"></link>

      <header className="sticky top-0 z-50 w-full bg-white border-b border-gray-200 shadow-sm">
        {/* Zeile 1: Navigation */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 py-2 flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 min-w-0">
            <Button variant="ghost" size="sm" onClick={goBackBtn} style={{ fontFamily: font }}>
              <ArrowLeft className="size-4" />
              <span className="hidden sm:inline">{t.common.back}</span>
            </Button>
            <Separator orientation="vertical" className="h-5" />
            <span className="text-sm font-semibold text-gray-900 truncate">{tp.title}</span>
          </div>

          <div className="flex items-center gap-2">
            <UiLanguageSwitcher />
            {isPaidTier ? (
              <Button asChild variant="outline" size="sm">
                <Link href="/dashboard/print">
                  <Printer className="size-4" />
                  <span className="hidden sm:inline">{tp.print}</span>
                </Link>
              </Button>
            ) : (
              <Tooltip>
                <TooltipTrigger asChild>
                  <span>
                    <Button variant="outline" size="sm" disabled>
                      <Printer className="size-4" />
                      <span className="hidden sm:inline">{tp.print}</span>
                    </Button>
                  </span>
                </TooltipTrigger>
                <TooltipContent side="bottom">
                  {fmt(t.common.premiumFeature, { feature: tp.featurePrint })}{" "}
                  <DynamicLink href={pricingHref} className="underline font-medium">
                    {t.common.upgrade}
                  </DynamicLink>
                </TooltipContent>
              </Tooltip>
            )}
            <Button asChild variant="outline" size="sm" onClick={markUserAnsichtNavigation}>
              <Link href={`/dashboard/orders?restaurantID=${restaurantID}`}>
                <ClipboardList className="size-4" />
                <span className="hidden sm:inline">{tp.orders}</span>
              </Link>
            </Button>
            {isPaidTier && restaurantSubdomain ? (
              // Mit eigener Subdomain: Speisekarte so zeigen, wie Gäste sie aufrufen (neuer Tab, Profil bleibt offen)
              <Button asChild size="sm">
                <a href={buildSubdomainUrl(restaurantSubdomain)} target="_blank" rel="noopener noreferrer" title={`${restaurantSubdomain}.whatisonmymenu.com`}>
                  <Eye className="size-4" />
                  <span className="hidden sm:inline">{tp.guestView}</span>
                </a>
              </Button>
            ) : (
              <Button asChild size="sm" onClick={markUserAnsichtNavigation}>
                <Link href={`/UnserePartner/Restaurants/Menu/${restaurantID}`}>
                  <Eye className="size-4" />
                  <span className="hidden sm:inline">{tp.guestView}</span>
                </Link>
              </Button>
            )}
          </div>
        </div>

        {/* Zeile 2: Bearbeitungswerkzeuge + Abo-Status */}
        <div className="border-t border-gray-100 bg-gray-50/60">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 py-1.5 flex items-center justify-between gap-3 overflow-x-auto">
            <div className="flex items-center gap-2 shrink-0">
              <OptionMenu
                openOptions={openOptions}
                setOpenOptions={setOpenOptions}
                bgColor={savedBgColor}
                setNewBgColor={setNewBgColor}
                fontColor={savedFontColor}
                setNewFontColor={setNewFontColor}
                restaurantID={restaurantID}
                serverData={serverData}
                allowPremiumColor={allowPremiumColor}
                onPreviewChange={setDesignPreview}
                onDesignSaved={handleDesignSaved}
                onThemeChanged={handleThemeChanged}
                onBgImageChange={handleBgImageChange}
              />

              {exeedCatLimit ? (
                <Tooltip>
                  <TooltipTrigger asChild>
                    <span>
                      <Button variant="outline" size="sm" disabled>
                        <Plus className="size-4" />
                        <span className="hidden md:inline">{tp.add}</span>
                      </Button>
                    </span>
                  </TooltipTrigger>
                  <TooltipContent side="bottom">
                    {fmt(tp.categoryLimitReached, { limit: Limit.CategoryLimit })} —{" "}
                    <DynamicLink href={pricingHref} className="underline font-medium">
                      {t.common.upgrade}
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
                        <span className="hidden md:inline">{tp.quickAdd}</span>
                      </Button>
                    </span>
                  </TooltipTrigger>
                  <TooltipContent side="bottom">
                    {fmt(tp.dishLimitReached, { limit: Limit.DishLimit })} —{" "}
                    <DynamicLink href={pricingHref} className="underline font-medium">
                      {t.common.upgrade}
                    </DynamicLink>
                  </TooltipContent>
                </Tooltip>
              ) : (
                <Button variant="outline" size="sm" onClick={() => setOpenBulkImport(true)}>
                  <ClipboardPaste className="size-4" />
                  <span className="hidden md:inline">{tp.quickAdd}</span>
                </Button>
              )}

              {isPaidTier ? (
                <Button variant="outline" size="sm" onClick={() => setOpenBulkPrice(true)}>
                  <Percent className="size-4" />
                  <span className="hidden md:inline">{tp.prices}</span>
                </Button>
              ) : (
                <Tooltip>
                  <TooltipTrigger asChild>
                    <span>
                      <Button variant="outline" size="sm" disabled>
                        <Percent className="size-4" />
                        <span className="hidden md:inline">{tp.prices}</span>
                      </Button>
                    </span>
                  </TooltipTrigger>
                  <TooltipContent side="bottom">
                    {fmt(t.common.premiumFeature, { feature: tp.featureBulkPrice })}{" "}
                    <DynamicLink href={pricingHref} className="underline font-medium">
                      {t.common.upgrade}
                    </DynamicLink>
                  </TooltipContent>
                </Tooltip>
              )}

              {allowPremiumColor ? (
                <Button variant="outline" size="sm" onClick={() => setOpenCalendarWin(true)}>
                  <CalendarDays className="size-4" />
                  <span className="hidden md:inline">{tp.eventCalendar}</span>
                </Button>
              ) : (
                <Tooltip>
                  <TooltipTrigger asChild>
                    <span>
                      <Button variant="outline" size="sm" disabled>
                        <CalendarDays className="size-4" />
                        <span className="hidden md:inline">{tp.promotions}</span>
                      </Button>
                    </span>
                  </TooltipTrigger>
                  <TooltipContent side="bottom">
                    {fmt(t.common.premiumFeature, { feature: tp.featureEvents })}{" "}
                    <DynamicLink href={pricingHref} className="underline font-medium">
                      {t.common.upgrade}
                    </DynamicLink>
                  </TooltipContent>
                </Tooltip>
              )}

              {session?.user?.subscription === "Professional" ? (
                <Button variant="outline" size="sm" onClick={() => setOpenInventoryWin(true)}>
                  <Package className="size-4" />
                  <span className="hidden md:inline">{tp.inventory}</span>
                </Button>
              ) : (
                <Tooltip>
                  <TooltipTrigger asChild>
                    <span>
                      <Button variant="outline" size="sm" disabled>
                        <Package className="size-4" />
                        <span className="hidden md:inline">{tp.inventory}</span>
                      </Button>
                    </span>
                  </TooltipTrigger>
                  <TooltipContent side="bottom">
                    {fmt(t.common.premiumFeature, { feature: tp.featureInventory })}{" "}
                    <DynamicLink href={pricingHref} className="underline font-medium">
                      {t.common.upgrade}
                    </DynamicLink>
                  </TooltipContent>
                </Tooltip>
              )}
              {isPaidTier ? (
                <Button variant="outline" size="sm" onClick={() => setOpenSubdomainWin(true)}>
                  <Globe className="size-4" />
                  <span className="hidden md:inline">{tp.subdomain}</span>
                </Button>
              ) : (
                <Tooltip>
                  <TooltipTrigger asChild>
                    <span>
                      <Button variant="outline" size="sm" disabled>
                        <Globe className="size-4" />
                        <span className="hidden md:inline">{tp.subdomain}</span>
                      </Button>
                    </span>
                  </TooltipTrigger>
                  <TooltipContent side="bottom">
                    {fmt(t.common.premiumFeature, { feature: tp.featureSubdomain })}{" "}
                    <DynamicLink href={pricingHref} className="underline font-medium">
                      {t.common.upgrade}
                    </DynamicLink>
                  </TooltipContent>
                </Tooltip>
              )}
              <ClaimLinkWin />
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
                {tierLabel(session?.user?.subscription)}
              </Badge>
              <span className={catCount >= Limit.CategoryLimit ? "text-red-500 font-medium" : "text-gray-500"}>
                {catCount}/{Limit.CategoryLimit ?? "?"} <span className="hidden sm:inline">{tp.categories}</span>
                <span className="sm:hidden">{tp.categoriesShort}</span>
              </span>
              <span className="text-gray-300">|</span>
              <span className={dishCount >= Limit.DishLimit ? "text-red-500 font-medium" : "text-gray-500"}>
                {dishCount}/{Limit.DishLimit ?? "?"} <span className="hidden sm:inline">{tp.dishes}</span>
                <span className="sm:hidden">{tp.dishesShort}</span>
              </span>
              {(exeedCatLimit || exeedDishLimit) && (
                <DynamicLink href={pricingHref} className="text-amber-600 hover:text-amber-700 font-semibold hover:underline whitespace-nowrap">
                  {t.common.upgradeArrow}
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
        <div className="line-through">{tp.eventCalendar}</div>
      )}

      {isPaidTier && (
        <SubdomainWin
          open={openSubdomainWin}
          onOpenChange={setOpenSubdomainWin}
          restaurantId={restaurantID}
          onSaved={(subdomain) =>
            setServerData((prev) => (prev?.userData?.restaurant ? { ...prev, userData: { ...prev.userData, restaurant: { ...prev.userData.restaurant, subdomain } } } : prev))
          }
        />
      )}

      {session?.user?.subscription === "Professional" && <InventoryWin open={openInventoryWin} onOpenChange={setOpenInventoryWin} restaurantId={restaurantID} />}

      <div className={`w-full ${heroClass(heroColor)} text-white py-10 px-4 text-center relative`} style={heroStyle(heroColor)}>
        {isEditingHero ? (
          <div className="flex flex-col items-center gap-3 max-w-lg mx-auto mt-1">
            <input value={heroName} onChange={(e) => setHeroName(e.target.value)} style={{ color: heroTextColor }} className="text-2xl font-serif font-bold text-center bg-white/20 backdrop-blur placeholder-white/50 border border-white/40 rounded-xl px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-white/60" placeholder={tp.restaurantNamePlaceholder} />
            <input value={heroDescription} onChange={(e) => setHeroDescription(e.target.value)} style={{ color: heroTextColor }} className="text-base sm:text-lg text-center bg-white/20 backdrop-blur placeholder-white/50 border border-white/40 rounded-xl px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-white/60" placeholder={tp.heroDescriptionPlaceholder} />

            {/* Hintergrundfarbe */}
            <p className="text-xs text-white/60 uppercase tracking-widest">{tp.bgColor}</p>
            <div className="flex flex-wrap justify-center gap-2">
              {HERO_COLOR_PRESETS.map(({ key, gradient }) => (
                <button key={key} title={t.colors[key]} onClick={() => setHeroColor(key)} className={`w-8 h-8 rounded-full bg-linear-to-br ${gradient} border-4 transition-all ${heroColor === key ? "border-white scale-110 shadow-lg" : "border-white/30 hover:border-white/70"}`} />
              ))}
              {HERO_SWATCHES.map(({ color, key }) => (
                <button key={color} title={t.colors[key]} onClick={() => setHeroColor(color)} className={`w-8 h-8 rounded-full border-4 transition-all ${heroColor === color ? "border-white scale-110 shadow-lg" : "border-white/30 hover:border-white/70"}`} style={{ backgroundColor: color }} />
              ))}
              {session.user.subscription === "Professional" ? (
                <div className="flex items-center justify-between gap-4">
                  <h1 className="text-sm font-medium" style={{ color: "black" }}>
                    {tp.advancedColor}
                  </h1>
                  <input type="color" title={tp.customColor} value={heroColor?.startsWith("#") ? heroColor : "#ffffff"} onChange={(e) => setHeroColor(e.target.value)} className="justify-self-end w-8 h-8 rounded-full border-4 border-white/30 hover:border-white/70 transition-all cursor-pointer bg-transparent p-0 [&::-webkit-color-swatch-wrapper]:p-0 [&::-webkit-color-swatch]:rounded-full [&::-webkit-color-swatch]:border-none" />
                </div>
              ) : (
                <></>
              )}
            </div>

            {/* Textfarbe */}
            <p className="text-xs text-white/60 uppercase tracking-widest">{tp.textColor}</p>
            <div className="flex flex-wrap justify-center gap-2">
              {HERO_SWATCHES.map(({ color, key }) => (
                <button key={color} title={t.colors[key]} onClick={() => setHeroTextColor(color)} className={`w-8 h-8 rounded-full border-4 transition-all ${heroTextColor === color ? "border-white scale-110 shadow-lg" : "border-white/30 hover:border-white/70"}`} style={{ backgroundColor: color }} />
              ))}
              {session.user.subscription === "Professional" ? (
                <div className="w-full flex items-center justify-center gap-4">
                  <h1 className="text-sm font-medium" style={{ color: "black" }}>
                    {tp.advancedColor}
                  </h1>

                  <input type="color" title={tp.customColor} value={heroTextColor?.startsWith("#") ? heroTextColor : "#ffffff"} onChange={(e) => setHeroTextColor(e.target.value)} className="w-8 h-8 rounded-full border-4 border-white/30 hover:border-white/70 transition-all cursor-pointer bg-transparent p-0 [&::-webkit-color-swatch-wrapper]:p-0 [&::-webkit-color-swatch]:rounded-full [&::-webkit-color-swatch]:border-none" />
                </div>
              ) : (
                <></>
              )}
            </div>

            <div className="flex gap-2 mt-1">
              <Button size="sm" onClick={saveHero} disabled={savingHero} className="bg-white text-gray-800 hover:bg-white/90 font-semibold">
                {savingHero ? t.common.saving : t.common.save}
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
                {t.common.cancel}
              </Button>
            </div>
          </div>
        ) : (
          <>
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-serif font-bold tracking-wide drop-shadow" style={{ color: heroTextColor }}>
              {heroName || serverData?.userData?.restaurant?.name || "Restaurant"}
            </h1>
            {heroDescription && (
              <p className="mt-3 text-base sm:text-lg max-w-lg mx-auto" style={{ color: heroTextColor, opacity: 0.85 }}>
                {heroDescription}
              </p>
            )}
          </>
        )}

        {!isEditingHero && (
          <button onClick={() => setIsEditingHero(true)} className="absolute top-3 right-3 p-2 rounded-lg bg-white/10 hover:bg-white/20 text-white/70 hover:text-white transition-all" title={tp.editHero}>
            <FaPen className="w-4 h-4 " />
          </button>
        )}
      </div>

      {/* Mit Hintergrundbild keine Hintergrundfarbe hier — sie würde das Bild verdecken
          (das Bild liegt als feste Ebene im äußeren Wrapper, wie in der Gastansicht). */}
      <div className={`flex-1 font-sans ${!bgColor && !savedBgImageUrl ? "bg-amber-50" : ""} ${!fontColor ? "text-gray-900" : ""}`} style={{ ...(bgColor && !savedBgImageUrl ? { backgroundColor: bgColor } : {}), ...(fontColor ? { color: fontColor } : {}) }}>
        <main className="w-full">
          <div className="max-w-7xl mx-auto px-2 sm:px-4 py-6 sm:py-8 space-y-8 sm:space-y-12">
            {categoryGroups.length > 0 && (
              <div className="flex flex-wrap items-center gap-3">
                <div className="relative w-full sm:max-w-sm">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-gray-400 pointer-events-none" />
                  <Input value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} placeholder={tp.searchPlaceholder} className="pl-9 pr-9 bg-white text-gray-900" aria-label={tp.searchLabel} />
                  {searching && (
                    <button type="button" onClick={() => setSearchTerm("")} className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-gray-400 hover:text-gray-700" aria-label={tp.clearSearch}>
                      <X className="size-4" />
                    </button>
                  )}
                </div>
                {searching && (
                  <span className="text-sm opacity-70">
                    {searchMatchCount === 0 ? tp.noMatches : plural(searchMatchCount, tp.matchesOne, tp.matchesOther)}
                  </span>
                )}
              </div>
            )}
            {categoryGroups.length ? (
              categoryGroups.filter(groupMatchesSearch).map((group) => (
                <div key={group.id} className={`${RADIUS_CLASS[groupBorderMap[group.id] ?? group.borderRadius] ?? "rounded-2xl"} shadow-sm p-3 sm:p-6 border border-amber-100 ${bgColorClass(groupColorMap[group.id] ?? group.color) || "bg-white"}`} style={bgColorStyle(groupColorMap[group.id] ?? group.color)}>
                  {/* Gleiche Anordnung wie in der Kategorie-Kopfzeile: gestalten, löschen */}
                  <div className="flex gap-2">
                    <Button onClick={() => renderCategoryGroupEdit(group.id)} size="icon" variant="outline" title={tp.styleGroup}>
                      <FaPen />
                    </Button>
                    <Button variant="destructive" size="icon" onClick={() => setConfirmDeleteGroup(group)} title={tp.deleteGroup}>
                      <FaTrash />
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
                  {/* Zum Löschen vorgemerkte Gruppen bekommen bewusst keinen
                      Inline-Farbstil, damit rot/durchgestrichen sichtbar bleibt */}
                  <h2
                    className={`text-xl sm:text-2xl font-semibold mb-4 sm:mb-6 border-b pb-3 sm:pb-4 break-words ${deleteCategoryGroups.includes(group.id) ? "text-red-600 line-through" : ""}`}
                    style={{
                      ...(!deleteCategoryGroups.includes(group.id) && (groupFontColorMap[group.id] ?? group.fontColor) ? { color: groupFontColorMap[group.id] ?? group.fontColor } : {}),
                      textAlign: groupAlignMap[group.id] ?? group.titleAlign ?? "left",
                      ...(headingFont ? { fontFamily: headingFont } : {}),
                    }}
                  >
                    {group.name}
                    {deleteCategoryGroups.includes(group.id) && <span className="ml-3 text-sm font-normal no-underline">{tp.deletedOnSave}</span>}
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
                        onCategoryRenamed={handleCategoryRenamed}
                        restaurantId={restaurantID}
                        userID={userID}
                        positionNum={positionNum}
                        allowPremiumColor={allowPremiumColor}
                        allowAvailability={allowAvailability}
                        searchTerm={searchTerm}
                      />
                    ))}
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center text-gray-500 py-10">{tp.noData}</div>
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

      {/* Kategorie-Gruppe löschen — nimmt alle Kategorien und Gerichte darin mit,
          deshalb beziffert die Rückfrage, was verschwindet */}
      <ConfirmDialog
        open={confirmDeleteGroup !== null}
        onOpenChange={(open) => !open && setConfirmDeleteGroup(null)}
        title={tp.confirmDeleteGroupTitle}
        description={
          (confirmDeleteGroup?.categories?.length ?? 0) > 0
            ? fmt(tp.confirmDeleteGroupFull, {
                name: confirmDeleteGroup?.name,
                categories: plural(confirmDeleteGroup.categories.length, tp.categoryOne, tp.categoryOther),
                dishes: confirmDeleteGroup.categories.reduce((n, c) => n + (c.dishes?.length ?? 0), 0),
              })
            : fmt(tp.confirmDeleteGroupEmpty, { name: confirmDeleteGroup?.name })
        }
        confirmLabel={tp.deleteGroup}
        onConfirm={() => {
          updateDeleteCategorieGroups(confirmDeleteGroup.id);
          setConfirmDeleteGroup(null);
        }}
      />

      {/* Ungespeicherte Änderungen verwerfen — unwiderruflich, deshalb mit Rückfrage */}
      <ConfirmDialog
        open={confirmDiscard}
        onOpenChange={setConfirmDiscard}
        title={tp.confirmDiscardTitle}
        description={tp.confirmDiscardText}
        confirmLabel={tp.discard}
        onConfirm={() => {
          discardDraft();
          setConfirmDiscard(false);
        }}
      />

      {/* Speichern-Leiste — erscheint nur bei ungespeicherten Änderungen */}
      {(components.length > 0 || deletedDishes.length > 0 || deletedCategories.length > 0 || deleteCategoryGroups.length > 0) && (
        <div className="fixed bottom-4 inset-x-0 z-40 flex justify-center px-4 pointer-events-none">
          <div className="pointer-events-auto flex flex-col items-center gap-1 bg-white border border-gray-200 shadow-lg rounded-2xl px-4 py-2">
            {draftRestored && <span className="text-xs text-amber-700">{fmt(tp.draftRestored, { age: formatDraftAge(draftRestored, locale) })}</span>}
            <div className="flex flex-wrap items-center justify-center gap-x-3 gap-y-1">
              <span className="text-sm text-gray-600 text-center">
                {tp.unsavedChanges}
                {components.length > 0 && fmt(tp.unsavedNew, { n: components.length })}
                {deletedDishes.length + deletedCategories.length + deleteCategoryGroups.length > 0 && fmt(tp.unsavedDeleted, { n: deletedDishes.length + deletedCategories.length + deleteCategoryGroups.length })}
              </span>
              <Button variant="ghost" size="sm" onClick={() => setConfirmDiscard(true)} disabled={isSaving} className="rounded-full text-gray-500">
                {tp.discard}
              </Button>
              <Button onClick={() => submitData()} disabled={isSaving} className="rounded-full">
                <Save className="size-4" />
                {isSaving ? t.common.saving : t.common.save}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
