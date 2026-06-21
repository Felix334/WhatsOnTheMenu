"use client";

import { useEffect, useState, useRef } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { Input } from "@/components/ui/input";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ColorPicker } from "./ColorPicker";

const BORDER_RADIUS_OPTIONS = [
  { value: "none", label: "Eckig" },
  { value: "sm", label: "Leicht" },
  { value: "md", label: "Gerundet" },
  { value: "xl", label: "Sehr rund" },
];

const EdditCategoryMenu = ({ open, onOpenChange, selectedCategory, setChangedCategory, onBorderRadiusChange, onColorChange, onElevatedChange, category, restaurantId, allowPremiumColor }) => {
  const [color, setColor] = useState("");
  const [borderRadius, setBorderRadius] = useState("md");
  const [elevated, setElevated] = useState(true);
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
      setBorderRadius(selectedCategory.borderRadius || "md");
      setElevated(selectedCategory.elevated ?? true);
    }
  }, [selectedCategory]);

  const { handleSubmit } = form;

  const onSubmit = async (data) => {
    const prev = selectedCategory?.borderRadius;
    const prevColor = selectedCategory?.color;
    const prevElevated = selectedCategory?.elevated ?? true;
    onBorderRadiusChange?.(borderRadius);
    onColorChange?.(color);
    onElevatedChange?.(elevated);
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
              borderRadius,
              elevated,
            },
          },
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      toast.success("Kategorie gespeichert!");
      setChangedCategory((prev) => [...prev, { id: selectedCategory?.id, name: data.name, color, borderRadius }]);
      onOpenChange(false);
    } catch (error) {
      onBorderRadiusChange?.(prev);
      onColorChange?.(prevColor);
      onElevatedChange?.(prevElevated);
      toast.error("Fehler beim Speichern: " + error.message);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Kategorie bearbeiten</DialogTitle>
          <DialogDescription>Name, Farbe und Rand der Kategorie anpassen</DialogDescription>
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

            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium">Rand</label>
              <div className="flex gap-2">
                {BORDER_RADIUS_OPTIONS.map(({ value, label }) => (
                  <button
                    key={value}
                    type="button"
                    onClick={() => setBorderRadius(value)}
                    className={`flex-1 py-2 text-sm border-2 transition-all ${
                      borderRadius === value
                        ? "border-gray-900 bg-gray-900 text-white font-semibold"
                        : "border-gray-200 text-gray-600 hover:border-gray-400"
                    } ${value === "none" ? "rounded-none" : value === "sm" ? "rounded-lg" : value === "md" ? "rounded-xl" : "rounded-3xl"}`}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium">Abhebung</label>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setElevated(true)}
                  className={`flex-1 py-2 text-sm rounded-xl border-2 transition-all ${elevated ? "border-gray-900 bg-gray-900 text-white font-semibold" : "border-gray-200 text-gray-600 hover:border-gray-400"}`}
                >
                  Mit Schatten
                </button>
                <button
                  type="button"
                  onClick={() => setElevated(false)}
                  className={`flex-1 py-2 text-sm rounded-xl border-2 transition-all ${!elevated ? "border-gray-900 bg-gray-900 text-white font-semibold" : "border-gray-200 text-gray-600 hover:border-gray-400"}`}
                >
                  Flach
                </button>
              </div>
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
