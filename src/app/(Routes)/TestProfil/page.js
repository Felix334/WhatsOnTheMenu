"use client";

import { useEffect, useState } from "react";
import React from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import Image from "next/image";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Table, TableBody, TableHead, TableRow, TableCell, TableHeader } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Label } from "@/components/ui/label";
import { Card, CardAction, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { ScrollArea, ScrollAreaViewport, ScrollAreaScrollbar, ScrollAreaThumb } from "@/components/ui/scroll-area";

import { ChevronRightIcon } from "lucide-react";

//import MenuSection from "./components/menusection";
import menuSchema from "./components/menuSchema";

export default function PageBuilder() {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();

  const [components, setComponents] = useState([]);
  const [serverData, setServerData] = useState(null);
  const [updatedData, setUpdatedData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const [bgColor, setBgColor] = useState("");

  const [userID, setUserID] = useState("");
  const [userRole, setUserRole] = useState("");

  const [expandMenu, setExpandMenu] = useState(false);
  const [openEditWin, setOpenEditWin] = useState(false);

  const [newChange, setNewChange] = useState(false);

  const updateData = () => {};

  const form = useForm({
    resolver: zodResolver(menuSchema),
    defaultValues: {
      menu_col: "",
      menu_name: "",
      items: [{ name: "", price: 0, description: "", image: "" }],
    },
  });

  const { fields, append, remove } = useFieldArray({ control: form.control, name: "items" });

  useEffect(() => {
    const userID_ = sessionStorage.getItem("userID");
    const role = sessionStorage.getItem("role");

    if (!userID_) {
      alert("Keine berechtigte Benutzer-ID vorhanden! Bitte melden Sie sich im Hauptmenü an.");
      return;
    }

    // Fix the role check - remove extra space
    if (role === "Admin" || role === "Owner") {
      setUserID(userID_);
      setUserRole(role);
    }
  }, []); // Empty dependency array is correct here

  //const toggleOpenEditWin = () => setOpenEditWin((prev) => !prev);
  // Replace your toggle function with this:
  const toggleOpenEditWin = (newOpenState) => {
    setOpenEditWin(newOpenState);
  };

  const toggleMenu = () => setExpandMenu((prev) => !prev);
  const handleBgChange = (e) => setBgColor(e.target.value);

  const submitToServer = (data) => {
    const newSection = {
      title: data.menu_name,
      items: data.items,
    };
    setComponents((prev) => [...prev, { name: "menuSection", content: newSection }]);
  };

  const onSubmit = (data, event) => {
    event.preventDefault();
    submitToServer(data);
    form.reset();
    toggleOpenEditWin();
  };

  useEffect(() => {
    const fetchData = async () => {
      if (!userID || !(userRole === "Admin" || userRole === "Owner")) return;

      setIsLoading(true);
      try {
        const cachedData = sessionStorage.getItem("serverData");
        if (cachedData) setServerData(JSON.parse(cachedData));

        const response = await fetch("./api/user/profil/getData", {
          // User-Daten werden Doppelt gesendet =>  Einmal User und einmal Restaurant
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userID }),
        });

        if (!response.ok) throw new Error(`HTTP ${response.status}`);

        const freshData = await response.json();
        if (freshData) {
          console.log(freshData);
        }
        setServerData(freshData);
        sessionStorage.setItem("serverData", JSON.stringify(freshData));
      } catch (error) {
        console.error("Fetch failed:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [userID, userRole]); // Only re-run when these change

  const submitData = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("./api/user/profil/setData", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userID: userID,
          data: updatedData, // Make sure this contains your updated data
        }),
      });

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

  const RenderEditor = () => (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline">Menü erstellen </Button>
      </SheetTrigger>
      <SheetContent side="right">
        <SheetHeader>
          <SheetTitle>Menü-Dashboard</SheetTitle>
          <SheetDescription>Hier können sie ganz einfach ein neues Menü erstellen</SheetDescription>
        </SheetHeader>
        <ScrollArea className="h-[89%] w-full rounded-md border pt-2">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
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
              <FormField
                control={form.control}
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
                      control={form.control}
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
                      control={form.control}
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
                      control={form.control}
                      name={`items.${index}.price`}
                      inputMode="decimal"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Preis</FormLabel>
                          <FormControl>
                            <Input placeholder="z.B. 9.50" type="number" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name={`items.${index}.image`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Bild</FormLabel>
                          <FormControl>
                            <Input
                              type="file"
                              accept="image/*"
                              onChange={(e) => {
                                const file = e.target.files?.[0];
                                if (file) {
                                  const reader = new FileReader();
                                  reader.onloadend = () => {
                                    form.setValue(`items.${index}.image`, reader.result);
                                  };
                                  reader.readAsDataURL(file);
                                }
                              }}
                              {...field}
                            />
                          </FormControl>
                          {form.watch(`items.${index}.image`) && <Image src={form.watch(`items.${index}.image`)} alt="Vorschau" width={200} height={150} className="mt-2 rounded-lg border" />}
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
              <div onClick={(e) => e.stopPropagation()}>
                <Button
                  type="button"
                  variant="outline"
                  onClick={(e) => {
                    e.preventDefault(); // Ensures no default behavior
                    addDish();
                  }}
                >
                  Gericht hinzufügen
                </Button>
              </div>
              <div className="flex justify-between pt-4">
                <Button type="submit">Speichern</Button>
                <Button type="button" variant="outline" onClick={toggleOpenEditWin}>
                  Abbrechen
                </Button>
              </div>
            </form>
          </Form>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );

  const addDish = (e) => {
    e.preventDefault(); // Ensures no default behavior
    append({ name: "", price: "", description: "" });
  };
  
  const OptionMenu = () => (
    <Sheet className="absolute min-h-screen w-screen bg-black/30 backdrop-blur-md text-black z-10">
      <SheetTrigger asChild>
        <Button variant="outline">|||</Button>
      </SheetTrigger>
      <SheetContent side="left" style={{ width: "800px" }}>
        <SheetHeader>
          <SheetTitle>Dashboard</SheetTitle>
          <SheetDescription>Hier können Sie Ihre Seite individuell gestalten</SheetDescription>
        </SheetHeader>
        <Input name="Hintergrund" type="color" onChange={handleBgChange} />

        <RenderEditor />
      </SheetContent>
    </Sheet>
  );

  const MenuSection = ({ title, menuItems }) => {
    const [expandedIndex, setExpandedIndex] = useState(null);
    const toggleExpand = (index) => {
      setExpandedIndex(expandedIndex === index ? null : index);
    };

    return (
      <div className="bg-white rounded-xl shadow-lg max-w-6xl w-full py-12 p-8">
        <div className="mb-3">
          <h3 className="text-center text-4xl font-semibold">{title}</h3>
        </div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="text-left">Speisen:</TableHead>
              <TableHead className="text-left">Beschreibung:</TableHead>
              <TableHead className="text-right">Preis:</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {menuItems?.map((item, index) => (
              <React.Fragment key={index}>
                <TableRow className="hover:bg-yellow-50 transition-colors duration-200 cursor-pointer" onClick={() => toggleExpand(index)}>
                  <TableCell className="font-serif text-gray-900">{item.name}</TableCell>
                  <TableCell className="text-gray-600">{item.description}</TableCell>
                  <TableCell className="text-right font-mono text-gray-800">{item.price}€</TableCell>
                </TableRow>
                {expandedIndex === index && (
                  <TableRow>
                    <TableCell colSpan="3" className="px-6 py-4"></TableCell>
                  </TableRow>
                )}
              </React.Fragment>
            ))}
          </TableBody>
        </Table>
      </div>
    );
  };

  const Kategorie = ({ menuItems, name }) => {
    return <MenuSection title={name} menuItems={menuItems} />;
  };

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
        <div className="absolute top-5">
          <Button onClick={goBackBtn}>Zurrück</Button>
          <OptionMenu />
        </div>
        <Form onChange={updateData}>
          {expandMenu && <OptionMenu />}
          <div className="mt-0 space-y-6">
            {components.map((component, index) => (
              <div key={index}>{component.name === "menuSection" ? <MenuSection title={component.title} menuItems={component.content} /> : <h4 className="text-lg">{component.name}</h4>}</div>
            ))}
          </div>
          <div className="min-h-screen bg-linear-to-r from-yellow-50 via-yellow-100 to-yellow-200 flex flex-col items-center justify-center text-gray-900 font-sans p-8">
            <header className="mb-12 text-center w-full">
              <h1 className="text-5xl font-serif font-semibold italic tracking-wide">
                <input type="text" placeholder={serverData?.userData?.restaurant?.name || "Bitte einen Namen für die Überschrift wählen"} />
              </h1>
              <p className="mt-2 text-gray-600 italic max-w-md mx-auto text-2xl">{/*description*/}</p>
            </header>
            <main className="w-full max-w-9xl bg-opacity-20 rounded-xl shadow-lg p-8 backdrop-blur-md z-10">
              <div className="max-w-7xl mx-auto grid gap-4">{serverData?.userData?.restaurant?.menu?.categories?.map((category) => <Kategorie key={category.id} menuItems={category.dishes} name={category.name} />) || <div>Keine Daten vorhanden</div>}</div>
              <p className="mt-4">Gesamtpreis:</p>
              {/* Display raw JSON data for testing */}
              <details className="mt-8">
                <summary>Debug Data</summary>
                <pre className="mt-8 p-4 bg-gray-100 rounded-lg max-w-7xl overflow-auto text-sm">{JSON.stringify(serverData, null, 2)}</pre>
              </details>
            </main>
          </div>
          {newChange && (
            <div>
              <Button onClick={() => alert("Nicht fertig")}>Speichern</Button>
            </div>
          )}
        </Form>
      </div>
    </div>
  );
}
