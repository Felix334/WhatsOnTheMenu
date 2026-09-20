"use client";

import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";

import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem as SelectOption } from "@/components/ui/select";

const EMPTY_ITEM_FORM = { id: null, name: "", unit: "", currentStock: "", minStock: "", costPerUnit: "", supplierId: "" };
const EMPTY_SUPPLIER_FORM = { id: null, name: "", contactName: "", phone: "", email: "", website: "", street: "", houseNumber: "", postalCode: "", city: "", country: "", monthlyCost: "", notes: "" };

const formatEUR = (value) => Number(value ?? 0).toLocaleString("de-DE", { style: "currency", currency: "EUR" });

const InventoryWin = ({ open, onOpenChange, restaurantId }) => {
  const [items, setItems] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [itemForm, setItemForm] = useState(null);
  const [supplierForm, setSupplierForm] = useState(null);

  const isPendingId = (id) => typeof id === "string" && id.startsWith("temp-");

  const loadAll = () => {
    if (!restaurantId) return;
    setLoading(true);
    Promise.all([
      fetch(`/api/user/profil/inventory?restaurantId=${restaurantId}`).then(async (r) => {
        const data = await r.json();
        if (!r.ok) throw new Error(data.message || "Fehler beim Laden");
        return data.items || [];
      }),
      fetch(`/api/user/profil/suppliers?restaurantId=${restaurantId}`).then(async (r) => {
        const data = await r.json();
        if (!r.ok) throw new Error(data.message || "Fehler beim Laden");
        return data.suppliers || [];
      }),
    ])
      .then(([itemsData, suppliersData]) => {
        setItems(itemsData);
        setSuppliers(suppliersData);
      })
      .catch((err) => toast.error("Fehler: " + err.message))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    if (open) loadAll();
    else {
      setItemForm(null);
      setSupplierForm(null);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, restaurantId]);

  // ── Bestand ────────────────────────────────────────────────────────────
  const startCreateItem = () => setItemForm({ ...EMPTY_ITEM_FORM });
  const startEditItem = (item) => {
    if (isPendingId(item.id)) return;
    setItemForm({
      id: item.id,
      name: item.name,
      unit: item.unit,
      currentStock: String(item.currentStock),
      minStock: String(item.minStock),
      costPerUnit: String(item.costPerUnit),
      supplierId: item.supplierId ?? "",
    });
  };

  const submitItem = async () => {
    if (!itemForm.name || !itemForm.unit || itemForm.currentStock === "" || itemForm.minStock === "" || itemForm.costPerUnit === "") {
      toast.error("Bitte alle Pflichtfelder ausfüllen");
      return;
    }

    const isEdit = !!itemForm.id;
    const payload = {
      restaurantId,
      name: itemForm.name,
      unit: itemForm.unit,
      currentStock: itemForm.currentStock,
      minStock: itemForm.minStock,
      costPerUnit: itemForm.costPerUnit,
      supplierId: itemForm.supplierId || null,
    };

    const tempId = isEdit ? itemForm.id : `temp-${Date.now()}`;
    const optimisticItem = {
      ...payload,
      id: tempId,
      supplier: payload.supplierId ? (suppliers.find((s) => s.id === payload.supplierId) ?? null) : null,
    };
    const prevItems = items;

    setItems((prev) => (isEdit ? prev.map((i) => (i.id === itemForm.id ? optimisticItem : i)) : [...prev, optimisticItem]));
    setItemForm(null);
    try {
      const res = await fetch(isEdit ? `/api/user/profil/inventory/${itemForm.id}` : "/api/user/profil/inventory", {
        method: isEdit ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Fehler beim Speichern");

      setItems((prev) => prev.map((i) => (i.id === tempId ? data.item : i)));
      toast.success(isEdit ? "Item aktualisiert!" : "Item angelegt!");
    } catch (err) {
      setItems(prevItems);
      toast.error("Fehler: " + err.message);
    }
  };

  const removeItem = async (id) => {
    if (isPendingId(id)) return;
    const prevItems = items;
    setItems((prev) => prev.filter((i) => i.id !== id));
    try {
      const res = await fetch(`/api/user/profil/inventory/${id}?restaurantId=${restaurantId}`, { method: "DELETE" });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.message || "Fehler beim Löschen");
      }
      toast.success("Item gelöscht");
    } catch (err) {
      setItems(prevItems);
      toast.error("Fehler: " + err.message);
    }
  };

  // ── Einkaufsliste (rein clientseitig berechnet) ───────────────────────────
  const shoppingList = useMemo(() => {
    return items
      .filter((item) => Number(item.currentStock) < Number(item.minStock))
      .map((item) => {
        const neededQty = Number(item.minStock) - Number(item.currentStock);
        return { ...item, neededQty, neededCost: neededQty * Number(item.costPerUnit) };
      });
  }, [items]);

  const shoppingListTotal = shoppingList.reduce((sum, item) => sum + item.neededCost, 0);

  // ── Lieferanten ────────────────────────────────────────────────────────
  const startCreateSupplier = () => setSupplierForm({ ...EMPTY_SUPPLIER_FORM });
  const startEditSupplier = (supplier) => {
    if (isPendingId(supplier.id)) return;
    setSupplierForm({
      id: supplier.id,
      name: supplier.name,
      contactName: supplier.contactName ?? "",
      phone: supplier.phone ?? "",
      email: supplier.email ?? "",
      website: supplier.website ?? "",
      street: supplier.street ?? "",
      houseNumber: supplier.houseNumber ?? "",
      postalCode: supplier.postalCode ?? "",
      city: supplier.city ?? "",
      country: supplier.country ?? "",
      monthlyCost: supplier.monthlyCost != null ? String(supplier.monthlyCost) : "",
      notes: supplier.notes ?? "",
    });
  };

  const submitSupplier = async () => {
    if (!supplierForm.name) {
      toast.error("Bitte einen Namen angeben");
      return;
    }

    const isEdit = !!supplierForm.id;
    const payload = { restaurantId, ...supplierForm };
    delete payload.id;

    const tempId = isEdit ? supplierForm.id : `temp-${Date.now()}`;
    const optimisticSupplier = { ...payload, id: tempId };
    const prevSuppliers = suppliers;

    setSuppliers((prev) => (isEdit ? prev.map((s) => (s.id === supplierForm.id ? optimisticSupplier : s)) : [...prev, optimisticSupplier]));
    setSupplierForm(null);
    try {
      const res = await fetch(isEdit ? `/api/user/profil/suppliers/${supplierForm.id}` : "/api/user/profil/suppliers", {
        method: isEdit ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Fehler beim Speichern");

      setSuppliers((prev) => prev.map((s) => (s.id === tempId ? data.supplier : s)));
      toast.success(isEdit ? "Lieferant aktualisiert!" : "Lieferant angelegt!");
    } catch (err) {
      setSuppliers(prevSuppliers);
      toast.error("Fehler: " + err.message);
    }
  };

  const removeSupplier = async (id) => {
    if (isPendingId(id)) return;
    const prevSuppliers = suppliers;
    const prevItems = items;
    setSuppliers((prev) => prev.filter((s) => s.id !== id));
    // Items mit diesem Lieferanten werden serverseitig lieferantenlos (SetNull) — lokal spiegeln
    setItems((prev) => prev.map((i) => (i.supplierId === id ? { ...i, supplierId: null, supplier: null } : i)));
    try {
      const res = await fetch(`/api/user/profil/suppliers/${id}?restaurantId=${restaurantId}`, { method: "DELETE" });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.message || "Fehler beim Löschen");
      toast.success(data.message || "Lieferant gelöscht");
    } catch (err) {
      setSuppliers(prevSuppliers);
      setItems(prevItems);
      toast.error("Fehler: " + err.message);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>Inventar</DialogTitle>
          <DialogDescription>Bestand, Einkaufsliste und Lieferanten für dein Restaurant.</DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="stock">
          <TabsList>
            <TabsTrigger value="stock">Bestand</TabsTrigger>
            <TabsTrigger value="shopping">Einkaufsliste{shoppingList.length > 0 ? ` (${shoppingList.length})` : ""}</TabsTrigger>
            <TabsTrigger value="suppliers">Lieferanten</TabsTrigger>
          </TabsList>

          {/* ── Bestand ── */}
          <TabsContent value="stock" className="space-y-3">
            {itemForm ? (
              <div className="space-y-3">
                <Input placeholder="Name (z.B. Mehl)" value={itemForm.name} onChange={(e) => setItemForm({ ...itemForm, name: e.target.value })} />
                <div className="grid grid-cols-2 gap-2">
                  <Input placeholder="Einheit (z.B. kg)" value={itemForm.unit} onChange={(e) => setItemForm({ ...itemForm, unit: e.target.value })} />
                  <Select value={itemForm.supplierId || "none"} onValueChange={(v) => setItemForm({ ...itemForm, supplierId: v === "none" ? "" : v })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Lieferant (optional)" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectOption value="none">Kein Lieferant</SelectOption>
                      {suppliers.map((s) => (
                        <SelectOption key={s.id} value={s.id}>
                          {s.name}
                        </SelectOption>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  <div className="space-y-1">
                    <p className="text-xs text-gray-400">Bestand</p>
                    <Input type="number" step="0.01" min="0" value={itemForm.currentStock} onChange={(e) => setItemForm({ ...itemForm, currentStock: e.target.value })} />
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs text-gray-400">Mindestbestand</p>
                    <Input type="number" step="0.01" min="0" value={itemForm.minStock} onChange={(e) => setItemForm({ ...itemForm, minStock: e.target.value })} />
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs text-gray-400">Preis/Einheit (€)</p>
                    <Input type="number" step="0.01" min="0" value={itemForm.costPerUnit} onChange={(e) => setItemForm({ ...itemForm, costPerUnit: e.target.value })} />
                  </div>
                </div>
                <div className="flex justify-between pt-2">
                  <Button onClick={submitItem}>Speichern</Button>
                  <Button type="button" variant="outline" onClick={() => setItemForm(null)}>
                    Abbrechen
                  </Button>
                </div>
              </div>
            ) : (
              <Button onClick={startCreateItem} className="w-full">
                + Neues Item
              </Button>
            )}

            {loading && <p className="text-sm text-gray-400 text-center">Laden...</p>}
            {!loading && items.length === 0 && <p className="text-sm text-gray-400 text-center">Noch keine Items.</p>}

            <ul className="divide-y divide-gray-100 max-h-72 overflow-y-auto">
              {items.map((item) => {
                const pending = isPendingId(item.id);
                const low = Number(item.currentStock) < Number(item.minStock);
                return (
                  <li key={item.id} className={`flex items-center justify-between gap-3 py-2.5 ${pending ? "opacity-50" : ""}`}>
                    <div className="min-w-0">
                      <p className={`text-sm font-medium truncate ${low ? "text-amber-700" : ""}`}>{item.name}</p>
                      <p className="text-xs text-gray-400">
                        {Number(item.currentStock)} / {Number(item.minStock)} {item.unit} · {formatEUR(item.costPerUnit)}/{item.unit}
                        {item.supplier ? ` · ${item.supplier.name}` : ""}
                      </p>
                    </div>
                    <div className="flex gap-1 shrink-0 items-center">
                      {pending ? (
                        <span className="text-xs text-gray-400">Speichert...</span>
                      ) : (
                        <>
                          <Button size="sm" variant="outline" onClick={() => startEditItem(item)}>
                            Bearbeiten
                          </Button>
                          <Button size="sm" variant="outline" className="text-red-600" onClick={() => removeItem(item.id)}>
                            Löschen
                          </Button>
                        </>
                      )}
                    </div>
                  </li>
                );
              })}
            </ul>
          </TabsContent>

          {/* ── Einkaufsliste ── */}
          <TabsContent value="shopping" className="space-y-3">
            {shoppingList.length === 0 ? (
              <p className="text-sm text-gray-400 text-center py-6">Alles auf Lager — nichts muss nachbestellt werden.</p>
            ) : (
              <>
                <ul className="divide-y divide-gray-100 max-h-72 overflow-y-auto">
                  {shoppingList.map((item) => (
                    <li key={item.id} className="flex items-center justify-between gap-3 py-2.5">
                      <div className="min-w-0">
                        <p className="text-sm font-medium truncate">{item.name}</p>
                        <p className="text-xs text-gray-400">
                          Bedarf: {item.neededQty} {item.unit}
                          {item.supplier ? ` · ${item.supplier.name}` : ""}
                        </p>
                      </div>
                      <span className="text-sm font-medium shrink-0">{formatEUR(item.neededCost)}</span>
                    </li>
                  ))}
                </ul>
                <div className="flex justify-between items-center border-t pt-3">
                  <span className="text-sm font-semibold">Gesamt</span>
                  <span className="text-sm font-semibold">{formatEUR(shoppingListTotal)}</span>
                </div>
              </>
            )}
          </TabsContent>

          {/* ── Lieferanten ── */}
          <TabsContent value="suppliers" className="space-y-3">
            {supplierForm ? (
              <div className="space-y-3">
                <Input placeholder="Name" value={supplierForm.name} onChange={(e) => setSupplierForm({ ...supplierForm, name: e.target.value })} />
                <div className="grid grid-cols-2 gap-2">
                  <Input placeholder="Ansprechpartner" value={supplierForm.contactName} onChange={(e) => setSupplierForm({ ...supplierForm, contactName: e.target.value })} />
                  <Input placeholder="Telefon" value={supplierForm.phone} onChange={(e) => setSupplierForm({ ...supplierForm, phone: e.target.value })} />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <Input type="email" placeholder="E-Mail" value={supplierForm.email} onChange={(e) => setSupplierForm({ ...supplierForm, email: e.target.value })} />
                  <Input placeholder="Website" value={supplierForm.website} onChange={(e) => setSupplierForm({ ...supplierForm, website: e.target.value })} />
                </div>
                <div className="grid grid-cols-4 gap-2">
                  <Input className="col-span-2" placeholder="Straße" value={supplierForm.street} onChange={(e) => setSupplierForm({ ...supplierForm, street: e.target.value })} />
                  <Input placeholder="Hausnr." value={supplierForm.houseNumber} onChange={(e) => setSupplierForm({ ...supplierForm, houseNumber: e.target.value })} />
                  <Input placeholder="PLZ" value={supplierForm.postalCode} onChange={(e) => setSupplierForm({ ...supplierForm, postalCode: e.target.value })} />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <Input placeholder="Stadt" value={supplierForm.city} onChange={(e) => setSupplierForm({ ...supplierForm, city: e.target.value })} />
                  <Input placeholder="Land" value={supplierForm.country} onChange={(e) => setSupplierForm({ ...supplierForm, country: e.target.value })} />
                </div>
                <div className="space-y-1">
                  <p className="text-xs text-gray-400">Monatliche Kosten (€, optional — z.B. Vertrag/Abo)</p>
                  <Input type="number" step="0.01" min="0" value={supplierForm.monthlyCost} onChange={(e) => setSupplierForm({ ...supplierForm, monthlyCost: e.target.value })} />
                </div>
                <Textarea placeholder="Notizen" value={supplierForm.notes} onChange={(e) => setSupplierForm({ ...supplierForm, notes: e.target.value })} />
                <div className="flex justify-between pt-2">
                  <Button onClick={submitSupplier}>Speichern</Button>
                  <Button type="button" variant="outline" onClick={() => setSupplierForm(null)}>
                    Abbrechen
                  </Button>
                </div>
              </div>
            ) : (
              <Button onClick={startCreateSupplier} className="w-full">
                + Neuer Lieferant
              </Button>
            )}

            {loading && <p className="text-sm text-gray-400 text-center">Laden...</p>}
            {!loading && suppliers.length === 0 && <p className="text-sm text-gray-400 text-center">Noch keine Lieferanten.</p>}

            <ul className="divide-y divide-gray-100 max-h-72 overflow-y-auto">
              {suppliers.map((supplier) => {
                const pending = isPendingId(supplier.id);
                return (
                  <li key={supplier.id} className={`flex items-center justify-between gap-3 py-2.5 ${pending ? "opacity-50" : ""}`}>
                    <div className="min-w-0">
                      <p className="text-sm font-medium truncate">{supplier.name}</p>
                      <p className="text-xs text-gray-400 truncate">
                        {[supplier.contactName, supplier.phone, supplier.email].filter(Boolean).join(" · ") || "Keine Kontaktdaten"}
                        {supplier.monthlyCost != null && supplier.monthlyCost !== "" ? ` · ${formatEUR(supplier.monthlyCost)}/Monat` : ""}
                      </p>
                    </div>
                    <div className="flex gap-1 shrink-0 items-center">
                      {pending ? (
                        <span className="text-xs text-gray-400">Speichert...</span>
                      ) : (
                        <>
                          <Button size="sm" variant="outline" onClick={() => startEditSupplier(supplier)}>
                            Bearbeiten
                          </Button>
                          <Button size="sm" variant="outline" className="text-red-600" onClick={() => removeSupplier(supplier.id)}>
                            Löschen
                          </Button>
                        </>
                      )}
                    </div>
                  </li>
                );
              })}
            </ul>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export { InventoryWin };
