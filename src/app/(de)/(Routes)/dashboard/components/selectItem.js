import React, { useEffect, useMemo, useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";

import { Input } from "@/components/ui/input";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, Trash2 } from "lucide-react";

import { ALLERGENS } from "@/lib/allergens";
import { ADDITIVES, DISH_TAGS, MAX_DISH_VARIANTS, SPICE_LEVELS } from "@/lib/dishInfo";
import { dishDetailsSchema } from "@/lib/schemas/dish";
import { useUiLanguage } from "@/app/components/useUiLanguage";
import { fmt } from "@/i18n/format";

const formatPrice = (value) => (value !== null && value !== undefined && value !== "" ? Number(value).toFixed(2).replace(".", ",") : "");

const toFormValues = (item) => ({
  name: item?.name ?? "",
  description: item?.description ?? "",
  price: formatPrice(item?.price ?? 0),
  allergens: item?.allergens ?? [],
  additives: item?.additives ?? [],
  tags: item?.tags ?? [],
  spiceLevel: item?.spiceLevel ?? 0,
  variants: (item?.variants ?? []).map((v) => ({ label: v.label, price: formatPrice(v.price) })),
});

// Erste Fehlermeldung aus dem (verschachtelten) react-hook-form-Fehlerobjekt,
// z. B. errors.variants[1].price.message
const firstErrorMessage = (node) => {
  if (!node || typeof node !== "object") return null;
  if (typeof node.message === "string" && node.message) return node.message;
  for (const child of Object.values(node)) {
    if (child === node.ref) continue;
    const msg = firstErrorMessage(child);
    if (msg) return msg;
  }
  return null;
};

// Die Meldungen von dishDetailsSchema sind deutsch (das Schema prüft auch
// serverseitig). Für die Oberfläche werden sie über dashboard.dish.schemaErrors
// übersetzt — Schlüssel ist der deutsche Text, unbekannte bleiben stehen.
const translateErrors = (node, map) => {
  if (!node || typeof node !== "object") return node;
  for (const [key, child] of Object.entries(node)) {
    if (key === "ref") continue;
    if (key === "message" && typeof child === "string") node.message = map[child] ?? child;
    else translateErrors(child, map);
  }
  return node;
};

/**
 * Checkbox-Liste für ein Enum-Array-Feld (Allergene, Zusatzstoffe, Merkmale).
 * `renderLabel` liefert den sichtbaren Text je Eintrag.
 */
const CheckboxGroup = ({ control, name, options, renderLabel, columns = "grid-cols-1 sm:grid-cols-2" }) => (
  <FormField
    control={control}
    name={name}
    render={({ field }) => {
      const value = field.value ?? [];
      const toggle = (key) => field.onChange(value.includes(key) ? value.filter((k) => k !== key) : [...value, key]);
      return (
        <FormItem>
          <div className={`grid ${columns} gap-x-4 gap-y-2`}>
            {options.map((opt) => (
              <label key={opt.key} className="flex items-start gap-2 text-sm cursor-pointer leading-tight">
                <Checkbox checked={value.includes(opt.key)} onCheckedChange={() => toggle(opt.key)} className="mt-0.5" />
                <span>{renderLabel(opt)}</span>
              </label>
            ))}
          </div>
          <FormMessage />
        </FormItem>
      );
    }}
  />
);

/**
 * Dialog "Gericht bearbeiten": alle Angaben eines Gerichts in einem Formular
 * mit einem Speichern-Knopf (api/user/profil/updateDish). Früher wurden
 * Allergene separat gespeichert — wer nur "Gericht aktualisieren" drückte,
 * verlor angehakte Allergene.
 */
