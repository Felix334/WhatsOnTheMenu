"use client";

import { useState } from "react";
import { toast } from "sonner";

import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ColorPicker } from "./ColorPicker";

const BORDER_RADIUS_OPTIONS = [
  { value: "none", label: "Eckig" },
  { value: "sm", label: "Leicht" },
  { value: "md", label: "Gerundet" },
  { value: "xl", label: "Sehr rund" },
];

export function EdditCategoryGroup({ id, renderCatGroupMenu, setRenderCatGroupMenu, name, position, bgColor, fontColor: initialFontColor, borderRadius: initialBorderRadius, restaurantID, allowPremiumColor, onBorderRadiusChange, onColorChange, onFontColorChange }) {
  const [newName, setNewName] = useState(name);
  const [newColor, setNewColor] = useState(bgColor ?? "");
  const [newFontColor, setNewFontColor] = useState(initialFontColor ?? "");
  const [borderRadius, setBorderRadius] = useState(initialBorderRadius || "md");

  const saveData = async () => {
    // Nur geänderte Felder sammeln
    const changes = {};
    if (newName !== name) changes.name = newName;
    if (newColor !== (bgColor ?? "") && newColor) changes.color = newColor; // color ist required in DB
    if (newFontColor !== (initialFontColor ?? "")) changes.fontColor = newFontColor || null;
    if (borderRadius !== (initialBorderRadius || "md")) changes.borderRadius = borderRadius;

    if (Object.keys(changes).length === 0) {
      setRenderCatGroupMenu(null);
      return;
    }

    // Optimistisches Update nur für geänderte Felder
    if ("borderRadius" in changes) onBorderRadiusChange?.(borderRadius);
    if ("color" in changes) onColorChange?.(newColor);
    if ("fontColor" in changes) onFontColorChange?.(newFontColor);

    const resp = await fetch("/api/user/profil/edditData", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        restaurantId: restaurantID,
        data: {
          type: "categoryGroupUpdate",
          categoryGroup: { id, ...changes },
        },
      }),
    });

    if (!resp.ok) {
      // Optimistisches Update zurücksetzen
      if ("borderRadius" in changes) onBorderRadiusChange?.(initialBorderRadius);
      if ("color" in changes) onColorChange?.(bgColor);
      if ("fontColor" in changes) onFontColorChange?.(initialFontColor);
      toast.error("Fehler beim Speichern: " + resp.status);
    } else {
      toast.success("Kategorie-Gruppe gespeichert!");
      setRenderCatGroupMenu(null);
    }
  };

  return (
    <Dialog open={renderCatGroupMenu === id} onOpenChange={() => setRenderCatGroupMenu(null)}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Kategorie-Gruppe bearbeiten</DialogTitle>
          <DialogDescription>Position: {position}</DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-5 py-2">
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-muted-foreground tracking-wide">Name</label>
            <Input defaultValue={name} placeholder="z. B. Mittagskarte" onChange={(e) => setNewName(e.target.value)} />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-xs font-medium text-muted-foreground tracking-wide">Hintergrundfarbe</label>
            <ColorPicker value={newColor} onChange={setNewColor} allowPremiumColor={allowPremiumColor} />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-xs font-medium text-muted-foreground tracking-wide">Schriftfarbe</label>
            <div className="flex items-center gap-3">
              <Input
                type="color"
                value={newFontColor || "#000000"}
                onChange={(e) => setNewFontColor(e.target.value)}
                className="h-10 w-16 cursor-pointer rounded-md border p-1"
              />
              <div
                className="flex-1 h-9 rounded-lg border border-gray-200 text-xs flex items-center px-3"
                style={{ color: newFontColor || undefined }}
              >
                {newFontColor ? newFontColor : <span className="text-gray-400">Standard</span>}
              </div>
              {newFontColor && (
                <button
                  type="button"
                  onClick={() => setNewFontColor("")}
                  className="text-xs text-gray-400 hover:text-gray-700 whitespace-nowrap"
                >
                  ✕ Zurücksetzen
                </button>
              )}
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-muted-foreground tracking-wide">Rand</label>
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
        </div>

        <div className="flex justify-end gap-2 pt-2 border-t">
          <Button variant="ghost" onClick={() => setRenderCatGroupMenu(null)}>Abbrechen</Button>
          <Button onClick={saveData}>Speichern</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
