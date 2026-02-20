import React, { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form"; // Removed unused useFieldArray
import { zodResolver } from "@hookform/resolvers/zod";

import { Input } from "@/components/ui/input";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

import { FaCreativeCommonsNcJp, FaPen } from "react-icons/fa";
import { FaCircleInfo } from "react-icons/fa6";

import CryptoJS from "crypto-js"; // Add this import for encryption

import { menuSchema, itemSchema } from "./menuSchema";

const SelectItem = ({ open, onOpenChange, selectedItem, setChangedItem, userID, category, restaurantId }) => {
  // Add userID as prop (from parent/auth)
  // State to toggle edit mode for fields (default false)
  const [editName, setEditName] = useState(false);
  const [editDescription, setEditDescription] = useState(false);
  const [editPrice, setEditPrice] = useState(false);
  const [editImage, setEditImage] = useState(false); // Fixed typo

  // Initialize as object (not string) - sync with selectedItem
  const [updatedItem, setUpdatedItem] = useState({});

  const form = useForm({
    resolver: zodResolver(itemSchema),
    defaultValues: {
      name: selectedItem?.name || "",
      description: selectedItem?.description || "",
      price: selectedItem?.price || 0,
      Bild: "", // Assume string URL for now (not File); see notes below
    },
  });
  const { control, handleSubmit, reset, watch } = form; // watch for real-time form values

  useEffect(() => {
    if (selectedItem) {
      reset({
        name: selectedItem.name || "",
        description: selectedItem.description || "",
        price: selectedItem.price !== null && selectedItem.price !== undefined ? Number(selectedItem.price).toFixed(2) : "0.00",

        Bild: selectedItem.img || "", // Assume img is URL
      });
      setUpdatedItem(selectedItem); // Sync initial state
    }
    // Reset edit modes on item change
    setEditName(false);
    setEditDescription(false);
    setEditPrice(false);
    setEditImage(false);
  }, [selectedItem, reset]);

  // Encryption function (fixed: stringify object, add IV, call properly)
  const encryptObject = useCallback((userID, itemToEncrypt, encryptionKey) => {
    if (!encryptionKey) throw new Error("Encryption key missing");

    const iv = CryptoJS.lib.WordArray.random(16);
    const ivBase64 = iv.toString(CryptoJS.enc.Base64);

    // Encrypt userID (assume string)
    const enc_userID = CryptoJS.AES.encrypt(userID, CryptoJS.enc.Utf8.parse(encryptionKey), { iv, mode: CryptoJS.mode.CBC, padding: CryptoJS.pad.Pkcs7 });

    // Encrypt item as JSON string (key fix: stringify the object)
    const jsonString = JSON.stringify(itemToEncrypt);
    const enc_data = CryptoJS.AES.encrypt(jsonString, CryptoJS.enc.Utf8.parse(encryptionKey), { iv, mode: CryptoJS.mode.CBC, padding: CryptoJS.pad.Pkcs7 });

    // Encrypt API key (insecure client-side; avoid if possible)
    const apiKey = process.env.NEXT_PUBLIC_API_KEY || "";
    const enc_api_key = CryptoJS.AES.encrypt(apiKey, CryptoJS.enc.Utf8.parse(encryptionKey), { iv, mode: CryptoJS.mode.CBC, padding: CryptoJS.pad.Pkcs7 });

    return {
      userID: `${ivBase64}:${enc_userID.ciphertext.toString(CryptoJS.enc.Base64)}`,
      data: `${ivBase64}:${enc_data.ciphertext.toString(CryptoJS.enc.Base64)}`,
      key: `${ivBase64}:${enc_api_key.ciphertext.toString(CryptoJS.enc.Base64)}`,
    };
  }, []);

  const onSubmit = useCallback(
    async (data) => {
      if (!data || !selectedItem) {
        window.alert("Keine Veränderung oder kein Item ausgewählt");
        return;
      }

      console.log("Data-Ausgabe:", data);

      // Build final updated item directly from form data + selectedItem (avoids state staleness)
      const finalUpdatedItem = {
        id: selectedItem.id,
        name: data.name || selectedItem.name,
        price: data.price != null ? data.price : selectedItem.price,
        description: data.description || selectedItem.description,
        image: data.Bild || selectedItem.img, // For files: Upload first, set to URL (see notes)
      };

      // TODO: If Bild is a File, upload it separately before encryption
      // Example: if (data.Bild && data.Bild instanceof File) {
      //   const uploadResp = await fetch('/api/upload', { method: 'POST', body: formDataWithFile });
      //   const { url } = await uploadResp.json();
      //   finalUpdatedItem.image = url;
      // }

      // Format data as menu section for editData API
      const menuSectionData = [
        {
          type: "menuSection",
          section: {
            title: category,
            items: [finalUpdatedItem],
          },
        },
      ];

      const encryptionKey = process.env.NEXT_PUBLIC_ENCRYPTION_KEY || "";
      if (!encryptionKey || !userID || !restaurantId) {
        console.error("Missing encryption key, userID, or restaurantId");
        window.alert("Configuration error - cannot submit");
        return;
      }

      // Encrypt the data
      const enc_data = CryptoJS.AES.encrypt(JSON.stringify(menuSectionData), encryptionKey).toString();
      const encrypted_restaurant_id = CryptoJS.AES.encrypt(restaurantId, encryptionKey).toString();
      const encrypted_api_key = CryptoJS.AES.encrypt(process.env.NEXT_PUBLIC_API_KEY || "", encryptionKey).toString();
      const encrypted_user_id = CryptoJS.AES.encrypt(userID, encryptionKey).toString();

      try {
        const resp = await fetch("/api/user/profil/edditData", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            encrypted_user_id,
            encrypted_restaurant_id,
            encrypted_data: enc_data,
            encrypted_api_key,
          }),
        });
        console.log(resp);

        if (!resp.ok) {
          const errorData = await resp.json().catch(() => ({}));
          throw new Error(errorData.message || `API Error: ${resp.status}`);
        }

        const result = await resp.json();
        console.log("Success:", result);

        // Update parent and reset
        setChangedItem(finalUpdatedItem);
        reset();
        setUpdatedItem(finalUpdatedItem);
        setEditName(false);
        setEditDescription(false);
        setEditPrice(false);
        setEditImage(false);

// Der Preis Speicher ist kaputt =>  12.50 wird zu 12.5, 12.00 => 12, aber 12.05 funktioniert
// Es liegt an der Datenbank

        console.log("Updated Data:", finalUpdatedItem);
        window.alert("Erfolgreich aktualisiert!"); // Optional success alert
      } catch (error) {
        console.error("Fetch/Encryption Error:", error);
        window.alert("Ups etwas ist schief gelaufen! \nBitte versuchen sie es nochmal! \nFehler: " + error.message);
      }
    },
    [selectedItem, userID, restaurantId, category, setChangedItem, reset]
  );

  const toggleEdit = (field) => {
    switch (field) {
      case "name":
        setEditName((prev) => !prev);
        break;
      case "description":
        setEditDescription((prev) => !prev);
        break;
      case "price":
        setEditPrice((prev) => !prev);
        break;
      case "img":
        setEditImage((prev) => !prev);
        break;
      default:
        break;
    }
  };

  // Watch form values for real-time display (when not editing)
  const watchedValues = watch();

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Speise bearbeiten:</DialogTitle>
          <Tooltip>
            <TooltipTrigger>
              <FaCircleInfo />
            </TooltipTrigger>
            <TooltipContent>
              <p className="truncate whitespace-nowrap">Auf das Stift Symbol oder die Bezeichnung klicken um das Element bearbeiten zu können</p>
            </TooltipContent>
          </Tooltip>
        </DialogHeader>
        <div className="mt-4">
          {selectedItem ? (
            <Form {...form}>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={control}
                  name="name"
                  render={({ field }) => (
                    <FormItem className="mb-6">
                      <FormLabel onClick={() => toggleEdit("name")}>
                        <FaPen />
                        Name:
                      </FormLabel>
                      {editName ? (
                        <FormControl>
                          <Input type="text" placeholder="Name" {...field} />
                        </FormControl>
                      ) : (
                        <div>{watchedValues.name || selectedItem.name || "-"}</div> // Use watched or fallback
                      )}
                      <FormMessage /> {/* Show Zod errors */}
                    </FormItem>
                  )}
                />
                <FormField
                  control={control}
                  name="description"
                  render={({ field }) => (
                    <FormItem className="mb-6">
                      <FormLabel onClick={() => toggleEdit("description")}>
                        <FaPen />
                        Beschreibung:
                      </FormLabel>
                      {editDescription ? (
                        <FormControl>
                          <Textarea placeholder="Beschreibung" {...field} />
                        </FormControl>
                      ) : (
                        <div>{watchedValues.description || selectedItem.description || "-"}</div>
                      )}
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={control}
                  name="price"
                  render={({ field }) => (
                    <FormItem className="mb-6">
                      <FormLabel onClick={() => toggleEdit("price")}>
                        <FaPen />
                        Preis:
                      </FormLabel>
                      {editPrice ? <Input type="text" inputMode="decimal" placeholder="z. B. 9.99" {...field} /> : <div>{Number(watchedValues.price ?? selectedItem.price ?? 0).toFixed(2)} €</div>}
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={control}
                  name="Bild"
                  render={(
                    { field: { onChange, ...field } } // Destructure to handle file
                  ) => (
                    <FormItem className="mb-6">
                      <FormLabel onClick={() => toggleEdit("img")}>
                        <FaPen />
                        Bild:
                      </FormLabel>
                      {editImage ? (
                        <FormControl>
                          <Input
                            type="file"
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) {
                                // For files: Convert to URL or upload (placeholder)
                                // onChange(URL.createObjectURL(file)); // Temp URL for preview
                                onChange(file); // But note: Files aren't JSON-serializable - upload separately
                              }
                            }}
                            {...field}
                          />
                        </FormControl>
                      ) : (
                        <div>{selectedItem.img || "-"}</div> // Show URL or placeholder
                      )}
                      <FormMessage />
                      {/* Note: For real file uploads, add upload logic in onSubmit before encryption */}
                    </FormItem>
                  )}
                />
                <Button type="submit" className="w-full">
                  Aktualisieren
                </Button>
              </form>
            </Form>
          ) : (
            <div>No item selected.</div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export { SelectItem };