const SelectItem = ({ open, onOpenChange, selectedItem, setChangedItem, restaurantId }) => {
  const { t: uiDict, locale } = useUiLanguage();
  const t = uiDict.dashboard;
  const td = t.dish;
  const tr = (de, en) => (locale === "de" ? de : (en ?? de));
  const resolver = useMemo(() => {
    const base = zodResolver(dishDetailsSchema);
    return async (...args) => {
      const result = await base(...args);
      translateErrors(result.errors, td.schemaErrors);
      return result;
    };
  }, [td]);
  const [saving, setSaving] = useState(false);
  const [tab, setTab] = useState("general");

  const form = useForm({
    resolver,
    defaultValues: toFormValues(selectedItem),
  });
  const { control, handleSubmit, reset, setValue, watch } = form;
  const { fields: variantFields, append: appendVariant, remove: removeVariant } = useFieldArray({ control, name: "variants" });

  useEffect(() => {
    if (open && selectedItem) {
      reset(toFormValues(selectedItem));
      setTab("general");
    }
  }, [open, selectedItem, reset]);

  const hasVariants = variantFields.length > 0;
  const spiceLevel = watch("spiceLevel");

  const onValid = async (data) => {
    if (!selectedItem?.id || !restaurantId) {
      toast.error(td.configError);
      return;
    }

    setSaving(true);
    try {
      const resp = await fetch("/api/user/profil/updateDish", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ dishId: selectedItem.id, dish: data }),
      });
      const result = await resp.json().catch(() => ({}));
      if (!resp.ok) throw new Error(result.error || `${t.moveDish.errorStatus} ${resp.status}`);

      setChangedItem(result.dish);
      onOpenChange(false);
      toast.success(td.saved);
    } catch (error) {
      toast.error(t.page.saveFailed + error.message);
    } finally {
      setSaving(false);
    }
  };

  // Fehler können in einem gerade nicht sichtbaren Tab stecken — deshalb als Toast melden.
  const onInvalid = (errors) => {
    toast.error(firstErrorMessage(errors) || td.checkFields);
  };

  const submit = (e) => {
    e?.preventDefault();
    // Mit Varianten ist der Einzelpreis ausgeblendet; der Server setzt ihn auf
    // den kleinsten Variantenpreis. Hier nur einen gültigen Wert eintragen,
    // damit die Validierung nicht an einem unsichtbaren Feld scheitert.
    const variants = form.getValues("variants");
    if (variants?.length) setValue("price", variants[0]?.price || "0");
    handleSubmit(onValid, onInvalid)();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{td.title}</DialogTitle>
          <DialogDescription>{td.description}</DialogDescription>
        </DialogHeader>

        {selectedItem ? (
          <Form {...form}>
            <form onSubmit={submit} className="space-y-4">
              <Tabs value={tab} onValueChange={setTab}>
                <TabsList className="w-full">
                  <TabsTrigger value="general">{td.tabGeneral}</TabsTrigger>
                  <TabsTrigger value="variants">{td.tabVariants}{hasVariants ? ` (${variantFields.length})` : ""}</TabsTrigger>
                  <TabsTrigger value="labels">{td.tabLabels}</TabsTrigger>
                </TabsList>

                {/* ── Allgemein ─────────────────────────────────────────── */}
                <TabsContent value="general" className="space-y-4 pt-2">
                  <FormField
                    control={control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t.style.name}</FormLabel>
                        <FormControl>
                          <Input placeholder={td.namePlaceholder} {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{td.descriptionLabel}</FormLabel>
                        <FormControl>
                          <Textarea placeholder={td.descriptionPlaceholder} rows={3} {...field} value={field.value ?? ""} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  {hasVariants ? (
                    <p className="text-sm text-gray-500">
                      {fmt(td.priceFromVariants, { price: formatPrice(Math.min(...(watch("variants") ?? []).map((v) => Number(String(v.price).replace(",", ".")) || 0))) })}
                    </p>
                  ) : (
                    <FormField
                      control={control}
                      name="price"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{td.price}</FormLabel>
                          <FormControl>
                            <div className="flex items-center gap-2">
                              <Input type="text" inputMode="decimal" placeholder={td.pricePlaceholder} className="w-28" {...field} />
                              <span className="text-gray-600">€</span>
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  )}

                  <div className="space-y-2">
                    <p className="text-sm font-medium">{td.tags}</p>
                    <CheckboxGroup
                      control={control}
                      name="tags"
                      options={DISH_TAGS}
                      renderLabel={(tag) => (
                        <>
                          {tag.icon} {tr(tag.name, tag.nameEn)}
                        </>
                      )}
                    />
                  </div>

                  <div className="space-y-2">
                    <p className="text-sm font-medium">{td.spice}</p>
                    <div className="flex flex-wrap gap-2">
                      {SPICE_LEVELS.map(({ value, label, labelEn }) => (
                        <Button key={value} type="button" size="sm" variant={spiceLevel === value ? "default" : "outline"} onClick={() => setValue("spiceLevel", value, { shouldDirty: true })}>
                          {value > 0 ? "🌶️".repeat(value) + " " : ""}
                          {tr(label, labelEn)}
                        </Button>
                      ))}
                    </div>
                  </div>
                </TabsContent>

                {/* ── Größen & Preise ───────────────────────────────────── */}
                <TabsContent value="variants" className="space-y-3 pt-2">
                  <p className="text-sm text-gray-500">{td.variantsHint}</p>

                  {variantFields.map((variant, index) => (
                    <div key={variant.id} className="flex items-start gap-2">
                      <FormField
                        control={control}
                        name={`variants.${index}.label`}
                        render={({ field }) => (
                          <FormItem className="flex-1">
                            <FormControl>
                              <Input placeholder={td.variantLabelPlaceholder} {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={control}
                        name={`variants.${index}.price`}
                        render={({ field }) => (
                          <FormItem>
                            <FormControl>
                              <div className="flex items-center gap-1">
                                <Input type="text" inputMode="decimal" placeholder={td.price} className="w-24" {...field} />
                                <span className="text-gray-600">€</span>
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <Button type="button" size="icon" variant="ghost" className="text-red-500" title={td.removeVariant} onClick={() => removeVariant(index)}>
                        <Trash2 className="size-4" />
                      </Button>
                    </div>
                  ))}

                  <FormField control={control} name="variants" render={() => <FormMessage />} />

                  {variantFields.length < MAX_DISH_VARIANTS && (
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        // Die erste Größe übernimmt den bisherigen Preis — so ändert
                        // sich beim Anlegen nichts an der Karte, bis man ihn anpasst.
                        appendVariant({ label: "", price: variantFields.length === 0 ? form.getValues("price") : "" })
                      }
                    >
                      <Plus className="size-4" />
                      {td.addVariant}
                    </Button>
                  )}
                </TabsContent>

                {/* ── Kennzeichnung ─────────────────────────────────────── */}
                <TabsContent value="labels" className="space-y-5 pt-2">
                  <div className="space-y-2">
                    <p className="text-sm font-medium">{td.allergens}</p>
                    <CheckboxGroup
                      control={control}
                      name="allergens"
                      options={ALLERGENS}
                      renderLabel={(a) => (
                        <>
                          <span className="font-medium">
                            ({a.id}) {tr(a.name, a.nameEn)}
                          </span>
                          {a.description && <span className="block text-xs text-gray-400">{tr(a.description, a.descriptionEn)}</span>}
                        </>
                      )}
                    />
                  </div>

                  <div className="space-y-2">
                    <p className="text-sm font-medium">{td.additives}</p>
                    <CheckboxGroup
                      control={control}
                      name="additives"
                      options={ADDITIVES}
                      renderLabel={(a) => (
                        <>
                          <span className="font-medium">({a.id})</span> {tr(a.name, a.nameEn)}
                        </>
                      )}
                    />
                  </div>
                </TabsContent>
              </Tabs>

              <DialogFooter className="gap-2">
                <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={saving}>
                  {t.common.cancel}
                </Button>
                <Button type="submit" disabled={saving}>
                  {saving ? t.common.saving : t.common.save}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        ) : (
          <div className="text-gray-500 text-sm">{td.noneSelected}</div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export { SelectItem };
