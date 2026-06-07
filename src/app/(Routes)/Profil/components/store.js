"use client";

import React, { useEffect, useState, useCallback } from "react";
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

import { FaPen, FaTrash, FaInfo } from "react-icons/fa";

import { menuSchema, itemSchema } from "./components/menuSchema";
import { SelectItem } from "./components/selectItem";
import { OptionMenu } from "./components/optionMenu";
import { EdditCategoryMenu } from "./components/edditCategoryWin";
import { TierSystem } from "./components/TierLimits";

// Feheler kam nachdem ich ein neues Schema hinzugefügt hatte und geht jetzt nicht mehr weg

//const schnitzel = require("./img/SchnitzelMitSpätzle.jpg");
const restaurant_icon = require("./img/restaurantLabelIcon.png");
//const newImag = require("../public/uploads/Restaurant/cmjfraygl000055s0lz2ld3d1/DRK-LogoUK.jpg")

export default function PageBuilder() {
  const router = useRouter();

  const [components, setComponents] = useState([]); // will hold { type: "menuSection", section: { title, items } }
  const [serverData, setServerData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [edditComponents, setEdditComponents] = useState([]);
  const [deletedDishes, setDeletedDishes] = useState([]); // Track deleted dish IDs
  const [deletedCategories, setDeletedCategories] = useState([]); // Track deleted category IDs

  const [bgColor, setBgColor] = useState("");
  const [userID, setUserID] = useState("");
  const [restaurantID, setRestaurantID] = useState("");

  // Controlled sheets
  const [openEditor, setOpenEditor] = useState(false);
  const [openOptions, setOpenOptions] = useState(false);
  const [edditName, setEdditName] = useState(false);
  const [autherized, setIsAutherizedUser] = useState(false);
  const [fontNew, setFontNew] = useState("");
  const [selectedFiles, setSelectedFiles] = useState({}); // { index: File }
  const [positionNum, setPositionNum] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [Limit, setLimit] = useState({});
  const [exeedCatLimit, setExeedCatLimit] = useState(false);
  const [exeedDishLimit, setExeedDishLimit] = useState(false);
  const [allowPremiumColor, setAllowPremiumColor] = useState(false);

  const { data: session, status } = useSession();

  useEffect(() => {
    if (status !== "authenticated" || !session?.user || autherized) return;

    if (session.user.role === "Owner") {
      console.log("Signed in as:", session.user.id);
      console.log("User Data:", session.user);
      console.log("User Subscription:", session.user.subscription);

      setUserID(session.user.id);

      switch (session.user.subscription) {
        case "Basic":
          setLimit(TierSystem.FreeTier);
          console.log("Free Tier Limit freigeschalten:", TierSystem.FreeTier);
          break;
        case "Professional":
          setLimit(TierSystem.PremiumTier);
          setAllowPremiumColor(true);
          console.log("Premium Tier Limit freigeschalten:", TierSystem.PremiumTier);
          break;
        case "Advantst":
          setLimit(TierSystem.Advantst);
          console.log("Advantst Tier Limit freigeschalten:", TierSystem.Advantst);
          break;
        default:
          console.log("Kein bekanntes Abo:", session.user.subscription);
          break;
      }

      setIsAutherizedUser(true);
    }
  }, [status, autherized, session]);

  const calculateLimit = useCallback(() => {
    console.log("Caclulate Data")
    if (!serverData) return;
    const catCount = (serverData?.userData?.restaurant?.menu?.[0]?.categoryGroups?.reduce((total, cg) => total + (cg.categorys?.length || 0), 0) || 0) + (components.length || 0);
    const dishCount = (serverData?.userData?.restaurant?.menu?.[0]?.categoryGroups?.flatMap((cg) => cg.categorys?.flatMap((c) => c.dishes || []) || []).length || 0) + components.reduce((acc, c) => acc + (c.section.items?.length || 0), 0);
    console.log("Limit:", Limit);
    console.log("TierSystem:", TierSystem);
    console.log("Calc Limit", catCount, dishCount);
    console.log(exeedCatLimit, exeedDishLimit);
    setExeedCatLimit(catCount >= Limit.CategoryLimit);
    setExeedDishLimit(dishCount >= Limit.DishLimit);
  }, [serverData, components, Limit, exeedCatLimit, exeedDishLimit]);

  useEffect(() => {
    if (serverData?.userData?.restaurant?.menu?.[0]) {
      const count = serverData.userData.restaurant.menu[0].categoryGroups.reduce((total, cg) => total + (cg.categorys?.length || 0), 0);
      setPositionNum(count);
    }
    calculateLimit();
  }, [serverData, components, Limit, calculateLimit]);

  const form = useForm({
    resolver: zodResolver(menuSchema),
    defaultValues: {
      menu_group: "",
      menu_name: "",
      items: [{ name: "", price: 0, description: "", image: "" }],
    },
  });

  const { control, handleSubmit, reset, watch, setValue } = form;
  const { fields, append, remove } = useFieldArray({ control, name: "items" });

  // Checken ob mehrere Standorte/restaurants vorliegen und wenn ja beim öffnen der Seite ein Popup erstellen und dann oben ein Select

  useEffect(() => {
    if (!userID) return;

    const controller = new AbortController();

    const fetchData = async () => {
      try {
        const response = await fetch("/api/user/profil/getData", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userID }),
          signal: controller.signal,
        });

        if (response.status === 401) {
          window.alert("Bitte melden Sie sich an");
          return;
        }

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}`);
        }

        const freshData = await response.json();
        console.log("Server Response:", freshData);

        setServerData(freshData);
        setRestaurantID(freshData.userData.restaurant.id);
        setBgColor(freshData.userData.restaurant.menu[0]?.bgColor || "");
        setFontNew(freshData.userData.restaurant.menu?.[0]?.font || "");
        // positionNum calculated in useEffect after data loads
      } catch (error) {
        if (error.name !== "AbortError") {
          console.error("Fetch failed:", error);
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();

    return () => controller.abort();
  }, [userID]);

  const submitToServer = (data) => {
    const newSection = {
      title: data.menu_name,
      items: data.items,
    };

    setComponents((prev) => [...prev, { type: "menuSection", section: newSection }]);
  };

  const onSubmit = async (data) => {
    console.log("Execute Submit Data:", data)
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
                alert(`Bild-Upload fehlgeschlagen für Gericht ${index + 1}`);
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
    setSelectedFiles({});
  };

  const submitData = async () => {
    console.log("🖱️ Speichern button clicked!");
    console.log("📊 serverData:", !!serverData);
    console.log("🏪 restaurant:", !!serverData?.userData?.restaurant);
    console.log("🍽️  menu:", !!serverData?.userData?.restaurant?.menu?.[0]);
    console.log("📱 components:", components.length);
    console.log("🗑️  deletedDishes:", deletedDishes.length);
    console.log("🗑️  deletedCategories:", deletedCategories.length);
    if (!serverData || !serverData.userData?.restaurant) {
      alert("Lade Daten zuerst...");
      return;
    }

    const restaurantID = serverData.userData.restaurant.id;
    const menu = serverData.userData.restaurant.menu[0];

    if (!menu) {
      alert("Kein Menü gefunden. Erstelle zuerst ein Menü.");
      return;
    }

    // Convert server menu data to API format
    const menuData = menu.categoryGroups.map((cg) => ({
      categoryGroupName: cg.name,
      categoryGroupColor: cg.color,
      categorys: cg.categorys.map((cat) => ({
        categoryName: cat.name,
        dishes: cat.dishes.map((dish) => ({
          name: dish.name,
          description: dish.description,
          price: dish.price,
          imageUrl: dish.imageUrl || dish.image || "",
        })),
      })),
    }));

    // Add local components
    components.forEach((section) => {
      menuData.push({
        categoryGroupName: "Neue Gruppe",
        categoryGroupColor: "#ffffff",
        categorys: [
          {
            categoryName: section.section.title,
            dishes: section.section.items.map((item) => ({
              name: item.name,
              description: item.description,
              price: parseFloat(item.price) || 0,
              imageUrl: item.image || "",
            })),
          },
        ],
      });
    });

    console.log("📤 Sending menuData:", menuData);

    setIsLoading(true);

    try {
      const saveResponse = await fetch("/api/user/profil/setData", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          restaurantId: restaurantID,
          data: menuData,
        }),
      });

      const saveResult = await saveResponse.json();

      if (!saveResponse.ok) {
        throw new Error(saveResult.message || `HTTP ${saveResponse.status}`);
      }

      // Handle deletions separately
      if (deletedDishes.length > 0 || deletedCategories.length > 0) {
        const deleteResponse = await fetch("/api/user/profil/deleteData", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            restaurantId: restaurantID,
            dishes: deletedDishes,
            categories: deletedCategories,
            files: [],
          }),
        });

        if (!deleteResponse.ok) {
          const deleteResult = await deleteResponse.json();
          console.warn("Delete failed but save succeeded:", deleteResult);
        }
      }

      // Reset state
      setComponents([]);
      setDeletedDishes([]);
      setDeletedCategories([]);

      alert("✅ Menu gespeichert!");
    } catch (error) {
      console.error("💥 Save error:", error);
      alert(`Fehler: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const goBackBtn = () => {
    router.push("../");
  };

  const MenuEditor = () => (
    <Sheet open={openEditor} onOpenChange={setOpenEditor}>
      <div></div>
      <SheetTrigger asChild>
        <Button variant="outline">Kategorie erstellen</Button>
      </SheetTrigger>
      <SheetContent side="right" className="w-full max-w-3xl">
        <SheetHeader>
          <SheetTitle>Menü-Dashboard</SheetTitle>
          <SheetDescription>Hier können Sie ganz einfach ein neues Menü erstellen</SheetDescription>
        </SheetHeader>
        <ScrollArea className="h-[70vh]">
          <div className="p-4">
            <Form {...form}>
              <form onSubmit={handleSubmit(submitData)} className="space-y-4">
                <FormField
                  control={control}
                  name="menu_group"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Kategorie</FormLabel>
                      <FormControl>
                        <Input placeholder="z.B. Mittag" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={control}
                  name="menu_name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Menüname</FormLabel>
                      <FormControl>
                        <Input placeholder="z.B. Pasta Menü" {...field} />
                      </FormControl>
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
                  <Button type="submit" onClick={() => {
                    submitData(onSubmit)
                  }}>Speichern</Button>
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
            <div>Gericht-Limit erreicht</div>
          ) : (
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                append({ name: "", price: 0, description: "", image: "" }),
                calculateLimit();
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

  const MenuSection = ({ title, menuItems, categoryId }) => {
    const [expandedIndex, setExpandedIndex] = useState(null);
    const [openItem, setOpenItem] = useState(false);
    const [selectedItem, setSelectedItem] = useState(null);
    const [openCategoryMenu, setOpenCategoryMenu] = useState(false);
    const [itemData, setItemData] = useState({
      id: "",
      name: "",
      price: 0,
      description: "",
    });
    const [changedItems, setChangedItems] = useState([]);
    const [changedCategories, setChangedCategories] = useState([]);
    const toggleExpand = (index) => setExpandedIndex(expandedIndex === index ? null : index);
    const [edditCategoryData, setEdditCategoryData] = useState([
      {
        color: "",
        position: "",
        name: "",
        boder: "",
      },
    ]);

    const openMenuItemEddit = (id, name, price, description) => {
      var newEddit = {
        id: id,
        name: name,
        price: price,
        description: description,
      };
      setSelectedItem(newEddit);
      setItemData((prev) => ({
        ...prev,
        id: id,
        name: name,
        price: price,
        description: description,
      }));
      setOpenItem(true);
    };

    const openCategoryMenu_ = () => {
      setOpenCategoryMenu(!openCategoryMenu);
    };

    const deleteDish = (dishId) => {
      console.log("Deleting dish:", dishId);
      if (window.confirm("Sind Sie sicher, dass Sie dieses Gericht löschen möchten?")) {
        setDeletedDishes((prev) => {
          const newList = [...prev, dishId];
          console.log("Updated deletedDishes:", newList);
          return newList;
        });
        // Keep in UI but mark as deleted (will be styled red)
      }
    };

    const deleteCategory = () => {
      if (window.confirm("Sind Sie sicher, dass Sie diese gesamte Kategorie löschen möchten?")) {
        setDeletedCategories((prev) => [...prev, categoryId]);
      }
    };

    if (changedItems) {
      console.log("Changes", changedItems);
    }

    return (
      <div className="bg-white rounded-xl shadow-lg max-w-6xl w-full overflow-hidden j">
        <div className="relative flex items-center justify-center py-6 px-4 border-b bg-gray-50">
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
              <col className="sm:w-20 md:w-full md:absolute" />
              <col className="w-1/4" />
              <col className="w-1/2" />
              <col className="w-24" />
            </colgroup>
            <TableHeader>
              <TableRow className="bg-gray-100 hover:bg-gray-100 w-full">
                <TableHead className="text-left">Aktionen</TableHead>
                <TableHead className="text-left" style={{ fontFamily: fontNew }}>
                  Speisen
                </TableHead>
                <TableHead className="text-right right-1 absolute">Preis:</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody className="">
              {menuItems?.map((item, index) => (
                <React.Fragment key={index}>
                  <TableRow
                    className={`
                      ${deletedDishes.includes(item.id) ? "bg-red-100 hover:bg-red-200" : "hover:bg-gray-50"} 
                      transition-colors duration-200 cursor-pointer border-b
                    `}
                    onClick={() => toggleExpand(index)}
                  >
                    <TableCell className="align-middle">
                      <div className="flex gap-1">
                        <Button
                          size="icon"
                          variant="secondary"
                          onClick={(e) => {
                            e.stopPropagation();
                            openMenuItemEddit(item.id, item.name, item.price, item.description);
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
                      </div>
                    </TableCell>
                    <TableCell className={`align-middle ${deletedDishes.includes(item.id) ? "text-red-600 line-through" : "text-gray-900"}`}>
                      <div className="flex flex-col">
                        <span className="font-serif truncate">{item.name}</span>
                        {item.description && <span className="text-sm text-gray-500 break-words">{item.description}</span>}
                      </div>
                    </TableCell>
                    {parseFloat(item.price || 0).toFixed(2)}€
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

        <SelectItem open={openItem} onOpenChange={setOpenItem} selectedItem={selectedItem} setChangedItem={setChangedItems} category={title} restaurantId={serverData?.userData?.restaurant?.id} userID={userID} />

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
        />
      </div>
    );
  };
  return (
    <div className="min-h-screen" style={{ fontFamily: fontNew }}>
      <link href="https://fonts.googleapis.com/css2?family=Roboto:wght@400;500;700&family=Open+Sans:wght@400;600;700&family=Lato:wght@400;700&family=Montserrat:wght@400;700&family=Poppins:wght@400;500;700&family=Inter:wght@400;500;700&family=Merriweather:wght@400;700&family=Playfair+Display:wght@400;700&family=Roboto+Slab:wght@400;700&family=JetBrains+Mono:wght@400;700&display=swap"></link>
      <div>
        <div className="">
          <div className="sticky top-0 z-50 w-full bg-white shadow-md border-b">
            <div className="max-w-[1280px] mx-auto flex items-center justify-between py-3 ">
              {/* Linke Seite */}
              <div className="flex gap-3">
                <Button onClick={goBackBtn} style={{ fontFamily: fontNew }}>
                  Zurück
                </Button>

                <OptionMenu openOptions={openOptions} setOpenOptions={setOpenOptions} bgColor={bgColor} setBgColor={setBgColor} router={router} restaurantID={restaurantID} serverData={serverData} allowPremiumColor={allowPremiumColor} />

                {!exeedCatLimit && <MenuEditor />}
              </div>
              <div>
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
          </div>
          <div className={`min-h-screen flex flex-col items-center justify-center text-gray-900 font-sans p-8 ${!bgColor ? "bg-gradient-to-r from-yellow-50 via-yellow-100 to-yellow-200" : ""}`} style={bgColor ? { backgroundColor: bgColor } : {}}>
            <header className="mb-12 text-center w-full sm:grid sm:grid-col1">
              <div className="flex items-center justify-center gap-3">
                {!edditName ? (
                  <>
                    {serverData?.userData?.restaurant?.name && (
                      <>
                        <h1 className="text-5xl font-serif font-semibold italic tracking-wide">{serverData.userData.restaurant.name}</h1>
                        <Image src={restaurant_icon} width={100} height={100} alt="RestaurantIcon" />
                      </>
                    )}
                  </>
                ) : (
                  <Input type="text" className="text-center text-5xl" placeholder={serverData?.userData?.restaurant?.name || "Bitte einen Namen für die Überschrift wählen"} />
                )}
              </div>
              <p className="mt-2 text-gray-600 italic max-w-md mx-auto text-2xl" />
            </header>
            <main className="w-full">
              {serverData?.userData?.restaurant?.menu?.[0]?.categoryGroups?.flatMap((cg) => cg.categorys?.map((category) => <MenuSection key={category.id} title={category.name} menuItems={category.dishes} categoryId={category.id} />)) || [] || <div>Keine Daten vorhanden</div>}

              <p className="mt-4" style={{ fontFamily: fontNew }}>
                Gesamtpreis: 0€
              </p>

              <details className="absolute right-1">
                <summary>Debug Data</summary>
                <pre className="mt-8 p-4 bg-gray-100 rounded-lg max-w-7xl overflow-auto text-sm">{JSON.stringify(serverData, null, 2)}</pre>
              </details>
            </main>
          </div>
          <div className="fixed bottom-6 left-6 z-20">
            <Button onClick={submitData} disabled={isLoading} className={isLoading ? "animate-pulse" : ""}>
              {isLoading ? "💾 Speichere..." : "💾 Speichern (Server)"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
