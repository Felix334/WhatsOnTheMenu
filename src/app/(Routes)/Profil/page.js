"use client";

import React from "react";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Image from "next/image";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { useSession } from "next-auth/react";

import { Button } from "@/components/ui/button";
import { Table, TableBody, TableHead, TableRow, TableCell, TableHeader } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Label } from "@/components/ui/label";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetFooter, SheetTrigger } from "@/components/ui/sheet";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

import { toast } from "sonner";
import { FaPen, FaTrash } from "react-icons/fa";
import { CheckCircle, XCircle } from "lucide-react";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";

import { menuSchema, itemSchema } from "./components/menuSchema";
import { SelectItem } from "./components/selectItem";
import { OptionMenu } from "./components/optionMenu";
import { EdditCategoryMenu } from "./components/edditCategoryWin";
import { TierSystem } from "./components/TierLimits";
import { useRestaurantData } from "./components/fetchData";
import { EdditCategoryGroup } from "./components/edditCategoryGroup";
import { SortComponents } from "./components/sortMenu";
import { bgColorClass, bgColorStyle } from "./components/ColorPicker";

// Feheler kam nachdem ich ein neues Schema hinzugefügt hatte und geht jetzt nicht mehr weg

//const schnitzel = require("./img/SchnitzelMitSpätzle.jpg");
// const restaurant_icon = require("./img/restaurantLabelIcon.png");
//const newImag = require("../public/uploads/Restaurant/cmjfraygl000055s0lz2ld3d1/DRK-LogoUK.jpg")

const HERO_COLOR_PRESETS = [
  { key: "amber", label: "Amber", gradient: "from-amber-700 via-orange-600 to-amber-600" },
  { key: "green", label: "Grün", gradient: "from-emerald-700 via-green-600 to-teal-600" },
  { key: "blue", label: "Blau", gradient: "from-blue-700 via-indigo-600 to-blue-600" },
  { key: "red", label: "Rot", gradient: "from-red-700 via-rose-600 to-red-500" },
  { key: "purple", label: "Lila", gradient: "from-purple-700 via-violet-600 to-purple-500" },
  { key: "dark", label: "Dunkel", gradient: "from-gray-900 via-gray-800 to-gray-700" },
];

const HERO_GRADIENT_MAP = Object.fromEntries(HERO_COLOR_PRESETS.map(({ key, gradient }) => [key, gradient]));

