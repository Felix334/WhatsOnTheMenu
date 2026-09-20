"use client";

import { useMemo, useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select";

import { applyPriceChange, formatPrice, ROUNDING_LABELS, ROUNDING_MODES } from "@/lib/priceRules";

const PREVIEW_LIMIT = 6;
const ALL_SCOPE = "__all__";

/**
 * Preise einer Kategorie oder der gesamten Karte auf einen Schlag anpassen.
 *
 * Die Vorschau rechnet mit derselben Funktion wie die API (applyPriceChange in
 * src/lib/priceRules.js) — angezeigter und gespeicherter Preis können also
 * nicht auseinanderlaufen.
 */
const BulkPriceDialog = ({ open, onOpenChange, categoryGroups, onApplied }) => {
  const [scopeValue, setScopeValue] = useState(ALL_SCOPE);
  const [mode, setMode] = useState("percent");
  const [rounding, setRounding] = useState("none");
  const [rawValue, setRawValue] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  const value = useMemo(() => {
    const parsed = Number.parseFloat(String(rawValue).replace(",", "."));
    return Number.isFinite(parsed) ? parsed : null;
  }, [rawValue]);

  // Betroffene Gerichte aus den bereits geladenen Daten — kein zusätzlicher Fetch.
  const affectedDishes = useMemo(() => {
    const all = categoryGroups.flatMap((g) => (g.categories ?? []).flatMap((c) => (c.dishes ?? []).map((d) => ({ ...d, categoryId: c.id }))));
    return scopeValue === ALL_SCOPE ? all : all.filter((d) => d.categoryId === scopeValue);
  }, [categoryGroups, scopeValue]);

  const preview = useMemo(() => {
    if (value === null) return [];
    return affectedDishes
      .map((dish) => {
        const oldPrice = Number(dish.price);
        const newPrice = applyPriceChange(oldPrice, mode, value, rounding);
        return { id: dish.id, name: dish.name, oldPrice, newPrice };
      })
      .filter((row) => row.newPrice !== null && row.newPrice !== row.oldPrice);
  }, [affectedDishes, mode, value, rounding]);

  const outOfRange = value !== null && ((mode === "percent" && (value < -90 || value > 500)) || (mode === "amount" && (value < -1000 || value > 1000)));

  const canApply = value !== null && value !== 0 && !outOfRange && preview.length > 0 && !isSaving;

  const handleApply = async () => {
    if (!canApply) return;

    setIsSaving(true);
    try {
      const res = await fetch("/api/user/profil/bulkPrice", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          scope: scopeValue === ALL_SCOPE ? "all" : "category",
          ...(scopeValue === ALL_SCOPE ? {} : { categoryId: scopeValue }),
          mode,
          value,
          rounding,
        }),
      });

      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || `Fehler ${res.status}`);

      // Lokalen Datenstand mit derselben Formel nachziehen statt neu zu laden.
      onApplied?.({ scope: scopeValue === ALL_SCOPE ? "all" : "category", categoryId: scopeValue, mode, value, rounding });

      toast.success(`${data.updated ?? preview.length} Preise aktualisiert`);
      setRawValue("");
      onOpenChange(false);
    } catch (err) {
      toast.error("Preisänderung fehlgeschlagen: " + err.message);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Preise anpassen</DialogTitle>
          <DialogDescription>Alle Preise einer Kategorie oder der gesamten Karte auf einmal ändern.</DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-2">
          <div className="space-y-2">
            <Label>Geltungsbereich</Label>
            <Select value={scopeValue} onValueChange={setScopeValue}>
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={ALL_SCOPE}>Gesamte Speisekarte</SelectItem>
                {categoryGroups.map((group) =>
                  (group.categories ?? []).length === 0 ? null : (
                    <SelectGroup key={group.id}>
                      <SelectLabel>{group.name}</SelectLabel>
                      {group.categories.map((cat) => (
                        <SelectItem key={cat.id} value={cat.id}>
                          {cat.name}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  ),
                )}
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Art</Label>
              <Select value={mode} onValueChange={setMode}>
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="percent">Prozentual (%)</SelectItem>
                  <SelectItem value="amount">Festbetrag (€)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="bulk-price-value">{mode === "percent" ? "Änderung in %" : "Änderung in €"}</Label>
              <Input id="bulk-price-value" inputMode="decimal" placeholder={mode === "percent" ? "z. B. 5 oder -10" : "z. B. 0,50"} value={rawValue} onChange={(e) => setRawValue(e.target.value)} />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Rundung</Label>
            <Select value={rounding} onValueChange={setRounding}>
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {ROUNDING_MODES.map((key) => (
                  <SelectItem key={key} value={key}>
                    {ROUNDING_LABELS[key]}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {outOfRange && <p className="text-sm text-red-600">{mode === "percent" ? "Erlaubt sind -90 % bis +500 %." : "Erlaubt sind -1000 € bis +1000 €."}</p>}

          {value !== null && value !== 0 && !outOfRange && (
            <div className="space-y-2">
              <p className="text-sm font-medium text-gray-700">
                Vorschau · {preview.length} von {affectedDishes.length} {affectedDishes.length === 1 ? "Gericht" : "Gerichten"} ändert sich
              </p>
              {preview.length === 0 ? (
                <p className="text-sm text-gray-400">Keine Preise betroffen.</p>
              ) : (
                <div className="border rounded-lg divide-y">
                  {preview.slice(0, PREVIEW_LIMIT).map((row) => (
                    <div key={row.id} className="flex items-center gap-3 px-3 py-2 text-sm">
                      <span className="min-w-0 flex-1 truncate text-gray-700">{row.name}</span>
                      <span className="font-mono text-gray-400 line-through">{formatPrice(row.oldPrice)}</span>
                      <span className="font-mono font-medium text-gray-900">{formatPrice(row.newPrice)}</span>
                    </div>
                  ))}
                  {preview.length > PREVIEW_LIMIT && <div className="px-3 py-2 text-xs text-gray-400">… und {preview.length - PREVIEW_LIMIT} weitere</div>}
                </div>
              )}
            </div>
          )}

          <p className="text-xs text-gray-400">Die Änderung wird sofort gespeichert und lässt sich nicht automatisch rückgängig machen.</p>
        </div>

        <DialogFooter className="gap-2 sm:gap-2">
          <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
            Abbrechen
          </Button>
          <Button type="button" onClick={handleApply} disabled={!canApply}>
            {isSaving ? "Speichert…" : `${preview.length || ""} Preise ändern`.trim()}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export { BulkPriceDialog };
