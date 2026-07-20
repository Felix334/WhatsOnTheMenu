"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";

import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem as SelectOption } from "@/components/ui/select";

const TYPE_LABELS = { promotion: "Aktion", event: "Event", specialDish: "Tagesgericht" };

const EMPTY_FORM = { id: null, eventName: "", eventDescription: "", date: "", startTime: "", endTime: "", type: "promotion", dishId: "" };

const CalendarWin = ({ open, onOpenChange, restaurantId, dishes = [] }) => {
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState(null); // null = keine Form offen, sonst EMPTY_FORM oder Eintrag
  const [saving, setSaving] = useState(false);

  const loadEntries = () => {
    if (!restaurantId) return;
    setLoading(true);
    fetch(`/api/user/profil/calendar?restaurantId=${restaurantId}`)
      .then(async (r) => {
        const data = await r.json();
        if (!r.ok) throw new Error(data.message || "Fehler beim Laden");
        return data;
      })
      .then((data) => setEntries(data.entries || []))
      .catch((err) => toast.error("Fehler: " + err.message))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    if (open) loadEntries();
    else setForm(null);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, restaurantId]);

  const startCreate = () => setForm({ ...EMPTY_FORM });
  const startEdit = (entry) =>
    setForm({
      id: entry.id,
      eventName: entry.eventName,
      eventDescription: entry.eventDescription,
      date: entry.date?.slice(0, 10) ?? "",
      startTime: entry.startTime,
      endTime: entry.endTime,
      type: entry.type,
      dishId: entry.dishId ?? "",
    });

  const submit = async () => {
    if (!form.eventName || !form.eventDescription || !form.date || !form.startTime || !form.endTime) {
      toast.error("Bitte alle Felder ausfüllen");
      return;
    }

    setSaving(true);
    try {
      const isEdit = !!form.id;
      const res = await fetch(isEdit ? `/api/user/profil/calendar/${form.id}` : "/api/user/profil/calendar", {
        method: isEdit ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          restaurantId,
          eventName: form.eventName,
          eventDescription: form.eventDescription,
          date: form.date,
          startTime: form.startTime,
          endTime: form.endTime,
          type: form.type,
          dishId: form.type === "specialDish" && form.dishId ? form.dishId : null,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Fehler beim Speichern");

      setEntries((prev) => (isEdit ? prev.map((e) => (e.id === data.entry.id ? data.entry : e)) : [...prev, data.entry]));
      toast.success(isEdit ? "Eintrag aktualisiert!" : "Eintrag angelegt!");
      setForm(null);
    } catch (err) {
      toast.error("Fehler: " + err.message);
    } finally {
      setSaving(false);
    }
  };

  const remove = async (id) => {
    const prevEntries = entries;
    setEntries((prev) => prev.filter((e) => e.id !== id));
    try {
      const res = await fetch(`/api/user/profil/calendar/${id}?restaurantId=${restaurantId}`, { method: "DELETE" });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.message || "Fehler beim Löschen");
      }
      toast.success("Eintrag gelöscht");
    } catch (err) {
      setEntries(prevEntries);
      toast.error("Fehler: " + err.message);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Aktionen &amp; Events</DialogTitle>
          <DialogDescription>Zeige Gästen auf der Speisekarte Aktionen, Events oder ein Tagesgericht.</DialogDescription>
        </DialogHeader>

        {form ? (
          <div className="space-y-3">
            <Input placeholder="Titel" value={form.eventName} onChange={(e) => setForm({ ...form, eventName: e.target.value })} />
            <Textarea placeholder="Beschreibung" value={form.eventDescription} onChange={(e) => setForm({ ...form, eventDescription: e.target.value })} />

            <div className="grid grid-cols-3 gap-2">
              <Input type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} />
              <Input type="time" value={form.startTime} onChange={(e) => setForm({ ...form, startTime: e.target.value })} />
              <Input type="time" value={form.endTime} onChange={(e) => setForm({ ...form, endTime: e.target.value })} />
            </div>

            <Select value={form.type} onValueChange={(v) => setForm({ ...form, type: v })}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(TYPE_LABELS).map(([value, label]) => (
                  <SelectOption key={value} value={value}>
                    {label}
                  </SelectOption>
                ))}
              </SelectContent>
            </Select>

            {form.type === "specialDish" && (
              <Select value={form.dishId} onValueChange={(v) => setForm({ ...form, dishId: v })}>
                <SelectTrigger>
                  <SelectValue placeholder="Gericht auswählen" />
                </SelectTrigger>
                <SelectContent>
                  {dishes.map((d) => (
                    <SelectOption key={d.id} value={d.id}>
                      {d.name}
                    </SelectOption>
                  ))}
                </SelectContent>
              </Select>
            )}

            <div className="flex justify-between pt-2">
              <Button onClick={submit} disabled={saving}>
                {saving ? "Speichert..." : "Speichern"}
              </Button>
              <Button type="button" variant="outline" onClick={() => setForm(null)}>
                Abbrechen
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            <Button onClick={startCreate} className="w-full">
              + Neuer Eintrag
            </Button>

            {loading && <p className="text-sm text-gray-400 text-center">Laden...</p>}
            {!loading && entries.length === 0 && <p className="text-sm text-gray-400 text-center">Noch keine Einträge.</p>}

            <ul className="divide-y divide-gray-100 max-h-80 overflow-y-auto">
              {entries.map((entry) => (
                <li key={entry.id} className="flex items-center justify-between gap-3 py-2.5">
                  <div className="min-w-0">
                    <p className="text-sm font-medium truncate">{entry.eventName}</p>
                    <p className="text-xs text-gray-400">
                      {TYPE_LABELS[entry.type]} · {new Date(entry.date).toLocaleDateString("de-DE")} · {entry.startTime}–{entry.endTime}
                      {entry.dish ? ` · ${entry.dish.name}` : ""}
                    </p>
                  </div>
                  <div className="flex gap-1 shrink-0">
                    <Button size="sm" variant="outline" onClick={() => startEdit(entry)}>
                      Bearbeiten
                    </Button>
                    <Button size="sm" variant="outline" className="text-red-600" onClick={() => remove(entry.id)}>
                      Löschen
                    </Button>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export { CalendarWin };
