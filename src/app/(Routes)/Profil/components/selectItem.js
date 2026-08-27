import React, { useEffect, useState, useCallback } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";

import { Input } from "@/components/ui/input";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

import { FaPen } from "react-icons/fa";
import { FaCircleInfo } from "react-icons/fa6";

import { itemSchema } from "./menuSchema";
import { ALLERGENS } from "@/lib/allergens";

const SelectItem = ({ open, onOpenChange, selectedItem, setChangedItem, userID, category, restaurantId }) => {
  const [editName, setEditName] = useState(false);
  const [editDescription, setEditDescription] = useState(false);
  const [editPrice, setEditPrice] = useState(false);

  // ── Allergen-State ─────────────────────────────────────────────────────────
  const [selectedAllergens, setSelectedAllergens] = useState([]);
  const [allergenSaving, setAllergenSaving] = useState(false);

  const form = useForm({
    resolver: zodResolver(itemSchema),
    defaultValues: {
      name: selectedItem?.name || "",
      description: selectedItem?.description || "",
      price: selectedItem?.price || 0,
    },
  });
  const { control, handleSubmit, reset, watch } = form;

  useEffect(() => {
    if (selectedItem) {
      reset({
        name: selectedItem.name || "",
        description: selectedItem.description || "",
        price: selectedItem.price !== null && selectedItem.price !== undefined
          ? Number(selectedItem.price).toFixed(2)
          : "0.00",
      });

      // Vorhandene Allergene aus dem Item laden
      setSelectedAllergens(selectedItem.allergens ?? []);
    }
    setEditName(false);
    setEditDescription(false);
    setEditPrice(false);
  }, [selectedItem, reset]);

  // ── Gericht speichern ──────────────────────────────────────────────────────
  const onSubmit = useCallback(
    async (data) => {
      if (!data || !selectedItem) {
        toast.warning("Kein Item ausgewählt oder keine Änderungen");
        return;
      }

      const finalUpdatedItem = {
        id: selectedItem.id,
        name: data.name || selectedItem.name,
        price: data.price != null ? data.price : selectedItem.price,
        description: data.description || selectedItem.description,
      };

      const menuSectionData = [
        {
          type: "edditMenu",
          section: {
            title: category,
            items: [finalUpdatedItem],
          },
        },
      ];

      if (!userID || !restaurantId) {
        toast.error("Konfigurationsfehler – bitte Seite neu laden");
        return;
      }

      // ── Optimistisch: UI sofort aktualisieren & Dialog schließen ──────────
      setChangedItem(finalUpdatedItem);
      onOpenChange(false);
      reset();
      setEditName(false);
      setEditDescription(false);
      setEditPrice(false);

      try {
        const resp = await fetch("/api/user/profil/edditData", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ restaurantId, data: menuSectionData }),
        });

        if (!resp.ok) {
          const errorData = await resp.json().catch(() => ({}));
          throw new Error(errorData.message || `API Error: ${resp.status}`);
        }

        toast.success("Gericht erfolgreich aktualisiert!");
      } catch (error) {
        console.error("Fehler beim Speichern:", error);
        // ── Rollback: Original-Item wiederherstellen ───────────────────────
        setChangedItem(selectedItem);
        toast.error("Fehler beim Speichern – Änderungen wurden zurückgesetzt: " + error.message);
      }
    },
    [selectedItem, userID, restaurantId, category, setChangedItem, reset, onOpenChange]
  );

  // ── Allergene speichern ────────────────────────────────────────────────────
  const saveAllergens = async () => {
    if (!selectedItem?.id || !restaurantId) return;
    setAllergenSaving(true);
    try {
      const resp = await fetch("/api/user/profil/updateAllergens", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          dishId: selectedItem.id,
          restaurantId,
          allergens: selectedAllergens,
        }),
      });

      if (!resp.ok) {
        const err = await resp.json().catch(() => ({}));
        throw new Error(err.error || "Fehler");
      }

      toast.success("Allergene gespeichert!");
    } catch (err) {
      toast.error("Fehler beim Speichern der Allergene: " + err.message);
    } finally {
      setAllergenSaving(false);
    }
  };

  const toggleAllergen = (key) => {
    setSelectedAllergens((prev) =>
      prev.includes(key) ? prev.filter((a) => a !== key) : [...prev, key]
    );
  };

  const toggleEdit = (field) => {
    switch (field) {
      case "name":        setEditName((p) => !p); break;
      case "description": setEditDescription((p) => !p); break;
      case "price":       setEditPrice((p) => !p); break;
      default: break;
    }
  };

  const watchedValues = watch();

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Speise bearbeiten</DialogTitle>
          <DialogDescription className="flex items-center gap-1">
            <Tooltip>
              <TooltipTrigger asChild>
                <span className="inline-flex items-center gap-1 cursor-help">
                  <FaCircleInfo className="text-gray-400" />
                  Auf das Stift-Symbol klicken um ein Feld zu bearbeiten
                </span>
              </TooltipTrigger>
              <TooltipContent>
                Felder können einzeln bearbeitet werden
              </TooltipContent>
            </Tooltip>
          </DialogDescription>
        </DialogHeader>

        <div className="mt-2">
          {selectedItem ? (
            <>
              {/* ── Basis-Daten ──────────────────────────────────────────── */}
              <Form {...form}>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                  <FormField
                    control={control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel
                          onClick={() => toggleEdit("name")}
                          className="flex items-center gap-1 cursor-pointer select-none"
                        >
                          <FaPen className="text-xs" /> Name
                        </FormLabel>
                        {editName ? (
                          <FormControl>
                            <Input type="text" placeholder="Name" {...field} />
                          </FormControl>
                        ) : (
                          <div className="text-sm px-1">{watchedValues.name || selectedItem.name || "–"}</div>
                        )}
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel
                          onClick={() => toggleEdit("description")}
                          className="flex items-center gap-1 cursor-pointer select-none"
                        >
                          <FaPen className="text-xs" /> Beschreibung
                        </FormLabel>
                        {editDescription ? (
                          <FormControl>
                            <Textarea placeholder="Beschreibung" {...field} />
                          </FormControl>
                        ) : (
                          <div className="text-sm px-1">{watchedValues.description || selectedItem.description || "–"}</div>
                        )}
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={control}
                    name="price"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel
                          onClick={() => toggleEdit("price")}
                          className="flex items-center gap-1 cursor-pointer select-none"
                        >
                          <FaPen className="text-xs" /> Preis
                        </FormLabel>
                        {editPrice ? (
                          <Input type="text" inputMode="decimal" placeholder="z. B. 9.99" {...field} />
                        ) : (
                          <div className="text-sm px-1">
                            {Number(watchedValues.price ?? selectedItem.price ?? 0).toFixed(2)} €
                          </div>
                        )}
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button type="submit" className="w-full">
                    Gericht aktualisieren
                  </Button>
                </form>
              </Form>

              {/* ── Allergen-Editor ──────────────────────────────────────── */}
              <Separator className="my-4" />
              <div className="space-y-3">
                <h4 className="text-sm font-semibold text-gray-700">
                  🌿 Allergene (EU-Kennzeichnungspflicht)
                </h4>

                {/* Ausgewählte Allergene als Badges anzeigen */}
                {selectedAllergens.length > 0 && (
                  <div className="flex flex-wrap gap-1 mb-2">
                    {selectedAllergens.map((key) => {
                      const a = ALLERGENS.find((x) => x.key === key);
                      return (
                        <Badge key={key} variant="secondary" className="text-xs">
                          {a ? `(${a.id}) ${a.name}` : key}
                        </Badge>
                      );
                    })}
                  </div>
                )}

                <div className="grid grid-cols-2 gap-x-4 gap-y-2">
                  {ALLERGENS.map((allergen) => (
                    <div key={allergen.key} className="flex items-start gap-2">
                      <Checkbox
                        id={`allergen-${allergen.key}`}
                        checked={selectedAllergens.includes(allergen.key)}
                        onCheckedChange={() => toggleAllergen(allergen.key)}
                        className="mt-0.5"
                      />
                      <label
                        htmlFor={`allergen-${allergen.key}`}
                        className="text-xs cursor-pointer leading-tight"
                      >
                        <span className="font-medium">({allergen.id}) {allergen.name}</span>
                        {allergen.description && (
                          <span className="block text-gray-400">{allergen.description}</span>
                        )}
                      </label>
                    </div>
                  ))}
                </div>

                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={saveAllergens}
                  disabled={allergenSaving}
                  className="w-full"
                >
                  {allergenSaving ? "Speichert..." : "Allergene speichern"}
                </Button>
              </div>
            </>
          ) : (
            <div className="text-gray-500 text-sm">Kein Item ausgewählt.</div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export { SelectItem };
