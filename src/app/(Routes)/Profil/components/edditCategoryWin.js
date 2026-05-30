"use client";

import { useEffect, useState, useRef } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { Input } from "@/components/ui/input";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ColorPicker } from "./ColorPicker";

const EdditCategoryMenu = ({ open, onOpenChange, selectedCategory, setChangedCategory, category, restaurantId, allowPremiumColor }) => {
  const [color, setColor] = useState("");
  const formRef = useRef();

  const form = useForm({
    defaultValues: {
      name: "",
    },
  });

  useEffect(() => {
    formRef.current = form;
  }, [form]);

  useEffect(() => {
    if (selectedCategory && formRef.current) {
      formRef.current.setValue("name", selectedCategory.name || "");
      setColor(selectedCategory.color || selectedCategory.bgColor || "");
    }
  }, [selectedCategory]);

  const { handleSubmit } = form;

  const onSubmit = async (data) => {
    try {
      const response = await fetch("/api/user/profil/edditData", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          restaurantId,
          data: {
            type: "categoryUpdate",
            category: {
              id: selectedCategory?.id ?? category?.id,
              name: data.name,
              color,
            },
          },
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      toast.success("Kategorie gespeichert!");
      setChangedCategory((prev) => [...prev, { id: selectedCategory?.id, name: data.name, color }]);
      onOpenChange(false);
    } catch (error) {
      toast.error("Fehler beim Speichern: " + error.message);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Kategorie bearbeiten</DialogTitle>
          <DialogDescription>Name und Farbe der Kategorie anpassen</DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input type="text" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium">Hintergrundfarbe</label>
              <ColorPicker value={color} onChange={setColor} allowPremiumColor={allowPremiumColor} />
            </div>

            <div className="flex justify-between pt-2">
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
