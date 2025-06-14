"use client";

import { useEffect, useState } from "react";
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

import MenuSection from "./components/menusection";
import menuSchema from "./components/menuSchema";

export default function PageBuilder() {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();

  const [components, setComponents] = useState([]);
  const [openEditWin, setOpenEditWin] = useState(false);
  const [bgColor, setBgColor] = useState("");
  const [userID, setUserID] = useState("");
  const [expandMenu, setExpandMenu] = useState(false);
  const [userRole, setUserRole] = useState("");

  useEffect(() => {
    const userID_ = sessionStorage.getItem("userID");
    const role = sessionStorage.getItem("role");
    if (!userID_) {
      alert("Keine berechtigte Benutzer-ID vorhanden! Bitte melden Sie sich im Hauptmenü an.");
      return;
    }
    if (userID_ && (role === "Admin" || role === "User")) {
      setUserID(userID_);
      setUserRole(role);
    }
  }, []);

  const form = useForm({
    resolver: zodResolver(menuSchema),
    defaultValues: {
      menu_col: "",
      menu_name: "",
      items: [{ name: "", price: "", description: "", image: "" }],
    },
  });

  const { fields, append, remove } = useFieldArray({ control: form.control, name: "items" });

  //const toggleOpenEditWin = () => setOpenEditWin((prev) => !prev);
  const toggleOpenEditWin = (e) => {
    e.preventDefault()
    if(!openEditWin){setOpenEditWin(true)}else{setOpenEditWin(false)}
  }
  const toggleMenu = () => setExpandMenu((prev) => !prev);
  const handleBgChange = (e) => setBgColor(e.target.value);

  const submitToServer = (data) => {
    const newSection = {
      title: data.menu_name,
      items: data.items,
    };
    setComponents((prev) => [...prev, { name: "menuSection", content: newSection }]);
  };

  const onSubmit = (data) => {
    submitToServer(data);
    form.reset();
    toggleOpenEditWin();
  };

  const goBackBtn = () => {
    router.push("../");
  };

  const OptionMenu = () => (
    <div className="absolute min-h-screen w-screen bg-black/30 backdrop-blur-md text-black z-10">
      <Sheet open={expandMenu} onOpenChange={setExpandMenu}>
        <SheetTrigger asChild>
          <Button variant="outline">|||</Button>
        </SheetTrigger>
        <SheetContent side="left" style={{ width: "800px" }}>
          <SheetHeader>
            <SheetTitle>Dashboard</SheetTitle>
            <SheetDescription>Hier können Sie Ihre Seite individuell gestalten</SheetDescription>
          </SheetHeader>
          <Input name="Hintergrund" type="color" onChange={handleBgChange} />
          <Button onClick={toggleOpenEditWin}>Menü erstellen</Button>
          {openEditWin && renderEditor()}
        </SheetContent>
      </Sheet>
    </div>
  );

  const renderEditor = () => (
    <div className="">
          <Sheet open={openEditWin} onOpenChange={setOpenEditWin}>
            <SheetContent side="right">
              <SheetHeader>
                <SheetTitle>Menü-Dashboard</SheetTitle>
                <SheetDescription>Hier können sie ganz einfach ein neues Menü erstellen</SheetDescription>
              </SheetHeader>
              <ScrollArea className="h-[89%] w-[100%] rounded-md border pt-2">
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
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Preis</FormLabel>
                              <FormControl>
                                <Input placeholder="z.B. 9.50 €" {...field} />
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
                  <Button type="button" variant="outline" onClick={() => append({ name: "", price: "", description: "" })}>
                    + Gericht hinzufügen
                  </Button>
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
    </div>
  );

  return (
    <div className="min-h-screen" style={{ backgroundColor: bgColor }}>
      <div className="p-4">
        <Button onClick={goBackBtn}>Zurück</Button>
        <Button onClick={toggleMenu} className="ml-4">
          |||
        </Button>
        {expandMenu && <OptionMenu />}
        <div className="mt-6 space-y-6">
            {components.map((component, index) => (
              <div key={index}>{component.name === "menuSection" ? <MenuSection section={component.content} /> : <h4 className="text-lg">{component.name}</h4>}</div>
            ))}
          </div>
      </div>
    </div>
  );
}
