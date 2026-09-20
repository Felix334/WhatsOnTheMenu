"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";

import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem as SelectOption } from "@/components/ui/select";
import { useSession } from "next-auth/react";
import { CALENDAR_ENTRY_LIMITS, CALENDAR_DATE_HORIZON_DAYS, getCalendarMaxDate } from "@/lib/calendarLimits";

const TYPE_LABELS = { promotion: "Aktion", event: "Event", specialDish: "Tagesgericht" };

const EMPTY_FORM = { id: null, eventName: "", eventDescription: "", date: "", multiDay: false, endDate: "", startTime: "", endTime: "", type: "promotion", dishId: "" };

const toDateInputValue = (date) => date.toISOString().slice(0, 10);

const CalendarWin = ({ open, onOpenChange, restaurantId, dishes = [] }) => {
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState(null); // null = keine Form offen, sonst EMPTY_FORM oder Eintrag
  const { data: session } = useSession();

  const subscription = session?.user?.subscription;
  const limit = CALENDAR_ENTRY_LIMITS[subscription];
  const limitReached = !!limit && entries.length >= limit;
  const isPendingId = (id) => typeof id === "string" && id.startsWith("temp-");
  const horizonDays = CALENDAR_DATE_HORIZON_DAYS[subscription];
  const maxDate = getCalendarMaxDate(subscription);
  const maxDateStr = maxDate ? toDateInputValue(maxDate) : undefined;

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
  const startEdit = (entry) => {
    if (isPendingId(entry.id)) return;
    setForm({
      id: entry.id,
      eventName: entry.eventName,
      eventDescription: entry.eventDescription,
      date: entry.date?.slice(0, 10) ?? "",
      multiDay: !!entry.endDate,
      endDate: entry.endDate?.slice(0, 10) ?? "",
      startTime: entry.startTime ?? "",
      endTime: entry.endTime ?? "",
      type: entry.type,
      dishId: entry.dishId ?? "",
    });
  };

  const submit = async () => {
    if (!form.eventName || !form.eventDescription || !form.date) {
      toast.error("Bitte alle Felder ausfüllen");
      return;
    }
    if (form.multiDay && !form.endDate) {
      toast.error("Bitte ein Enddatum angeben");
      return;
    }
    if (!form.multiDay && !!form.startTime !== !!form.endTime) {
      toast.error("Bitte Start- und Endzeit zusammen angeben oder beide leer lassen");
      return;
    }

    const isEdit = !!form.id;
    if (!isEdit && limitReached) {
      toast.error(`Maximal ${limit} Kalender-Einträge im ${subscription}-Abo erreicht`);
      return;
    }
    if (maxDateStr && (form.date > maxDateStr || (form.multiDay && form.endDate > maxDateStr))) {
      toast.error(`Im ${subscription}-Abo können Events nur bis zu ${horizonDays} Tage im Voraus angelegt werden`);
      return;
    }

    const payload = {
      restaurantId,
      eventName: form.eventName,
      eventDescription: form.eventDescription,
      date: form.date,
      endDate: form.multiDay ? form.endDate : null,
      startTime: form.multiDay ? null : form.startTime || null,
      endTime: form.multiDay ? null : form.endTime || null,
      type: form.type,
      dishId: form.type === "specialDish" && form.dishId ? form.dishId : null,
    };

    const tempId = isEdit ? form.id : `temp-${Date.now()}`;
    const optimisticEntry = {
      ...payload,
      id: tempId,
      dish: payload.dishId ? dishes.find((d) => d.id === payload.dishId) ?? null : null,
    };
    const prevEntries = entries;

    setEntries((prev) => (isEdit ? prev.map((e) => (e.id === form.id ? optimisticEntry : e)) : [...prev, optimisticEntry]));
    setForm(null);
    try {
      const res = await fetch(isEdit ? `/api/user/profil/calendar/${form.id}` : "/api/user/profil/calendar", {
        method: isEdit ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Fehler beim Speichern");

      setEntries((prev) => prev.map((e) => (e.id === tempId ? data.entry : e)));
      toast.success(isEdit ? "Eintrag aktualisiert!" : "Eintrag angelegt!");
    } catch (err) {
      setEntries(prevEntries);
      toast.error("Fehler: " + err.message);
    }
  };

  const remove = async (id) => {
    if (isPendingId(id)) return;
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

            <label className="flex items-center gap-2 text-sm text-gray-600">
              <Checkbox checked={form.multiDay} onCheckedChange={(checked) => setForm({ ...form, multiDay: !!checked, endDate: "", startTime: "", endTime: "" })} />
              Mehrtägig (Zeitraum über mehrere Tage)
            </label>

            {form.multiDay ? (
              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-1">
                  <p className="text-xs text-gray-400">Von</p>
                  <Input type="date" max={maxDateStr} value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} />
                </div>
                <div className="space-y-1">
                  <p className="text-xs text-gray-400">Bis</p>
                  <Input type="date" max={maxDateStr} value={form.endDate} onChange={(e) => setForm({ ...form, endDate: e.target.value })} />
                </div>
              </div>
            ) : (
              <>
                <Input type="date" max={maxDateStr} value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} />
                <div className="grid grid-cols-2 gap-2">
                  <Input type="time" value={form.startTime} onChange={(e) => setForm({ ...form, startTime: e.target.value })} />
                  <Input type="time" value={form.endTime} onChange={(e) => setForm({ ...form, endTime: e.target.value })} />
                </div>
              </>
            )}
            {!!maxDateStr && <p className="text-xs text-gray-400">Im {subscription}-Abo bis zu {horizonDays} Tage im Voraus planbar (bis {new Date(maxDateStr).toLocaleDateString("de-DE")})</p>}

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
              <Button onClick={submit}>Speichern</Button>
              <Button type="button" variant="outline" onClick={() => setForm(null)}>
                Abbrechen
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            <Button onClick={startCreate} className="w-full" disabled={limitReached}>
              + Neuer Eintrag
            </Button>
            {!!limit && (
              <p className="text-xs text-gray-400 text-center">
                {entries.length}/{limit} Einträge im {subscription}-Abo genutzt
                {limitReached ? " · Limit erreicht" : ""}
              </p>
            )}

            {loading && <p className="text-sm text-gray-400 text-center">Laden...</p>}
            {!loading && entries.length === 0 && <p className="text-sm text-gray-400 text-center">Noch keine Einträge.</p>}

            <ul className="divide-y divide-gray-100 max-h-80 overflow-y-auto">
              {entries.map((entry) => {
                const pending = isPendingId(entry.id);
                return (
                  <li key={entry.id} className={`flex items-center justify-between gap-3 py-2.5 ${pending ? "opacity-50" : ""}`}>
                    <div className="min-w-0">
                      <p className="text-sm font-medium truncate">{entry.eventName}</p>
                      <p className="text-xs text-gray-400">
                        {TYPE_LABELS[entry.type]} · {entry.endDate ? `${new Date(entry.date).toLocaleDateString("de-DE")}–${new Date(entry.endDate).toLocaleDateString("de-DE")}` : `${new Date(entry.date).toLocaleDateString("de-DE")} · ${entry.startTime && entry.endTime ? `${entry.startTime}–${entry.endTime}` : "Ganztägig"}`}
                        {entry.dish ? ` · ${entry.dish.name}` : ""}
                      </p>
                    </div>
                    <div className="flex gap-1 shrink-0 items-center">
                      {pending ? (
                        <span className="text-xs text-gray-400">Speichert...</span>
                      ) : (
                        <>
                          <Button size="sm" variant="outline" onClick={() => startEdit(entry)}>
                            Bearbeiten
                          </Button>
                          <Button size="sm" variant="outline" className="text-red-600" onClick={() => remove(entry.id)}>
                            Löschen
                          </Button>
                        </>
                      )}
                    </div>
                  </li>
                );
              })}
            </ul>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export { CalendarWin };
