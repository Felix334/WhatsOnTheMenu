"use client";

import React from "react";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Image from "next/image";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import * as CryptoJS from "crypto-js";
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

import { FaPen, FaTrash, FaInfo } from "react-icons/fa";

import { menuSchema, itemSchema } from "./components/menuSchema";
import { SelectItem } from "./components/selectItem";
import { OptionMenu } from "./components/optionMenu";
import { EdditCategoryMenu } from "./components/edditCategoryWin";
import { TierSystem } from "./components/TierLimits";
import { useRestaurantData } from "./components/fetchData";

// Feheler kam nachdem ich ein neues Schema hinzugefügt hatte und geht jetzt nicht mehr weg

//const schnitzel = require("./img/SchnitzelMitSpätzle.jpg");
// const restaurant_icon = require("./img/restaurantLabelIcon.png");
//const newImag = require("../public/uploads/Restaurant/cmjfraygl000055s0lz2ld3d1/DRK-LogoUK.jpg")

export default function PageBuilder() {
  const router = useRouter();

  const [components, setComponents] = useState([]); // will hold { type: "menuSection", section: { title, items } }

  const [edditComponents, setEdditComponents] = useState([]);
  const [deletedDishes, setDeletedDishes] = useState([]); // Track deleted dish IDs
  const [deletedCategories, setDeletedCategories] = useState([]); // Track deleted category IDs
  const [deleteCategoryGroup, setDeleteCategoryGroup] = useState([]);

  const deletedDishesRef = useRef([]);
  const deletedCategoriesRef = useRef([]);

  const [userID, setUserID] = useState("");

  const { serverData, isLoading, restaurantID, bgColor, font, positionNum, setIsLoading, setBgColor } = useRestaurantData(userID);

  // Controlled sheets
  const [openEditor, setOpenEditor] = useState(false);
  const [openOptions, setOpenOptions] = useState(false);
  const [edditName, setEdditName] = useState(false);
  const [autherized, setIsAutherizedUser] = useState(false);
  const [fontNew, setFontNew] = useState("");
  const [selectedFiles, setSelectedFiles] = useState({}); // { index: File }

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

  // Moved calculateLimit to useEffect below to fix ReferenceError

  useEffect(() => {
    if (!serverData || !Limit) return;
    const catCount = (serverData?.userData?.restaurant?.menu?.[0]?.categoryGroup?.flatMap((cg) => cg.categories || []).length || 0) + (components.length || 0);
    const dishCount = (serverData?.userData?.restaurant?.menu?.[0]?.categoryGroup?.flatMap((cg) => cg.categories?.flatMap((c) => c.dishes || []) || []).length || 0) + components.reduce((acc, c) => acc + (c.section.items?.length || 0), 0);
    setExeedCatLimit(catCount >= Limit.CategoryLimit);
    setExeedDishLimit(dishCount >= Limit.DishLimit);
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
    setSelectedFiles({}); // Clear selected files after adding section
  };

  const submitData = async () => {
    const restaurantID = serverData.userData.restaurant.id;
    const api_key = process.env.NEXT_PUBLIC_API_KEY;
    console.log("API-KEY Abfrage:", api_key);
    console.log(`!Vor dem Verschlüsseln: UserID: ${userID}, Daten: ${components}, RestaurantID: ${restaurantID}, API_KEY: ${api_key}`);
    console.log("Deleted Dishes:", deletedDishes);
    console.log("Deleted Categories:", deletedCategories);

    const { enc_data, encrypted_restaurant_id, encrypted_api_key, encrypted_user_id } = await encrypt_data(userID, components, restaurantID, api_key);

    console.log("!Vor dem Senden (Encrypted API Key):", encrypted_api_key);
    console.log("!Vor dem Senden (Encrypted User ID):", encrypted_user_id);
    console.log("!Encrypted Data vor dem Senden:", enc_data);

    setIsLoading(true);

    try {
      // First, save the data
      const response = await fetch("/api/user/profil/setData", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          encrypted_user_id,
          encrypted_restaurant_id,
          encrypted_data: enc_data,
          encrypted_api_key,
        }),
      });

      // JSON parsen, um die Fehlernachricht zu erhalten
      const resData = await response.json();

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}, Message: ${resData.message || "N/A"}, Error: ${resData.error || "N/A"}`);
      }
      // Then, handle deletions if any
      console.log(`Gerichte löschen ${deletedDishes}, Kategorien löschen: ${deletedCategories}, Gruppen löschen: ${deleteCategoryGroup}`);
      if (deletedDishesRef.current.length > 0 || deletedCategoriesRef.current.length > 0) {
        const deleteData = {
          dishes: deletedDishesRef.current,
          categories: deletedCategoriesRef.current,
        };

        console.log(`Vor dem Verschlüsseln(Delete-Data): userID:${userID}, Data:${deleteData}, RestaurantID:${restaurantID}, API-KEY:${api_key}`);
        const { enc_data: enc_delete_data, encrypted_restaurant_id: enc_rest_id, encrypted_api_key: enc_api_key, encrypted_user_id: enc_user_id } = await encrypt_data(userID, deleteData, restaurantID, api_key);
        console.log(`Nach dem Verschlüsseln: Data: ${enc_delete_data}, RestaurantID: ${enc_rest_id}, User-ID:${enc_user_id}, API-KEY:${enc_api_key}`);
        const deleteResponse = await fetch("/api/user/profil/deleteData", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            encrypted_user_id: enc_user_id,
            encrypted_restaurant_id: enc_rest_id,
            encrypted_data: enc_delete_data,
            encrypted_api_key: enc_api_key,
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

      alert("Data saved and deletions processed successfully!");
      setSelectedFiles({}); // Clear selected files after successful save
    } catch (err) {
      console.error("Failed to save data:", err);
      alert(`Failed to save data: ${err.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const encrypt_data = async (userID, components, restaurantID, api_key) => {
    console.log("components before stringify (function encrypt_data):", components, typeof components);
    console.log("Vor dem Verschlüsseln: (userID)", userID);
    console.log("Vor dem Verschlüsseln: (api_key)", api_key);
    console.log("Vor dem Verschlüsseln: (restaurantID)", restaurantID);
    const data = JSON.stringify(components);
    try {
      const enc_data = CryptoJS.AES.encrypt(data, process.env.NEXT_PUBLIC_ENCRYPTION_KEY).toString();
      const encrypted_restaurant_id = CryptoJS.AES.encrypt(restaurantID, process.env.NEXT_PUBLIC_ENCRYPTION_KEY).toString();
      const encrypted_api_key = CryptoJS.AES.encrypt(api_key, process.env.NEXT_PUBLIC_ENCRYPTION_KEY).toString();
      const encrypted_user_id = CryptoJS.AES.encrypt(userID, process.env.NEXT_PUBLIC_ENCRYPTION_KEY).toString();
      console.log("Daten nach encryption (function encrypt_data):", enc_data, encrypted_api_key, encrypted_restaurant_id);
      return {
        enc_data,
        encrypted_restaurant_id,
        encrypted_api_key,
        encrypted_user_id,
      };
    } catch (error) {
      console.log(error);
      throw error;
    }
  };

  const goBackBtn = () => {
    router.push("../");
  };

  const categoryGroups = menuEntry?.categoryGroup ?? [];
  const allCategories = categoryGroups.flatMap((group) => group.categories ?? []);
  const totalPrice = allCategories.flatMap((cat) => cat.dishes ?? []).reduce((sum, dish) => sum + parseFloat(dish.price || 0), 0);
  // 🛡️ FIX 2: IMMER Array + Fallbacks
  const categoryGroupNames = [...(menuEntry?.categoryGroup?.map((group) => group.name) ?? []), "Mittagessen", "Abendessen", "Frühstück", "Snacks", "Getränke"].filter((name) => name && name.trim()); // Duplikate bleiben (Browser filtert)

  // Kategorien-Namen (korrigiert)
  const categoryNames = categoryGroups.flatMap((group) => (group.categories ?? []).map((cat) => cat.name)).filter((name) => name && name.trim());
  console.log("CategorieNames",categoryNames)

  const MenuEditor = () => (
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
                          <Input list="categoryGroup" minLength={1} autoComplete="off" autoCorrect="off" spellCheck="false" placeholder="z.B. Mittagessen" {...field} className="w-[90%]" />
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
            <div>Gericht-Limit erreicht</div>
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
      if (window.confirm("...")) {
        updateDeletedDishes(dishId);
      }
    };

    const deleteCategory = () => {
      if (window.confirm("...")) {
        updateDeletedCategories(categoryId);
      }
    };

    if (changedItems) {
      console.log("Changes", changedItems);
    }
    const menuEntry = serverData?.menu?.[0];

    const newBG = "bg-red-600"

    return (
      <div className={`rounded-xl shadow-lg max-w-6xl w-full overflow-hidden ${newBG ? newBG : "bg-red-600"}`}>
        <div className={`relative flex items-center justify-center py-6 px-4 border-b ${newBG ? newBG : "bg-blue-400"}`}>
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
              <TableRow className={`hover:bg-gray-100 w-full ${newBG ? newBG : "bg-gray-100"}`}>
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

                {!exeedCatLimit && <MenuEditor categoryGroupNames={categoryGroupNames} />}
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
            <header className="mb-32 text-center w-full sm:grid sm:grid-col1">
              <div className="flex items-center justify-center gap-3">
                {!edditName ? (
                  <>
                    {serverData?.userData?.restaurant?.name && (
                      <>
                        <h1 className="text-5xl absolute  font-serif font-semibold italic tracking-wide">{serverData.userData.restaurant.name}</h1>
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
              <div className="max-w-7xl mx-auto px-4 py-8 space-y-12">
                {serverData?.userData?.restaurant?.menu?.[0]?.categoryGroup?.length ? (
                  serverData.userData.restaurant.menu[0].categoryGroup.map((group) => (
                    <div key={group.id} className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
                      {/* GROUP TITLE */}
                      <h2 className="text-2xl font-semibold mb-6 border-b pb-2">{group.name}</h2>

                      {/* CATEGORIES */}
                      <div className="space-y-8">
                        {group.categories?.map((category) => (
                          <MenuSection key={category.id} title={category.name} menuItems={category.dishes} categoryId={category.id} groupId={group.id} groupName={group.name} />
                        ))}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center text-gray-500 py-10">Keine Daten vorhanden</div>
                )}
              </div>

              <details className="absolute right-1">
                <summary>Debug Data</summary>
                <pre className="mt-8 p-4 bg-gray-100 rounded-lg max-w-7xl overflow-auto text-sm">{JSON.stringify(serverData, null, 2)}</pre>
              </details>
              <p className="mt-6 sm:mt-8 md:mt-10 text-right font-semibold text-lg">Gesamtpreis: {totalPrice.toFixed(2)}€</p>
            </main>
          </div>
          <div className="fixed bottom-6 left-6 z-20">
            <Button onClick={() => submitData()}>Speichern (Server)</Button>
          </div>
        </div>
      </div>
    </div>
  );
}
