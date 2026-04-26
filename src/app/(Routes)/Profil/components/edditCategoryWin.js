import React, { useEffect, useState, useRef } from "react";
import { useForm } from "react-hook-form";
import CryptoJS from "crypto-js";

import { Input } from "@/components/ui/input";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";

import { colors } from "./colorPalet";

import { AddNewItems } from "./addNewItem";

//import { menuSchema, itemSchema } from "./menuSchema";

const EdditCategoryMenu = ({ open, onOpenChange, selectedCategory, setChangedCategory, userID, category, restaurantId, position }) => {
  const [edditName, setEdditName] = useState("");
  const [edditPos, setEdditPos] = useState(0);
  const [edditColor, setEdditColor] = useState("");
  const [edditBorder, setEdditBorder] = useState("");
  const [ID, setID] = useState("")
  const [addItem, setAddItem] = useState([
    {
      name: "",
      price: 0,
      img: null,
    },
  ]);
  const [restaurantID_, setRestaurantID_] = useState("");
  const [userID_, setUserID_] = useState("");

  const formRef = useRef();

  const form = useForm({
    defaultValues: {
      name: edditName,
      position: edditPos,
      color: edditColor,
      border: edditBorder,
      addItem: addItem,
    },
  });

  useEffect(() => {
    formRef.current = form;
  }, [form]);

  useEffect(() => {
    setUserID_(userID);
    setRestaurantID_(restaurantId);
  }, [userID, restaurantId]);

  useEffect(() => {
    if (selectedCategory && formRef.current) {
      setEdditName(selectedCategory.name || "");
      setEdditPos(selectedCategory.position || 0);
      setEdditColor(selectedCategory.color || "");
      setEdditBorder(selectedCategory.border || "");
      setID(selectedCategory.id)
      formRef.current.setValue("name", selectedCategory.name || "");
      formRef.current.setValue("position", selectedCategory.position || 0);
      formRef.current.setValue("color", selectedCategory.color || "");
      formRef.current.setValue("border", selectedCategory.border || "");
    }
  }, [selectedCategory]);

  const { handleSubmit, setValue } = form;

  const onSubmit = async (data) => {
    const api_key = process.env.NEXT_PUBLIC_API_KEY;
    console.log("Überprüfe Kattegorie ID vor dem senden:", category.id)
    const categoryData = [
      {
        type: "categoryUpdate",
        category: {
          id: selectedCategory.id || category.id,
          name: data.name,
          position: data.position,
          color: data.color,
          border: data.border,
        },
      },
    ];

    const { enc_data, encrypted_restaurant_id, encrypted_api_key, encrypted_user_id } = await encrypt_data(userID_, categoryData, restaurantID_, api_key);

    try {
      const response = await fetch("/api/user/profil/edditData", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          encrypted_user_id,
          encrypted_restaurant_id,
          encrypted_data: enc_data,
          encrypted_api_key,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      console.log("Category updated:", result);
      // Update parent state
      setChangedCategory((prev) => [...prev, categoryData]);

      onOpenChange(false);
    } catch (error) {
      console.error("Failed to update category:", error);
      alert(`Failed to update category: ${error.message}`);
    }
  };

  const encrypt_data = async (userID, components, restaurantID, api_key) => {
    const data = JSON.stringify(components);
    const enc_data = CryptoJS.AES.encrypt(data, process.env.NEXT_PUBLIC_ENCRYPTION_KEY).toString();
    const encrypted_restaurant_id = CryptoJS.AES.encrypt(restaurantID, process.env.NEXT_PUBLIC_ENCRYPTION_KEY).toString();
    const encrypted_api_key = CryptoJS.AES.encrypt(api_key, process.env.NEXT_PUBLIC_ENCRYPTION_KEY).toString();
    const encrypted_user_id = CryptoJS.AES.encrypt(userID, process.env.NEXT_PUBLIC_ENCRYPTION_KEY).toString();
    return { enc_data, encrypted_restaurant_id, encrypted_api_key, encrypted_user_id };
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Kategorie bearbeiten</DialogTitle>
          <DialogDescription>Kategoriedaten/Aussehen bearbeiten</DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name:</FormLabel>
                  <FormControl>
                    <Input type="text" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="position"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Position:</FormLabel>
                  <FormControl>
                    <Input type="number" {...field} />
                  </FormControl>
                  <ScrollArea className="h-[100px] w-full rounded-md border p-2">
                    {Array.isArray(position) && position.map((num, index) => (
                      <div key={index}>{num}</div>
                    ))}
                  </ScrollArea>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="color"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Hintergrund für Kategorie auswählen</FormLabel>
                  <div className="grid grid-cols-[auto_1fr_auto] items-center gap-3">
                    <input type="color" value={field.value} onChange={field.onChange} className="h-10 w-12 cursor-pointer rounded-md border" />
                    <select value={field.value} onChange={(e) => field.onChange(e.target.value)} className="h-10 rounded-md border px-3 text-sm">
                      {colors.map((color) => (
                        <option key={color.value} value={color.value}>
                          {color.label}
                        </option>
                      ))}
                    </select>

                    <div className="h-10 w-10 rounded-md border" style={{ backgroundColor: field.value }} />
                  </div>
                  <p className="mt-1 font-mono text-xs text-muted-foreground">{field.value}</p>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="border"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Ramen:</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="img"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Bild</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="item"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Gerichte hinzufügen</FormLabel>
                  <FormControl>
                    <AddNewItems />
                  </FormControl>
                </FormItem>
              )}
            />
            <div className="flex justify-between pt-4">
              <Button type="submit">Speichern</Button>
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Abbrechen
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export { EdditCategoryMenu };
