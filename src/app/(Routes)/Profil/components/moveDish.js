"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select";

/**
 * Verschiebt ein Gericht in eine andere Kategorie.
 *
 * Speichert sofort (eigene API-Route), nicht über die Speichern-Leiste: der
 * Wechsel betrifft ein bereits gespeichertes Gericht, und setData/edditData
 * lehnen einen Kategoriewechsel bewusst ab.
 */
const MoveDishDialog = ({ open, onOpenChange, dish, currentCategoryId, categoryGroups, onMoved }) => {
  const [targetId, setTargetId] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  // Bei jedem Öffnen zurücksetzen — sonst steht noch das Ziel vom letzten Mal drin.
  useEffect(() => {
    if (open) setTargetId("");
  }, [open, dish?.id]);

  const handleMove = async () => {
    if (!dish?.id || !targetId) return;

    setIsSaving(true);
    try {
      const res = await fetch("/api/user/profil/moveDish", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ dishId: dish.id, targetCategoryId: targetId }),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error || `Fehler ${res.status}`);
      }

      onMoved?.(dish.id, currentCategoryId, targetId);
      toast.success("Gericht verschoben");
      onOpenChange(false);
    } catch (err) {
      toast.error("Verschieben fehlgeschlagen: " + err.message);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Gericht verschieben</DialogTitle>
          <DialogDescription>
            <span className="font-medium text-gray-700">{dish?.name}</span> in eine andere Kategorie verschieben.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-2 py-2">
          <Label>Zielkategorie</Label>
          <Select value={targetId} onValueChange={setTargetId}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Kategorie wählen" />
            </SelectTrigger>
            <SelectContent>
              {categoryGroups.map((group) => {
                const selectable = (group.categories ?? []).filter((c) => c.id !== currentCategoryId);
                if (selectable.length === 0) return null;
                return (
                  <SelectGroup key={group.id}>
                    <SelectLabel>{group.name}</SelectLabel>
                    {selectable.map((cat) => (
                      <SelectItem key={cat.id} value={cat.id}>
                        {cat.name}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                );
              })}
            </SelectContent>
          </Select>
          <p className="text-xs text-gray-400">Das Gericht wird ans Ende der Zielkategorie gesetzt und sofort gespeichert.</p>
        </div>

        <DialogFooter className="gap-2 sm:gap-2">
          <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
            Abbrechen
          </Button>
          <Button type="button" onClick={handleMove} disabled={!targetId || isSaving}>
            {isSaving ? "Verschiebe…" : "Verschieben"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export { MoveDishDialog };
