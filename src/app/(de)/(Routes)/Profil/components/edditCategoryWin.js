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

const TITLE_ALIGN_OPTIONS = [
  { value: "left", label: "Links" },
  { value: "center", label: "Zentriert" },
  { value: "right", label: "Rechts" },
];

const EdditCategoryMenu = ({ open, onOpenChange, selectedCategory, setChangedCategory, onBorderRadiusChange, onColorChange, onElevatedChange, onFontColorChange, onLeaderDotsChange, onTitleAlignChange, onTitleUppercaseChange, category, restaurantId, allowPremiumColor }) => {
  const [color, setColor] = useState("");
  const [fontColor, setFontColor] = useState("");
  const [borderRadius, setBorderRadius] = useState("md");
  const [elevated, setElevated] = useState(true);
  const [leaderDots, setLeaderDots] = useState(false);
  const [titleAlign, setTitleAlign] = useState("center");
  const [titleUppercase, setTitleUppercase] = useState(false);
  const formRef = useRef();

  const form = useForm({
    defaultValues: { name: "" },
  });

  useEffect(() => {
    formRef.current = form;
  }, [form]);

  useEffect(() => {
    if (selectedCategory && formRef.current) {
      formRef.current.setValue("name", selectedCategory.name || "");
      setColor(selectedCategory.color || selectedCategory.bgColor || "");
      setFontColor(selectedCategory.fontColor || "");
      setBorderRadius(selectedCategory.borderRadius || "md");
      setElevated(selectedCategory.elevated ?? true);
      setLeaderDots(selectedCategory.leaderDots ?? false);
      setTitleAlign(selectedCategory.titleAlign || "center");
      setTitleUppercase(selectedCategory.titleUppercase ?? false);
    }
  }, [selectedCategory]);

  const { handleSubmit } = form;

  const onSubmit = async (data) => {
    const initName = selectedCategory?.name || "";
    const initColor = selectedCategory?.color || selectedCategory?.bgColor || "";
    const initFontColor = selectedCategory?.fontColor || "";
    const initBorderRadius = selectedCategory?.borderRadius || "md";
    const initElevated = selectedCategory?.elevated ?? true;
    const initLeaderDots = selectedCategory?.leaderDots ?? false;
    const initTitleAlign = selectedCategory?.titleAlign || "center";
    const initTitleUppercase = selectedCategory?.titleUppercase ?? false;

    // Nur geänderte Felder sammeln
    const changes = {};
    if (data.name !== initName) changes.name = data.name;
    if (color !== initColor) changes.color = color || null;
    if (fontColor !== initFontColor) changes.fontColor = fontColor || null;
    if (borderRadius !== initBorderRadius) changes.borderRadius = borderRadius;
    if (elevated !== initElevated) changes.elevated = elevated;
    if (leaderDots !== initLeaderDots) changes.leaderDots = leaderDots;
    if (titleAlign !== initTitleAlign) changes.titleAlign = titleAlign;
    if (titleUppercase !== initTitleUppercase) changes.titleUppercase = titleUppercase;

    if (Object.keys(changes).length === 0) {
      onOpenChange(false);
      return;
    }

    // Optimistisches Update nur für geänderte Felder
    if ("borderRadius" in changes) onBorderRadiusChange?.(borderRadius);
    if ("color" in changes) onColorChange?.(color);
    if ("elevated" in changes) onElevatedChange?.(elevated);
    if ("fontColor" in changes) onFontColorChange?.(fontColor);
    if ("leaderDots" in changes) onLeaderDotsChange?.(leaderDots);
    if ("titleAlign" in changes) onTitleAlignChange?.(titleAlign);
    if ("titleUppercase" in changes) onTitleUppercaseChange?.(titleUppercase);

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
              ...changes,
            },
          },
        }),
      });

      if (!response.ok) throw new Error(`HTTP ${response.status}`);

      toast.success("Kategorie gespeichert!");
      setChangedCategory((prev) => [...prev, { id: selectedCategory?.id, ...changes }]);
      onOpenChange(false);
    } catch (error) {
      // Optimistisches Update zurücksetzen
      if ("borderRadius" in changes) onBorderRadiusChange?.(initBorderRadius);
      if ("color" in changes) onColorChange?.(initColor);
      if ("elevated" in changes) onElevatedChange?.(initElevated);
      if ("fontColor" in changes) onFontColorChange?.(initFontColor);
      if ("leaderDots" in changes) onLeaderDotsChange?.(initLeaderDots);
      if ("titleAlign" in changes) onTitleAlignChange?.(initTitleAlign);
      if ("titleUppercase" in changes) onTitleUppercaseChange?.(initTitleUppercase);
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

            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium">Schriftfarbe</label>
              <div className="flex items-center gap-3">
                <Input
                  type="color"
                  value={fontColor || "#000000"}
                  onChange={(e) => setFontColor(e.target.value)}
                  className="h-10 w-16 cursor-pointer rounded-md border p-1"
                />
                <div
                  className="flex-1 h-9 rounded-lg border border-gray-200 text-xs flex items-center px-3"
                  style={{ color: fontColor || undefined }}
                >
                  {fontColor ? fontColor : <span className="text-gray-400">Standard</span>}
                </div>
                {fontColor && (
                  <button
                    type="button"
                    onClick={() => setFontColor("")}
                    className="text-xs text-gray-400 hover:text-gray-700 whitespace-nowrap"
                  >
                    ✕ Zurücksetzen
                  </button>
                )}
              </div>
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

            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium">Titel-Ausrichtung</label>
              <div className="flex gap-2">
                {TITLE_ALIGN_OPTIONS.map(({ value, label }) => (
                  <button
                    key={value}
                    type="button"
                    onClick={() => setTitleAlign(value)}
                    className={`flex-1 py-2 text-sm rounded-xl border-2 transition-all ${titleAlign === value ? "border-gray-900 bg-gray-900 text-white font-semibold" : "border-gray-200 text-gray-600 hover:border-gray-400"}`}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium">Titel-Stil</label>
              <button
                type="button"
                onClick={() => setTitleUppercase(!titleUppercase)}
                className={`py-2 text-sm rounded-xl border-2 transition-all uppercase tracking-widest ${titleUppercase ? "border-gray-900 bg-gray-900 text-white font-semibold" : "border-gray-200 text-gray-600 hover:border-gray-400"}`}
              >
                Grossbuchstaben
              </button>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium">Punktlinien zum Preis</label>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setLeaderDots(true)}
                  className={`flex-1 py-2 text-sm rounded-xl border-2 transition-all ${leaderDots ? "border-gray-900 bg-gray-900 text-white font-semibold" : "border-gray-200 text-gray-600 hover:border-gray-400"}`}
                >
                  <span>An</span>
                  <span className="hidden sm:inline text-xs opacity-70"> — Gericht ..... 9,50€</span>
                </button>
                <button
                  type="button"
                  onClick={() => setLeaderDots(false)}
                  className={`flex-1 py-2 text-sm rounded-xl border-2 transition-all ${!leaderDots ? "border-gray-900 bg-gray-900 text-white font-semibold" : "border-gray-200 text-gray-600 hover:border-gray-400"}`}
                >
                  Aus
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
