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
import { useUiLanguage } from "@/app/components/useUiLanguage";
import { fmt, plural } from "@/i18n/format";

const PREVIEW_LIMIT = 50;

/**
 * Schnellerfassung: ganze Kategorien per Copy&Paste anlegen, statt jedes
 * Gericht einzeln über das Formular zu tippen.
 *
 * Übergibt das Ergebnis als `menuSection`-Eintrag an den Editor — gespeichert
 * wird es wie jede andere Neuanlage über die Speichern-Leiste (setData).
 */
const BulkImport = ({ open, onOpenChange, categoryGroupNames, categoryNames, remainingDishes, onImport }) => {
  const { t: uiDict } = useUiLanguage();
  const t = uiDict.dashboard;
  const tb = t.bulkImport;
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

    toast.success(plural(importableRows.length, tb.importedOne, tb.importedOther));
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
          <DialogTitle>{tb.title}</DialogTitle>
          <DialogDescription>
            {tb.descriptionBefore}<code className="px-1 rounded bg-gray-100">|</code>{tb.descriptionAfter}
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className="flex-1 -mx-1 px-1">
          <div className="space-y-4 pb-1">
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="bulk-group">{t.editor.group} *</Label>
                <Input id="bulk-group" list="bulkCategoryGroup" autoComplete="off" placeholder={tb.groupPlaceholder} value={groupName} onChange={(e) => setGroupName(e.target.value)} />
                <datalist id="bulkCategoryGroup">
                  {categoryGroupNames.map((name) => (
                    <option key={name} value={name} />
                  ))}
                </datalist>
              </div>
              <div className="space-y-2">
                <Label htmlFor="bulk-category">{t.editor.category} *</Label>
                <Input id="bulk-category" list="bulkCategoryNames" autoComplete="off" placeholder={tb.categoryPlaceholder} value={categoryName} onChange={(e) => setCategoryName(e.target.value)} />
                <datalist id="bulkCategoryNames">
                  {categoryNames.map((name) => (
                    <option key={name} value={name} />
                  ))}
                </datalist>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="bulk-text">{tb.dishes}</Label>
              <Textarea id="bulk-text" rows={9} spellCheck={false} placeholder={tb.example} value={text} onChange={(e) => setText(e.target.value)} className="font-mono text-sm" />
              <p className="text-xs text-gray-400">
                {tb.formatBefore}<span className="font-mono">{tb.formatColumns}</span>{tb.formatMiddle}<span className="font-mono">#</span>{tb.formatAfter}
              </p>
            </div>

            {parsed.rows.length > 0 && (
              <div className="space-y-2">
                <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm">
                  <span className="font-medium text-gray-700">{tb.preview}</span>
                  <span className="text-green-700">{fmt(tb.recognized, { n: parsed.validRows.length })}</span>
                  {parsed.errorCount > 0 && <span className="text-red-600">{fmt(tb.faulty, { n: parsed.errorCount })}</span>}
                </div>

                {overLimit > 0 && (
                  <div className="text-sm text-amber-800 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2">
                    {tb.limitBefore}<strong>{remainingDishes}</strong>{fmt(tb.limitAfter, { n: overLimit })}
                  </div>
                )}

                <div className="border rounded-lg divide-y max-h-64 overflow-y-auto">
                  {parsed.rows.slice(0, PREVIEW_LIMIT).map((row) => (
                    <div key={row.lineNumber} className={`flex items-start gap-3 px-3 py-2 text-sm ${row.error ? "bg-red-50" : ""}`}>
                      <span className="w-8 shrink-0 text-xs text-gray-400 pt-0.5">{row.lineNumber}</span>
                      {row.error ? (
                        <div className="min-w-0 flex-1">
                          <p className="text-red-600 font-medium">{fmt(tb.errors[row.error] ?? row.error, { value: row.errorValue })}</p>
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
                  {parsed.rows.length > PREVIEW_LIMIT && <div className="px-3 py-2 text-xs text-gray-400">{fmt(tb.moreRows, { n: parsed.rows.length - PREVIEW_LIMIT })}</div>}
                </div>
              </div>
            )}
          </div>
        </ScrollArea>

        <DialogFooter className="gap-2 sm:gap-2">
          <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
            {t.common.cancel}
          </Button>
          <Button type="button" onClick={handleImport} disabled={!canImport}>
            {importableRows.length > 0 ? plural(importableRows.length, tb.importOne, tb.importOther) : tb.import}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export { BulkImport };
