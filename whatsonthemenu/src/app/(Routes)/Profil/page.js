"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Image from "next/image";
import { useRouter, usePathname, useSearchParams } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Table, TableBody, TableHead, TableRow, TableCell, TableHeader } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Label } from "@/components/ui/label";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetFooter, SheetTrigger } from "@/components/ui/sheet";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";

import { FaPen } from "react-icons/fa";

import { menuSchema, itemSchema } from "./components/menuSchema";
import { SelectItem } from "./components/selectItem"

// Feheler kam nachdem ich ein neues Schema hinzugefügt hatte und geht jetzt nicht mehr weg

const schnitzel = require("./img/SchnitzelMitSpätzle.jpg");

export default function PageBuilder() {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();

  const [components, setComponents] = useState([]); // will hold { type: "menuSection", section: { title, items } }
  const [serverData, setServerData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const [bgColor, setBgColor] = useState("");
  const [userID, setUserID] = useState("");
  const [userRole, setUserRole] = useState("");

  // Controlled sheets
  const [openEditor, setOpenEditor] = useState(false);
  const [openOptions, setOpenOptions] = useState(false);
  const [edditName, setEdditName] = useState(false);
  const [nameChangeWin, setNameChangeWin] = useState(false);

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
    const userID_ = sessionStorage.getItem("userID");
    const role = sessionStorage.getItem("role");

    if (!userID_) {
      alert("Keine berechtigte Benutzer-ID vorhanden! Bitte melden Sie sich im Hauptmenü an.");
      return;
    }

    if (role === "Admin" || role === "Owner") {
      setUserID(userID_);
      setUserRole(role);
    }
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      if (!userID || !(userRole === "Admin" || userRole === "Owner")) throw new Error("Not Authorized! \n Bitte melden sie sich an");

      setIsLoading(true);
      try {
        const cachedData = sessionStorage.getItem("serverData");
        if (cachedData) setServerData(JSON.parse(cachedData));

        const response = await fetch("/api/user/profil/getData", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userID }),
        }, 500);

        if (!response.ok) throw new Error(`HTTP ${response.status}`);

        const freshData = await response.json();
        setServerData(freshData);
        sessionStorage.setItem("serverData", JSON.stringify(freshData));
      } catch (error) {
        console.error("Fetch failed:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [userID, userRole]);

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
    console.log(`Submited data for ${userID}:`, components)
    setIsLoading(true);
    try {
      const response = await fetch("/api/user/profil/setData", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userID: userID,
          data: components,
        }),
      }, 500);

      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

      alert("Data saved successfully!");
    } catch (err) {
      console.error("Failed to save data:", err);
      alert("Failed to save data");
    } finally {
      setIsLoading(false);
    }
  };

  const goBackBtn = () => {
    router.push("../");
  };

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
                              <Input placeholder="z.B. 9.50" type="number" inputMode="decimal" step="0.01" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      {/* File input: do NOT spread field onto file input */}
                      <FormField
                        control={control}
                        name={`items.${index}.image`}
                        render={() => (
                          <FormItem>
                            <FormLabel>Bild</FormLabel>
                            <FormControl>
                              <input
                                type="file"
                                accept="image/*"
                                onChange={(e) => {
                                  const file = e.target.files?.[0];
                                  if (file) {
                                    const reader = new FileReader();
                                    reader.onloadend = () => {
                                      // set the data URL into form value
                                      setValue(`items.${index}.image`, reader.result, { shouldValidate: true, shouldDirty: true });
                                    };
                                    reader.readAsDataURL(file);
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
  const OptionMenu = () => (
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
          <div>{/* Additional options can be added here */}</div>

          <Button asChild>
            <Link href={{ pathname: "/Profil/QRBuilder/", query: { ...router.query, ...(userID ? { userID: userID } : {}) } }}>QR-Code erstellen</Link>
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );

  /* ---------- Menu Section Presentation ---------- */

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: bgColor }}>
      <div className="p-1">
        <div className="absolute top-5 flex gap-2 items-center">
          <Button onClick={goBackBtn}>Zurück</Button>
          <OptionMenu />
          <MenuEditor />
        </div>
        <div className="min-h-screen bg-gradient-to-r from-yellow-50 via-yellow-100 to-yellow-200 flex flex-col items-center justify-center text-gray-900 font-sans p-8">
          <header className="mb-12 text-center w-full">
            <div className="grid grid-col-1">
              <h1 className="text-5xl font-serif font-semibold italic tracking-wide">{!edditName ? <div>{serverData?.userData?.restaurant?.name ? <div>{serverData.userData.restaurant.name}</div> : null}</div> : <Input type="text" className="text-center" placeholder={serverData?.userData?.restaurant?.name || "Bitte einen Namen für die Überschrift wählen"} />}</h1>
            </div>
            <p className="mt-2 text-gray-600 italic max-w-md mx-auto text-2xl" />
          </header>

          <main className="w-full max-w-9xl bg-opacity-20 rounded-xl shadow-lg p-8 backdrop-blur-md z-10">
            <div className="max-w-7xl mx-auto grid gap-4">{serverData?.userData?.restaurant?.menu?.categories?.map((category) => <MenuSection key={category.id} title={category.name} menuItems={category.dishes} />) || <div>Keine Daten vorhanden</div>}</div>

            <p className="mt-4">Gesamtpreis:</p>

            <details className="mt-8">
              <summary>Debug Data</summary>
              <pre className="mt-8 p-4 bg-gray-100 rounded-lg max-w-7xl overflow-auto text-sm">{JSON.stringify(serverData, null, 2)}</pre>
            </details>
          </main>
        </div>
        <div className="fixed bottom-6 left-6">
          <Button onClick={() => submitData()}>Speichern (Server)</Button>
        </div>
      </div>
    </div>
  );
}

const MenuSection = ({ title, menuItems }) => {
  const [expandedIndex, setExpandedIndex] = useState(null);
  const [openItem, setOpenItem] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [itemData, setItemData] = useState({ id: "", name: "", price: 0, description: "" });
  const [changedItems, setChangedItems] = useState([]);
  const toggleExpand = (index) => setExpandedIndex(expandedIndex === index ? null : index);

  const openMenuItemEddit = (id, name, price, description) => {
    var newEddit = {
      id: id,
      name: name,
      price: price,
      description: description,
    }
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

  if (changedItems) {
    console.log("Changes", changedItems);
  }
  return (
    <Table className="bg-white rounded-xl shadow-lg max-w-6xl w-full py-12 p-8">
      <div className="mb-3">
        <h3 className="text-center text-4xl font-semibold">{title}</h3>
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
              <TableRow className="hover:bg-yellow-50 transition-colors duration-200 cursor-pointer" onClick={() => toggleExpand(index)}>
                {changedItems }


                
                <TableCell>
                  <Button variant="secondary" onClick={() => openMenuItemEddit(item.id, item.name, item.price, item.description)}><FaPen /></Button>
                </TableCell>
                <TableCell className="font-serif text-gray-900">{item.name}</TableCell>
                <TableCell className="text-gray-600">{item.description}</TableCell>
                <TableCell className="text-right font-mono text-gray-800">{item.price}€</TableCell>
                <TableCell className="hidden">{item.id}</TableCell>
              </TableRow>
              {expandedIndex === index && (
                <TableRow>
                  <TableCell colSpan={3} className="px-6 py-4">
                    <Image src={schnitzel} alt="" />
                  </TableCell>
                </TableRow>
              )}
            </React.Fragment>
          ))}
        </TableBody>
      </Table>
      <SelectItem open={openItem} onOpenChange={setOpenItem} selectedItem={selectedItem} setChangedItem={setChangedItems} />
    </Table>
  );
};

