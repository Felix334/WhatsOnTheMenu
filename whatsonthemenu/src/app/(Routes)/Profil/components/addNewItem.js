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

const AddNewItems = () => {
    const [name, setName] = useState("");
    const [price, setPrice] = useState(0);
    const [description, setDescription] = useState("");
    const [image, setImage] = useState();

    return(<Dialog open={open} onOpenChange={onOpenChange}>
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
        </Dialog>)
}
export {AddNewItems}