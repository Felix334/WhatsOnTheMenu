"use client";

import { useMemo, useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";

import { parseBulkMenuText, rowsToMenuSection } from "./bulkParser";
import { formatPrice } from "@/lib/priceRules";

const PLACEHOLDER = `Spaghetti Carbonara | Mit Speck, Ei und Pecorino | 12,50
Penne Arrabbiata | Scharfe Tomatensauce | 10,90
Lasagne | | 13,50
Tagessuppe 4,90`;

const PREVIEW_LIMIT = 50;

/**
 * Schnellerfassung: ganze Kategorien per Copy&Paste anlegen, statt jedes
 * Gericht einzeln über das Formular zu tippen.
 *
 * Übergibt das Ergebnis als `menuSection`-Eintrag an den Editor — gespeichert
 * wird es wie jede andere Neuanlage über die Speichern-Leiste (setData).
 */
const BulkImport = ({ open, onOpenChange, categoryGroupNames, categoryNames, remainingDishes, onImport }) => {
  const [groupName, setGroupName] = useState("");
  const [categoryName, setCategoryName] = useState("");
  const [text, setText] = useState("");

  const parsed = useMemo(() => parseBulkMenuText(text), [text]);

  const overLimit = Math.max(0, parsed.validRows.length - remainingDishes);
  const importableRows = overLimit > 0 ? parsed.validRows.slice(0, remainingDishes) : parsed.validRows;
  const canImport = groupName.trim() && categoryName.trim() && importableRows.length > 0;

  const reset = () => {
    setGroupName("");
    setCategoryName("");
    setText("");
  };

  const handleImport = () => {
    if (!canImport) return;

    onImport(rowsToMenuSection(groupName.trim(), categoryName.trim(), importableRows));

    toast.success(
      `${importableRows.length} ${importableRows.length === 1 ? "Gericht" : "Gerichte"} übernommen — zum Speichern unten auf „Speichern“ klicken`,
    );
    reset();
    onOpenChange(false);
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        if (!next) reset();
        onOpenChange(next);
      }}
    >
      <DialogContent className="max-w-3xl max-h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>Schnellerfassung</DialogTitle>
          <DialogDescription>
            Eine Zeile pro Gericht — getrennt mit <code className="px-1 rounded bg-gray-100">|</code>, Tabulator oder Semikolon. Aus Excel oder Word lässt sich direkt hineinkopieren.
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className="flex-1 -mx-1 px-1">
          <div className="space-y-4 pb-1">
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="bulk-group">Kategorie-Gruppe *</Label>
                <Input id="bulk-group" list="bulkCategoryGroup" autoComplete="off" placeholder="z. B. Abendessen" value={groupName} onChange={(e) => setGroupName(e.target.value)} />
                <datalist id="bulkCategoryGroup">
                  {categoryGroupNames.map((name) => (
                    <option key={name} value={name} />
                  ))}
                </datalist>
              </div>
              <div className="space-y-2">
                <Label htmlFor="bulk-category">Kategorie *</Label>
                <Input id="bulk-category" list="bulkCategoryNames" autoComplete="off" placeholder="z. B. Pasta" value={categoryName} onChange={(e) => setCategoryName(e.target.value)} />
                <datalist id="bulkCategoryNames">
                  {categoryNames.map((name) => (
                    <option key={name} value={name} />
                  ))}
                </datalist>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="bulk-text">Gerichte</Label>
              <Textarea id="bulk-text" rows={9} spellCheck={false} placeholder={PLACEHOLDER} value={text} onChange={(e) => setText(e.target.value)} className="font-mono text-sm" />
              <p className="text-xs text-gray-400">
                Format: <span className="font-mono">Name | Beschreibung | Preis</span> — Beschreibung und Preis sind optional. Zeilen mit <span className="font-mono">#</span> am Anfang werden ignoriert.
              </p>
            </div>

            {parsed.rows.length > 0 && (
              <div className="space-y-2">
                <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm">
                  <span className="font-medium text-gray-700">Vorschau</span>
                  <span className="text-green-700">{parsed.validRows.length} erkannt</span>
                  {parsed.errorCount > 0 && <span className="text-red-600">{parsed.errorCount} fehlerhaft</span>}
                </div>

                {overLimit > 0 && (
                  <div className="text-sm text-amber-800 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2">
                    Dein Gericht-Limit lässt nur noch <strong>{remainingDishes}</strong> zu — die restlichen {overLimit} werden nicht übernommen.
                  </div>
                )}

                <div className="border rounded-lg divide-y max-h-64 overflow-y-auto">
                  {parsed.rows.slice(0, PREVIEW_LIMIT).map((row) => (
                    <div key={row.lineNumber} className={`flex items-start gap-3 px-3 py-2 text-sm ${row.error ? "bg-red-50" : ""}`}>
                      <span className="w-8 shrink-0 text-xs text-gray-400 pt-0.5">{row.lineNumber}</span>
                      {row.error ? (
                        <div className="min-w-0 flex-1">
                          <p className="text-red-600 font-medium">{row.error}</p>
                          <p className="text-xs text-gray-500 truncate font-mono">{row.raw}</p>
                        </div>
                      ) : (
                        <>
                          <div className="min-w-0 flex-1">
                            <p className="font-medium text-gray-900 truncate">{row.name}</p>
                            {row.description && <p className="text-xs text-gray-500 truncate">{row.description}</p>}
                          </div>
                          <span className="shrink-0 font-mono text-gray-700">{formatPrice(row.price)}</span>
                        </>
                      )}
                    </div>
                  ))}
                  {parsed.rows.length > PREVIEW_LIMIT && <div className="px-3 py-2 text-xs text-gray-400">… und {parsed.rows.length - PREVIEW_LIMIT} weitere Zeilen</div>}
                </div>
              </div>
            )}
          </div>
        </ScrollArea>

        <DialogFooter className="gap-2 sm:gap-2">
          <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
            Abbrechen
          </Button>
          <Button type="button" onClick={handleImport} disabled={!canImport}>
            {importableRows.length > 0 ? `${importableRows.length} ${importableRows.length === 1 ? "Gericht" : "Gerichte"} übernehmen` : "Übernehmen"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export { BulkImport };