export default function PageBuilder() {
  const router = useRouter();

  const [components, setComponents] = useState([]); // will hold { type: "menuSection", section: { title, items } }
  const [edditComponents, setEdditComponents] = useState([]);
  const [deletedDishes, setDeletedDishes] = useState([]); // Track deleted dish IDs
  const [deletedCategories, setDeletedCategories] = useState([]); // Track deleted category IDs
  const [deleteCategoryGroup, setDeleteCategoryGroup] = useState([]);
  const [newBgColor, setNewBgColor] = useState();

  const deletedDishesRef = useRef([]);
  const deletedCategoriesRef = useRef([]);

  const [userID, setUserID] = useState("");

  const { serverData, isLoading, restaurantID, bgColor, font, positionNum, setIsLoading } = useRestaurantData(userID);
  console.log("New BG:", bgColor);
  console.log("New Font:", font);

  // Controlled sheets
  const [openEditor, setOpenEditor] = useState(false);
  const [openOptions, setOpenOptions] = useState(false);
  const [autherized, setIsAutherizedUser] = useState(false);
  const [fontNew, setFontNew] = useState("");

  // Hero editing
  const [isEditingHero, setIsEditingHero] = useState(false);
  const [heroName, setHeroName] = useState("");
  const [heroDescription, setHeroDescription] = useState("");
  const [heroColor, setHeroColor] = useState(null);
  const [savingHero, setSavingHero] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState({}); // { index: File }

  const [Limit, setLimit] = useState({});
  const [exeedCatLimit, setExeedCatLimit] = useState(false);
  const [exeedDishLimit, setExeedDishLimit] = useState(false);
  const [catCount, setCatCount] = useState(0);
  const [dishCount, setDishCount] = useState(0);
  const [allowPremiumColor, setAllowPremiumColor] = useState(false);
  const [renderCatGroupMenu, setRenderCatGroupMenu] = useState(null);

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
        break;
      case "Individuell":
        setLimit(TierSystem.Individuell);
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
    setHeroName(serverData?.userData?.restaurant?.name || "");
    setHeroDescription(serverData?.userData?.restaurant?.menu?.[0]?.description || "");
    setHeroColor(serverData?.userData?.restaurant?.menu?.[0]?.heroColor || null);
  }, [serverData]);

  const saveHero = async () => {
    setSavingHero(true);
    try {
      const restaurantId = serverData?.userData?.restaurant?.id;
      const res = await fetch("/api/user/profil/updateHero", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ restaurantId, name: heroName, description: heroDescription, heroColor }),
      });
      if (!res.ok) throw new Error("Fehler beim Speichern");
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
      items: [{ name: "", price: 0, description: "", image: "" }],
    },
  });

  const { control, handleSubmit, reset, watch, setValue } = form;
  const { fields, append, remove } = useFieldArray({ control, name: "items" });

  const menuEntry = serverData?.menu?.[0];

  //const font = serverData.menu[0].font
  console.log("Font:", font);

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
    const updatedItems = await Promise.all(
      data.items.map(async (item, index) => {
        if (selectedFiles[index]) {
          if (selectedFiles[index]) {
            try {
              const uploadData = new FormData();

              uploadData.append("image", selectedFiles[index]);
              uploadData.append("restaurantID", restaurantID);
              uploadData.append("userID", userID);

              const response = await fetch("/api/user/profil/uploadImg", {
                method: "POST",
                body: uploadData,
              });

              if (response.ok) {
                const result = await response.json();

                return {
                  ...item,
                  image: result.path,
                };
              } else {
                toast.error(`Bild-Upload fehlgeschlagen für Gericht ${index + 1}`);
              }
            } catch (error) {
              console.error(error);
            }
          }
        }
        return item;
      }),
    );

    const updatedData = { ...data, items: updatedItems };
    submitToServer(updatedData);
    setOpenEditor(false);
    setSelectedFiles({}); // Clear selected files after adding section
  };

  const submitData = async () => {
    const restaurantID = serverData.userData.restaurant.id;
    console.log(`Vor dem Senden: UserID: ${userID}, RestaurantID: ${restaurantID}`);
    console.log("Deleted Dishes:", deletedDishes);
    console.log("Deleted Categories:", deletedCategories);

    setIsLoading(true);

    try {
      // First, save the data
      const response = await fetch("/api/user/profil/setData", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          restaurantId: restaurantID,
          data: components,
        }),
      });

      const resData = await response.json();

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}, Message: ${resData.message || "N/A"}, Error: ${resData.error || "N/A"}`);
      }

      // Then, handle deletions if any
      console.log(`Gerichte löschen ${deletedDishes}, Kategorien löschen: ${deletedCategories}, Gruppen löschen: ${deleteCategoryGroup}`);
      if (deletedDishesRef.current.length > 0 || deletedCategoriesRef.current.length > 0) {
        const deleteResponse = await fetch("/api/user/profil/deleteData", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            restaurantId: restaurantID,
            dishes: deletedDishesRef.current,
            categories: deletedCategoriesRef.current,
          }),
        });

        const deleteResData = await deleteResponse.json();

        if (!deleteResponse.ok) {
          throw new Error(`Delete error! status: ${deleteResponse.status}, Message: ${deleteResData.message || "N/A"}, Error: ${deleteResData.error || "N/A"}`);
        }

        // Clear the deleted lists after successful deletion
        setDeletedDishes([]);
        setDeletedCategories([]);
      } else {
        console.log("No deletions to process");
      }

      toast.success("Daten erfolgreich gespeichert!");
      setSelectedFiles({});
    } catch (err) {
      console.error("Failed to save data:", err);
      toast.error("Fehler beim Speichern: " + err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const goBackBtn = () => {
    router.push("../");
  };

  const ALLERGEN_LETTER = {
    Gluten: "A",
    Krebstiere: "B",
    Eier: "C",
    Fisch: "D",
    Erdnüsse: "E",
    Soja: "F",
    Milch: "G",
    Schalenfrüchte: "H",
    Sellerie: "I",
    Senf: "J",
    Sesam: "K",
    Sulfite: "L",
    Lupinen: "M",
    Weichtiere: "N",
  };

  const AllergenBadges = ({ ingredients }) => {
    if (!ingredients || ingredients.length === 0) return null;
    return (
      <div className="flex flex-warp gap-1 mt-1">
        {ingredients.map((ing) => (
          <span key={ing.id ?? ing.name} title={ing.name} className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-amber-100 text-amber-800 text-[10px] font-bold border border-amber-300">
            {ALLERGEN_LETTER[ing.name] ?? "?"}
          </span>
        ))}
      </div>
    );
  };

  const categoryGroups = serverData?.userData?.restaurant?.menu[0]?.categoryGroup ?? [];
  console.log("Group-Test z319:", serverData?.userData?.restaurant?.menu[0].categoryGroup);
  console.log("Groups-Test z320", categoryGroups);
  const categoryGroupNames = [...(categoryGroups?.map((group) => group.name) ?? []), "Mittagessen", "Abendessen", "Frühstück", "Snacks", "Getränke"].filter((name) => name && name.trim());

  // Kategorien-Namen (korrigiert)
  const categoryNames = categoryGroups.flatMap((group) => (group.categories ?? []).map((cat) => cat.name)).filter((name) => name && name.trim());
  console.log("CategorieNames", categoryNames);

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
                          <Input list="categoryGroup" minLength={1} autoComplete="new-password" autoCorrect="off" spellCheck="false" placeholder="Hinzufügen order erstellen" {...field} className="w-[90%]" />
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
                <h1>Der Neue aber kaputte Code = der useFieldArray stört die Sheets</h1>

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
                      {/* File input: upload to server */}
                      <FormField
                        control={control}
                        name={`items.${index}.image`}
                        render={() => (
                          <FormItem>
                            <FormLabel className="pt-3">Bild</FormLabel>
                            <FormControl>
                              <input
                                type="file"
                                accept="image/*"
                                onChange={(e) => {
                                  const file = e.target.files?.[0];
                                  if (!file) return;

                                  // nur merken — NICHT hochladen
                                  setSelectedFiles((prev) => ({
                                    ...prev,
                                    [index]: file,
                                  }));

                                  // Preview anzeigen
                                  const previewUrl = URL.createObjectURL(file);
                                  setValue(`items.${index}.image`, previewUrl);
                                }}
                              />
                            </FormControl>
                            {watch(`items.${index}.image`) && (
                              <div className="mt-2">
                                <Image src={String(watch(`items.${index}.image`))} alt="Vorschau" width={200} height={150} className="mt-2 rounded-lg border" />
                              </div>
                            )}
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
              <Link href="/pricing" className="ml-auto font-semibold underline text-amber-600 hover:text-amber-700 whitespace-nowrap">
                ↑ Upgrade
              </Link>
            </div>
          ) : (
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                append({ name: "", price: 0, description: "", image: "" });
              }}
            >
              Gericht hinzufügen
            </Button>
          )}
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );

  /* ---------- Options Sheet ---------- */

  /* ---------- Menu Section Presentation ---------- */

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  const MenuSection = ({ title, menuItems, categoryId, bgColor }) => {
    const [expandedIndex, setExpandedIndex] = useState(null);
    const [openItem, setOpenItem] = useState(false);
    const [selectedItem, setSelectedItem] = useState(null);
    const [openCategoryMenu, setOpenCategoryMenu] = useState(false);

    // Optimistisches Stock-State: { [dishId]: "isAvailable" | "outOfStock" }
    const [stockMap, setStockMap] = useState(() => Object.fromEntries((menuItems ?? []).map((d) => [d.id, d.stock ?? "isAvailable"])));

    const toggleAvailability = async (e, dishId) => {
      e.stopPropagation();
      const current = stockMap[dishId] ?? "isAvailable";
      const next = current === "isAvailable" ? "outOfStock" : "isAvailable";

      // Optimistisch aktualisieren
      setStockMap((prev) => ({ ...prev, [dishId]: next }));

      try {
        const resp = await fetch("/api/user/profil/updateDishAvailability", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            dishId,
            restaurantId: serverData?.userData?.restaurant?.id,
            stock: next,
          }),
        });
        if (!resp.ok) throw new Error("Fehler");
        toast.success(next === "isAvailable" ? "Gericht als verfügbar markiert" : "Gericht als nicht verfügbar markiert");
      } catch {
        // Zurücksetzen bei Fehler
        setStockMap((prev) => ({ ...prev, [dishId]: current }));
        toast.error("Status konnte nicht geändert werden");
      }
    };
    const [itemData, setItemData] = useState({
      id: "",
      name: "",
      price: 0,
      description: "",
    });
    // Optimistischer Item-Cache: { [dishId]: updatedItem }
    const [changedItems, setChangedItems] = useState({});
    // Merge: lokale Änderungen haben Vorrang vor serverData
    const displayItems = (menuItems ?? []).map((item) => (changedItems[item.id] ? { ...item, ...changedItems[item.id] } : item));
    const [changedCategories, setChangedCategories] = useState([]);
    const toggleExpand = (index) => setExpandedIndex(expandedIndex === index ? null : index);
    const [pendingDeleteDishId, setPendingDeleteDishId] = useState(null);
    const [confirmDeleteCategory, setConfirmDeleteCategory] = useState(false);

    const [edditCategoryData, setEdditCategoryData] = useState([
      {
        color: "",
        position: "",
        name: "",
        boder: "",
      },
    ]);

    const openMenuItemEddit = (item) => {
      setSelectedItem(item); // vollständiges Item inkl. ingredients für Allergen-Dialog
      setItemData((prev) => ({
        ...prev,
        id: item.id,
        name: item.name,
        price: item.price,
        description: item.description,
      }));
      setOpenItem(true);
    };

    const openCategoryMenu_ = () => {
      setOpenCategoryMenu(!openCategoryMenu);
    };

    const deleteDish = (dishId) => {
      setPendingDeleteDishId(dishId);
    };

    const deleteCategory = () => {
      setConfirmDeleteCategory(true);
    };

    return (
      <div className={`rounded-xl shadow-lg max-w-6xl w-full overflow-hidden ${bgColorClass(bgColor)}`} style={bgColorStyle(bgColor)}>
        <div className={`relative flex items-center justify-center py-6 px-4 border-b ${bgColorClass(bgColor)}`} style={bgColorStyle(bgColor)}>
          <h3 className={`text-center text-2xl sm:text-3xl md:text-4xl font-semibold ${deletedCategories.includes(categoryId) ? "text-red-600 line-through" : ""}`}>{title}</h3>

          <div className="absolute left-2 sm:left-4 flex gap-2">
            <Button onClick={openCategoryMenu_} size="icon" variant="outline">
              <FaPen />
            </Button>

            <Button variant="destructive" size="icon" onClick={deleteCategory}>
              <FaTrash />
            </Button>
          </div>
        </div>
        <div className="overflow-x-auto">
          <Table className="w-full min-w-[700px] table-fixed">
            <colgroup>
              <col className="w-24" />
              <col className="w-full" />
              <col className="w-24" />
            </colgroup>
            <TableHeader>
              <TableRow className={`hover:bg-gray-100 w-full ${bgColor}`}>
                <TableHead className="text-left">Aktionen</TableHead>
                <TableHead className="text-left" style={{ fontFamily: fontNew }}>
                  Speisen
                </TableHead>
                <TableHead className="text-right right-1 absolute">Preis:</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody className="">
              {displayItems.map((item, index) => (
                <React.Fragment key={index}>
                  <TableRow
                    className={`
                      ${deletedDishes.includes(item.id) ? "bg-red-100 hover:bg-red-200" : "hover:bg-gray-50"} 
                      transition-colors duration-200 cursor-pointer border-b
                    `}
                    onClick={() => toggleExpand(index)}
                  >
                    <TableCell className="align-middle">
                      <div className="flex gap-1 flex-wrap">
                        <Button
                          size="icon"
                          variant="secondary"
                          onClick={(e) => {
                            e.stopPropagation();
                            openMenuItemEddit(item);
                          }}
                        >
                          <FaPen />
                        </Button>

                        <Button
                          size="icon"
                          variant="destructive"
                          onClick={(e) => {
                            e.stopPropagation();
                            deleteDish(item.id);
                          }}
                        >
                          <FaTrash />
                        </Button>

                        {/* Verfügbarkeits-Toggle */}
                        <Button size="icon" variant="outline" title={stockMap[item.id] === "outOfStock" ? "Nicht verfügbar – klicken zum Aktivieren" : "Verfügbar – klicken zum Deaktivieren"} onClick={(e) => toggleAvailability(e, item.id)} className={stockMap[item.id] === "outOfStock" ? "border-red-400 text-red-500 hover:bg-red-50" : "border-green-400 text-green-600 hover:bg-green-50"}>
                          {stockMap[item.id] === "outOfStock" ? <XCircle className="size-4" /> : <CheckCircle className="size-4" />}
                        </Button>
                      </div>
                    </TableCell>

                    <TableCell className={`align-middle ${deletedDishes.includes(item.id) ? "text-red-600 line-through" : "text-gray-900"}`}>
                      <div className="flex flex-col">
                        <span className={`font-serif truncate ${stockMap[item.id] === "outOfStock" ? "text-gray-400" : ""}`}>{item.name}</span>
                        {item.description && <span className="text-sm text-gray-500">{item.description}</span>}
                        {stockMap[item.id] === "outOfStock" && <span className="text-xs font-medium text-red-500 mt-0.5">● Nicht verfügbar</span>}
                        <AllergenBadges ingredients={item.ingredients} />
                      </div>
                    </TableCell>
                    <TableCell className={`text-right font-mono right-1 absolute ${deletedDishes.includes(item.id) ? "text-red-600 line-through" : "text-gray-800"}`}>{Number(item.price).toFixed(2)}€</TableCell>
                  </TableRow>

                  {expandedIndex === index && (
                    <TableRow className="bg-gray-50">
                      <TableCell colSpan={4} className="px-4 sm:px-6 py-4">
                        {item.imageUrl ? <Image src={item.imageUrl} alt="Vorschau" width={800} height={800} className="mt-2 rounded-lg border max-w-full h-auto" /> : <p className="text-gray-500">Kein Bild vorhanden</p>}
                      </TableCell>
                    </TableRow>
                  )}
                </React.Fragment>
              ))}
            </TableBody>
          </Table>
        </div>

        <SelectItem open={openItem} onOpenChange={setOpenItem} selectedItem={selectedItem} setChangedItem={(item) => setChangedItems((prev) => ({ ...prev, [item.id]: item }))} category={title} restaurantId={serverData?.userData?.restaurant?.id} userID={userID} />

        {/* Bestätigungs-Dialog: Gericht löschen */}
        <ConfirmDialog
          open={pendingDeleteDishId !== null}
          onOpenChange={(open) => !open && setPendingDeleteDishId(null)}
          title="Gericht löschen?"
          description="Das Gericht wird beim nächsten Speichern entfernt."
          confirmLabel="Löschen"
          onConfirm={() => {
            updateDeletedDishes(pendingDeleteDishId);
            setPendingDeleteDishId(null);
          }}
        />

        {/* Bestätigungs-Dialog: Kategorie löschen */}
        <ConfirmDialog
          open={confirmDeleteCategory}
          onOpenChange={setConfirmDeleteCategory}
          title="Kategorie löschen?"
          description="Die gesamte Kategorie und alle Gerichte darin werden entfernt."
          confirmLabel="Kategorie löschen"
          onConfirm={() => {
            updateDeletedCategories(categoryId);
            setConfirmDeleteCategory(false);
          }}
        />

        <EdditCategoryMenu
          open={openCategoryMenu}
          onOpenChange={setOpenCategoryMenu}
          selectedCategory={{
            name: title,
            position: 0,
            color: "",
            border: "",
            id: categoryId,
          }}
          setChangedCategory={setChangedCategories}
          category={title}
          restaurantId={serverData?.userData?.restaurant?.id}
          userID={userID}
          categoryId={categoryId}
          position={positionNum}
          allowPremiumColor={allowPremiumColor}
        />
      </div>
    );
  };

  return (
    <div className="min-h-screen" style={{ fontFamily: fontNew }}>
      <link href="https://fonts.googleapis.com/css2?family=Roboto:wght@400;500;700&family=Open+Sans:wght@400;600;700&family=Lato:wght@400;700&family=Montserrat:wght@400;700&family=Poppins:wght@400;500;700&family=Inter:wght@400;500;700&family=Merriweather:wght@400;700&family=Playfair+Display:wght@400;700&family=Roboto+Slab:wght@400;700&family=JetBrains+Mono:wght@400;700&display=swap"></link>

      <header className="sticky top-0 z-50 w-full bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 py-2 flex items-center justify-between h-12 gap-2">
          <div className="flex gap-3 items-center">
            <Button onClick={goBackBtn} style={{ fontFamily: fontNew }}>
              Zurück
            </Button>

            <OptionMenu openOptions={openOptions} setOpenOptions={setOpenOptions} bgColor={bgColor} setNewBgColor={setNewBgColor} router={router} restaurantID={restaurantID} serverData={serverData} allowPremiumColor={allowPremiumColor} />

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
                  <Link href="/pricing" className="underline font-medium">
                    Upgrade
                  </Link>
                </TooltipContent>
              </Tooltip>
            ) : (
              <MenuEditor categoryGroupNames={categoryGroupNames} />
            )}
            <SortComponents componentList={categoryGroups} />
          </div>

          {/* Abo-Badge mit Live-Zähler */}
          <div className="hidden sm:flex items-center gap-2 text-xs bg-gray-50 border border-gray-200 rounded-lg px-3 py-1.5">
            <span className={`font-semibold ${session?.user?.subscription === "Professional" ? "text-amber-600" : session?.user?.subscription === "Business" ? "text-orange-500" : "text-gray-500"}`}>{session?.user?.subscription === "NoSubscription" ? "Kein Abo" : session?.user?.subscription ?? "Kein Abo"}</span>
            <span className="text-gray-300">|</span>
            <span className={catCount >= Limit.CategoryLimit ? "text-red-500 font-medium" : "text-gray-500"}>
              {catCount}/{Limit.CategoryLimit ?? "?"} Kategorien
            </span>
            <span className="text-gray-300">|</span>
            <span className={dishCount >= Limit.DishLimit ? "text-red-500 font-medium" : "text-gray-500"}>
              {dishCount}/{Limit.DishLimit ?? "?"} Gerichte
            </span>
            {(exeedCatLimit || exeedDishLimit) && (
              <Link href="/pricing" className="ml-1 text-amber-600 hover:text-amber-700 font-semibold hover:underline">
                ↑ Upgrade
              </Link>
            )}
          </div>

          <div className="flex items-center gap-2">
            <Button asChild variant="outline">
              <Link href={`/Profil/Bestellungen?restaurantID=${restaurantID}`}>
                🍽️ Bestellungen
              </Link>
            </Button>
            <Button asChild>
              <Link
                href={{
                  pathname: "/UnserePartner/Restaurants/Menu",
                  query: { userID, restaurantID },
                }}
              >
                User-Ansicht
              </Link>
            </Button>
          </div>
        </div>
      </header>

      <div className={`w-full bg-gradient-to-r ${HERO_GRADIENT_MAP[heroColor] ?? HERO_GRADIENT_MAP.amber} text-white py-10 px-4 text-center relative`}>
        {isEditingHero ? (
          <div className="flex flex-col items-center gap-3 max-w-lg mx-auto mt-1">
            <input value={heroName} onChange={(e) => setHeroName(e.target.value)} className="text-2xl font-serif font-bold text-center bg-white/20 backdrop-blur text-white placeholder-white/50 border border-white/40 rounded-xl px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-white/60" placeholder="Restaurant Name" />
            <input value={heroDescription} onChange={(e) => setHeroDescription(e.target.value)} className="text-sm text-center bg-white/20 backdrop-blur text-white placeholder-white/50 border border-white/40 rounded-xl px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-white/60" placeholder="Kurze Beschreibung (z.B. Authentische italienische Küche)" />

            {/* Farbpalette */}
            <div className="flex flex-wrap justify-center gap-2 mt-1">
              {HERO_COLOR_PRESETS.map(({ key, label, gradient }) => (
                <button key={key} title={label} onClick={() => setHeroColor(key)} className={`w-8 h-8 rounded-full bg-gradient-to-br ${gradient} border-2 transition-all ${(heroColor ?? "amber") === key ? "border-white scale-110 shadow-lg" : "border-white/30 hover:border-white/70"}`} />
              ))}
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
                }}
                className="text-white border border-white/40 hover:bg-white/10"
              >
                Abbrechen
              </Button>
            </div>
          </div>
        ) : (
          <>
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-serif font-bold tracking-wide drop-shadow">{heroName || serverData?.userData?.restaurant?.name || "Restaurant"}</h1>
            {heroDescription && <p className="mt-3 text-white/80 text-sm max-w-md mx-auto">{heroDescription}</p>}
          </>
        )}

        {!isEditingHero && (
          <button onClick={() => setIsEditingHero(true)} className="absolute top-3 right-3 p-2 rounded-lg bg-white/10 hover:bg-white/20 text-white/70 hover:text-white transition-all" title="Header bearbeiten">
            <FaPen className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      <div className={`text-gray-900 font-sans ${!bgColor ? "bg-amber-50" : ""}`} style={bgColor ? { backgroundColor: bgColor } : {}}>
        <main className="w-full">
          <div className="max-w-7xl mx-auto px-4 py-8 space-y-12">
            {serverData?.userData?.restaurant?.menu?.[0]?.categoryGroup?.length ? (
              serverData.userData.restaurant.menu[0].categoryGroup.map((group) => (
                <div key={group.id} className={`rounded-2xl shadow-sm p-6 border border-amber-100 ${bgColorClass(group.color) || "bg-white"}`} style={bgColorStyle(group.color)}>
                  <div>
                    <Button onClick={() => renderCategoryGroupEdit(group.id)}>
                      <FaPen />
                    </Button>
                  </div>
                  {renderCatGroupMenu === group.id && <EdditCategoryGroup renderCatGroupMenu={renderCatGroupMenu} setRenderCatGroupMenu={setRenderCatGroupMenu} id={group.id} name={group.name} position={group.position} bgColor={group.color} restaurantID={restaurantID} allowPremiumColor={allowPremiumColor} />}
                  <h2 className="text-2xl font-semibold mb-6 border-b pb-4">{group.name}</h2>
                  <div className="space-y-8">
                    {group.categories?.map((category) => (
                      <MenuSection key={category.id} title={category.name} menuItems={category.dishes} categoryId={category.id} groupId={group.id} groupName={group.name} bgColor={category.bgColor} />
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

      <div className="fixed bottom-6 left-6 z-20">
        <Button onClick={() => submitData()}>Speichern (Server)</Button>
      </div>
    </div>
  );
}
