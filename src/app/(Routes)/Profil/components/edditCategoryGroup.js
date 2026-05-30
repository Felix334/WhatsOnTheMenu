"use client";

import { useState } from "react";
import { toast } from "sonner";

import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ColorPicker } from "./ColorPicker";

export function EdditCategoryGroup({ id, renderCatGroupMenu, setRenderCatGroupMenu, name, position, bgColor, restaurantID, allowPremiumColor }) {
  const [newName, setNewName] = useState(name);
  const [newColor, setNewColor] = useState(bgColor ?? "");

  const saveData = async () => {
    const resp = await fetch("/api/user/profil/edditData", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        restaurantId: restaurantID,
        data: {
          type: "categoryGroupUpdate",
          categoryGroup: {
            id,
            name: newName ?? null,
            color: newColor ?? null,
          },
        },
      }),
    });

    if (!resp.ok) {
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
        </div>

        <div className="flex justify-end gap-2 pt-2 border-t">
          <Button variant="ghost" onClick={() => setRenderCatGroupMenu(null)}>Abbrechen</Button>
          <Button onClick={saveData}>Speichern</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
