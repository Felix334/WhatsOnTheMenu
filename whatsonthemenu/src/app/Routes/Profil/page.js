"use client";

import { useEffect, useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import Image from "next/image";
import { useRouter, usePathname, useSearchParams } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Table, TableBody, TableHead, TableRow, TableCell, TableHeader } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Label } from "@/components/ui/label";
import { title } from "process";
import Link from "next/link";

import MenuSection from "./components/menusection"
import menuSchema from "./components/menuSchema"

export default function PageBuilder() {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter()
  const [components, setComponents] = useState([]);
  const [openEditWin, setOpenEditWin] = useState(false);
  const [bgColor, setBgColor] = useState("");
  const [userID, setUserID] = useState("");
  const [menu, setMenu] = useState([
    {
      // Muss die selbe Struktur haben
      title: "",
      bgCol: "",
      position: 0,
      items: [
        {
          name: "",
          price: "",
          description: "",
          image: "",
        },
      ],
    },
  ]);

  useEffect(() => {
    const { query } = router
    console.log((query))
    const userID_ = window.localStorage.getItem("userID");
    const role = window.sessionStorage.getItem("role");
    if (!userID_) {
      console.log("Keine ID vorhanden");
      window.alert("Keine berechtigte Benutzer-ID vorhanden! \nBitte melden sie sich im Hauptmenu an!");
      return;
    }
    if ((userID_ && role === "Admin") || (userID_ && role === "User")) {
      setUserID(userID_);
      render_user(userID_);
    }
  }, [userID]);

  const checkUser = async (userID) => {
    var userID = userID;
    var response = fetch("./api/user/profile/getData", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ id: userID }),
    }).then((response) => response.json()); // => selbe Struktur wie die useState
    if (response) {
      console.log(response);
      //setMenu(response)
      return true;
    }
    return null;
  };

  const form = useForm({
    resolver: zodResolver(menuSchema),
    defaultValues: {
      menu_col: "",
      menu_name: "",
      items: [{ name: "", price: "", description: "", image: "" }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "items",
  });

  const toggleOpenEditWin = () => {
    setOpenEditWin((prev) => !prev);
  };

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

  const handleBgChange = (event) => {
    setBgColor(event.target.value);
  };

  const edditWin = () => {
    // Kategorien werden sortiert
    return (
      <div className="absolute min-h-screen w-screen bg-black/30 backdrop-blur-md text-black z-20">
        <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md mt-10 relative z-30">
          <h1 className="text-2xl font-bold mb-6 text-center">Neues Menü erstellen</h1>
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
                    <FormLabel>Menüname:</FormLabel>
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
                  <div key={item.id} className="p-4 border rounded-xl space-y-2 bg-gray-50 relative">
                    <FormField
                      control={form.control}
                      name={`items.${index}.name`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Gerichtname</FormLabel>
                          <FormControl>
                            <Input placeholder="z.B. Spaghetti Carbonara" {...field} />
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
                                    form.setValue(`items.${index}.image`, reader.result); // base64 speichern
                                  };
                                  reader.readAsDataURL(file);
                                }
                              }}
                            />
                          </FormControl>
                          {form.watch(`items.${index}.image`) && <Image src={form.watch(`items.${index}.image`)} alt="Vorschau" className="mt-2 w-full h-auto rounded-lg border" />}
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <Button type="button" variant="ghost" className="absolute top-2 right-2 text-sm text-red-500" onClick={() => remove(index)}>
                      Entfernen
                    </Button>
                  </div>
                ))}

                <Button type="button" variant="outline" onClick={() => append({ name: "", price: "", description: "" })}>
                  + Gericht hinzufügen
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
        </div>
      </div>
    );
  };
  
  useEffect(() => {
    const { query } = router;
    const params = new URLSearchParams(searchParams.toString());
    const id = params.get('userID');
    if (id) {
      setUserID(id)
    }
    console.log("Route querry (Profil)",query)
  }, []);

  const warning = () => {
    window.alert("Wichtig!Helligkeit (rechter Balken) muss eingestellt werden");
  };



// checken ob die "goBackBtnFunktion" nötig ist 

  const goBackBtn = () => {
    const backURL = "./"
    const pathname = router.pathname;
    const newQuery = {... router.query, id: userID};
    router.replace({
      pathname: pathname,
      querry: newQuery
      });
    router.push("../")
    router.back()
  }

  const load = async (userID) => {
    var data = await checkUser(userID).then(() => {
      if (data == null) {
        return null;
      }
      return data;
    });
  };
  const render_user = async (userID) => {
    var result = await load(userID);
    if (result == null) {
      return null;
    }
  };
  if (!userID) {
    return <div>Bitte Anmelden</div>;
  }
  return (
    <div className="min-h-screen" style={{ backgroundColor: bgColor }}>
      <div className="p-4">
        <div>
          <div>
            <Button onClick={goBackBtn}>Zurück</Button>
          </div>
        </div>
        <Label htmlFor="bgColInp">Hintergrund-Farbe</Label>
        <Input name="Hintergrund" type="color" id="bgColInp" onClick={() => warning()} onChange={handleBgChange} width={90} />
        <Button onClick={toggleOpenEditWin}>Menü hinzufügen</Button>
        {openEditWin && edditWin()}

        <div className="mt-6 space-y-6">
          {components.map((component, index) => (
            <div key={index}>{component.name === "menuSection" ? <MenuSection section={component.content} toggleOpenEditWin={openWin(index)} /> : <h4 className="text-lg">{component.name}</h4>}</div>
          ))}
        </div>
      </div>
    </div>
  );
}

// toggleOpenEditWin vervollständigen => Berreits erstelltes Mnü bearbeitbar machen
