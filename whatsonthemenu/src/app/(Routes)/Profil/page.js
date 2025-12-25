"use client";

import React, { useEffect, useState } from "react";
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

import { FaPen, FaTrash } from "react-icons/fa";

import { menuSchema, itemSchema } from "./components/menuSchema";
import { SelectItem } from "./components/selectItem";
import { OptionMenu } from "./components/optionMenu";
import { EdditCategoryMenu } from "./components/edditCategoryWin"

// Feheler kam nachdem ich ein neues Schema hinzugefügt hatte und geht jetzt nicht mehr weg

const schnitzel = require("./img/SchnitzelMitSpätzle.jpg");

export default function PageBuilder() {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();

  const [components, setComponents] = useState([]); // will hold { type: "menuSection", section: { title, items } }
  const [serverData, setServerData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [edditComponents, setEdditComponents] = useState([]);
  const [deletedDishes, setDeletedDishes] = useState([]); // Track deleted dish IDs
  const [deletedCategories, setDeletedCategories] = useState([]); // Track deleted category IDs

  const [bgColor, setBgColor] = useState("");
  const [userID, setUserID] = useState("");
  const [userRole, setUserRole] = useState("");

  // Controlled sheets
  const [openEditor, setOpenEditor] = useState(false);
  const [openOptions, setOpenOptions] = useState(false);
  const [edditName, setEdditName] = useState(false);
  const [nameChangeWin, setNameChangeWin] = useState(false);
  const [autherized, setIsAutherizedUser] = useState(false);

  const { data: session, status } = useSession();

  if (status === "authenticated" && !autherized) {
    console.log("Signed in as:", session.user.id);
    console.log("User Data:", session.user);
    setUserID(session.user.id);

    setIsAutherizedUser(true);
  }

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

  // Checken ob mehrere Standorte/restaurants vorliegen und wenn ja beim öffnen der Seite ein Popup erstellen und dann oben ein Select

  useEffect(() => {
    if (!userID) return;

    const controller = new AbortController();

    const fetchData = async () => {
      try {
        // 1️⃣ Cache laden
        const cached = sessionStorage.getItem(`serverData-${userID}`);
        if (cached) {
          setServerData(JSON.parse(cached));
        } else {
          setIsLoading(true);
        }

        // 2️⃣ Timeout
        const timeout = setTimeout(() => controller.abort(), 5000);

        const response = await fetch("/api/user/profil/getData", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userID }),
          signal: controller.signal,
        });

        clearTimeout(timeout);
        console.log(response);
        // 3️⃣ Auth-Handling
        if (response.status === 401) {
          window.alert("Bitte melden Sie sich an");
          return;
        }

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}`);
        }

        // 4️⃣ Daten
        const freshData = await response.json();
        setServerData(freshData);
        sessionStorage.setItem(`serverData-${userID}`, JSON.stringify(freshData));
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

  const onSubmit = (data) => {
    submitToServer(data);
    setOpenEditor(false);
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
      if (deletedDishes.length > 0 || deletedCategories.length > 0) {
        console.log("Processing deletions...");
        const deleteData = {
          dishes: deletedDishes,
          categories: deletedCategories,
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
      return { enc_data, encrypted_restaurant_id, encrypted_api_key, encrypted_user_id };
    } catch (error) {
      console.log(error);
      throw error;
    }
  };

  const goBackBtn = () => {
    router.push("../");
  };

  // Eine Möglichkeit vorhandene Kategorien (Nachtisch, Vorspeise...) zu sehen und zuzuordnen
  // Kategorien in einem Speraten Fenster erstellen => Menüs dann zuordnen
  // Menüs => Kattegorie(Getränk/Nachisch/Vorspeise) => Menü(Pasta/Kuchen/Alkoholische Getränke/ Getränke) => Essen(Schnitzel, Cola)

  const MenuEditor = () => (
    <Sheet open={openEditor} onOpenChange={setOpenEditor}>
      <SheetTrigger asChild>
        <Button variant="outline">Menü erstellen</Button>
      </SheetTrigger>
      <SheetContent side="right" className="w-full max-w-3xl">
        <SheetHeader>
          <SheetTitle>Menü-Dashboard</SheetTitle>
          <SheetDescription>Hier können Sie ganz einfach ein neues Menü erstellen</SheetDescription>
        </SheetHeader>
        <ScrollArea className="h-[70vh]">
          <div className="p-4">
            <Form {...form}>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={control}
                  name="menu_col"
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
                <h1>Der Neue aber kaputte Code = der useFieldArray stört die Sheets und schließt sie</h1>
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
                            <FormLabel>Gerichtname:</FormLabel>
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
                            <FormLabel>Beschreibung</FormLabel>
                            <FormControl>
                              <Input placeholder="z.B. Mit Sahnesauce" {...field} />
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
                            <FormLabel>Preis</FormLabel>
                            <FormControl>
                              <Input placeholder="z.B. 9.50" type="text" inputMode="decimal" {...field} />
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
                            <FormLabel>Bild</FormLabel>
                            <FormControl>
                              <input




                              // Unfertig





                                type="file"
                                accept="image/*"
                                onChange={async (e) => {
                                  const file = e.target.files?.[0];
                                  if (file) {
                                    try {
                                      const formData = new FormData();
                                      formData.append('file', file);

                                      const response = await fetch('/api/upload', {
                                        method: 'POST',
                                        body: formData,
                                      });

                                      if (response.ok) {
                                        const result = await response.json();
                                        setValue(`items.${index}.image`, result.imageUrl, { shouldValidate: true, shouldDirty: true });
                                      } else {
                                        console.error('Upload failed');
                                        alert('Bild-Upload fehlgeschlagen');
                                      }
                                    } catch (error) {
                                      console.error('Upload error:', error);
                                      alert('Fehler beim Hochladen des Bildes');
                                    }
                                  }
                                }}
                                className="block"
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
          <Button type="button" variant="outline" onClick={() => append({ name: "", price: 0, description: "", image: "" })}>
            Gericht hinzufügen
          </Button>
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
    const [edditCategoryData, setEdditCategoryData] = useState([
      {
        color: "",
        position: "",
        name: "",
        boder: "",
      },
    ]);
    const [itemData, setItemData] = useState({ id: "", name: "", price: 0, description: "" });
    const [changedItems, setChangedItems] = useState([]);
    const [changedCategories, setChangedCategories] = useState([]);
    const toggleExpand = (index) => setExpandedIndex(expandedIndex === index ? null : index);

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
        // Optionally, remove from UI immediately
        // setServerData((prev) => ({
        //   ...prev,
        //   userData: {
        //     ...prev,
        //     restaurant: {
        //       ...prev.userData.restaurant,
        //       menu: prev.userData.restaurant.menu.map((menu) => ({
        //         ...menu,
        //         categories: menu.categories.filter((cat) => cat.id !== categoryId),
        //       })),
        //     },
        //   },
        // }));
      }
    };

    if (changedItems) {
      console.log("Changes", changedItems);
    }
    return (
      <Table className={`bg-white rounded-xl shadow-lg max-w-6xl w-full py-12 p-8 ${deletedCategories.includes(categoryId) ? "border-red-500 border-2" : ""}`}>
        <div className="relative flex items-center justify-center">
          <h3 className={`text-center text-4xl font-semibold mt-3 mb-9 ${deletedCategories.includes(categoryId) ? "text-red-600 line-through" : ""}`}>{title}</h3>
          <Button className="absolute left-0 ml-3" onClick={openCategoryMenu_}>
            <FaPen />
          </Button>
          <Button className="absolute right-0 mr-3" variant="destructive" onClick={deleteCategory}>
            <FaTrash />
          </Button>
        </div>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead></TableHead>
              <TableHead className="text-left">Speisen:</TableHead>
              <TableHead className="text-left">Beschreibung:</TableHead>
              <TableHead className="text-right">Preis:</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {menuItems?.map((item, index) => (
              <React.Fragment key={index}>
                <TableRow className={`${deletedDishes.includes(item.id) ? "bg-red-100 hover:bg-red-200" : "hover:bg-yellow-50"} transition-colors duration-200 cursor-pointer`} onClick={() => toggleExpand(index)}>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button
                        variant="secondary"
                        onClick={(e) => {
                          e.stopPropagation();
                          openMenuItemEddit(item.id, item.name, item.price, item.description);
                        }}
                      >
                        <FaPen />
                      </Button>
                      <Button
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
                  <TableCell className={`font-serif ${deletedDishes.includes(item.id) ? "text-red-600 line-through" : "text-gray-900"}`}>{item.name}</TableCell>
                  <TableCell className={`text-gray-600 ${deletedDishes.includes(item.id) ? "text-red-500 line-through" : ""}`}>{item.description}</TableCell>
                  <TableCell className={`text-right font-mono ${deletedDishes.includes(item.id) ? "text-red-600 line-through" : "text-gray-800"}`}>{item.price}€</TableCell>
                  <TableCell className="hidden">{item.id}</TableCell>
                </TableRow>
                {expandedIndex === index && (
                  <TableRow>
                    <TableCell colSpan={4} className="px-6 py-4">
                      <Image src={schnitzel} alt="" />
                    </TableCell>
                  </TableRow>
                )}
              </React.Fragment>
            ))}
          </TableBody>
        </Table>
        <SelectItem open={openItem} onOpenChange={setOpenItem} selectedItem={selectedItem} setChangedItem={setChangedItems} category={title} restaurantId={serverData?.userData?.restaurant?.id} userID={userID} />
        <EdditCategoryMenu open={openCategoryMenu} onOpenChange={setOpenCategoryMenu} selectedCategory={{name: title, position: 0, color: "", border: ""}} setChangedCategory={setChangedCategories} category={title} restaurantId={serverData?.userData?.restaurant?.id} userID={userID} categoryId={categoryId}/>
      </Table>
    );
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: bgColor }}>
      <div className="p-1">
        <div className="absolute top-5 flex gap-2 items-center">
          <Button onClick={goBackBtn}>Zurück</Button>
          <OptionMenu openOptions={openOptions} setOpenOptions={setOpenOptions} bgColor={bgColor} setBgColor={setBgColor} router={router} userID={userID} />
          <MenuEditor />
        </div>
        <div className="min-h-screen bg-linear-to-r from-yellow-50 via-yellow-100 to-yellow-200 flex flex-col items-center justify-center text-gray-900 font-sans p-8">
          <header className="mb-12 text-center w-full">
            <div className="grid grid-col-1">
              <h1 className="text-5xl font-serif font-semibold italic tracking-wide">{!edditName ? <div>{serverData?.userData?.restaurant?.name ? <div>{serverData.userData.restaurant.name}</div> : null}</div> : <Input type="text" className="text-center" placeholder={serverData?.userData?.restaurant?.name || "Bitte einen Namen für die Überschrift wählen"} />}</h1>
            </div>
            <p className="mt-2 text-gray-600 italic max-w-md mx-auto text-2xl" />
          </header>

          <main className="w-full max-w-9xl bg-opacity-20 rounded-xl shadow-lg p-8 backdrop-blur-md z-10">
            <div className="max-w-7xl mx-auto grid gap-4">{serverData?.userData?.restaurant?.menu?.[0]?.categories?.map((category) => <MenuSection key={category.id} title={category.name} menuItems={category.dishes} categoryId={category.id} />) || <div>Keine Daten vorhanden</div>}</div>

            <p className="mt-4">Gesamtpreis:</p>

            <details className="mt-8">
              <summary>Debug Data</summary>
              <pre className="mt-8 p-4 bg-gray-100 rounded-lg max-w-7xl overflow-auto text-sm">{JSON.stringify(serverData, null, 2)}</pre>
            </details>
          </main>
        </div>
        <div className="fixed bottom-6 left-6 z-20">
          <Button onClick={() => submitData()}>Speichern (Server)</Button>
        </div>
      </div>
    </div>
  );
}
