import React, { useEffect, useState, useRef } from "react";
import { useForm } from "react-hook-form";
import CryptoJS from "crypto-js";
import { useSession } from "next-auth/react";

import { Input } from "@/components/ui/input";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { colors } from "./colorPalet";

export function EdditCategoryGroup({ id, renderCatGroupMenu, setRenderCatGroupMenu, name, position, bgColor, restaurantID }) {
  const [newPos, setNewPos] = useState(position);
  const [newName, setNewName] = useState(name);
  const [newBgCol, setBgCol] = useState(bgColor);
  const { data: session } = useSession();

  const saveData = async () => {
    const resp = await fetch("/api/user/profil/edditData", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        userID: session.user.id,
        restaurantId: restaurantID,
        data: {
          type: "categoryGroupUpdate",
          categoryGroup: {
            id: id ?? null,
            position: newPos ?? null,
            name: newName ?? null,
            bgColor: newBgCol ?? null,
          },
        },
      }),
    });
    // API-KEY Abfrgae fürs erste entfernen => Erst dann funktioniert der code wieder

    if (!resp.ok) window.alert("Ein Fehler ist aufgetreten: " + resp.status);
    setRenderCatGroupMenu(null);
  };

  return (
    <Dialog open={renderCatGroupMenu === id} onOpenChange={() => setRenderCatGroupMenu(null)}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Kategorie-Gruppe bearbeiten</DialogTitle>
          <DialogDescription>
            ID: <code className="text-xs bg-muted px-1.5 py-0.5 rounded font-mono">{id}</code>
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-4 py-2">
          {/* Name */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-muted-foreground tracking-wide uppercase">Name</label>
            <Input defaultValue={name} placeholder="z. B. Fixkosten" onChange={(e) => setNewName(e.target.value)} />
          </div>

          {/* Position */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-muted-foreground tracking-wide uppercase">Position</label>
            <Input type="number" defaultValue={position} placeholder="1" onChange={(e) => setNewPos(Number(e.target.value))} />
          </div>

          {/* Farbe */}
          <div className="flex flex-col gap-2">
            <label className="text-xs font-medium text-muted-foreground tracking-wide uppercase">Farbe</label>
            <div className="flex flex-wrap gap-2">
              {colors.map((color) => (
                <button
                  key={color}
                  type="button"
                  onClick={() => setBgCol(color)}
                  className="w-7 h-7 rounded-full transition-transform hover:scale-110 focus:outline-none"
                  style={{
                    background: color,
                    border: newBgCol === color ? "2px solid hsl(var(--foreground))" : "2px solid transparent",
                  }}
                />
              ))}
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-2 pt-2 border-t">
          <Button variant="ghost" onClick={() => setRenderCatGroupMenu(null)}>
            Abbrechen
          </Button>
          <Button onClick={saveData}>Speichern</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
