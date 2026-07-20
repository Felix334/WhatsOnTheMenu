"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { useSession } from "next-auth/react";
import Link from "next/link";

const TYPE_LABELS = { promotion: "Aktion", event: "Event", specialDish: "Tagesgericht" };
const EMPTY_FORM = { id: null, eventName: "", eventDescription: "", date: "", startTime: "", endTime: "", type: "promotion", dishId: "" };

function CalendarContent() {
  const searchParams = useSearchParams();
  const restaurantID = searchParams.get("restaurantID");

  const [entries, setEntries] = useState([]);
  const [dishes, setDishes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [form, setForm] = useState(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!restaurantID) {
      setError("Keine Restaurant-ID");
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);
    Promise.all([
      fetch(`/api/user/profil/calendar?restaurantId=${restaurantID}`).then(async (r) => {
        const data = await r.json();
        if (!r.ok) throw new Error(data.message || "Fehler beim Laden");
        return data.entries || [];
      }),
      fetch(`/api/staff/availability/${restaurantID}`).then(async (r) => {
        const data = await r.json();
        if (!r.ok) return [];
        return (data.menu?.categoryGroup ?? []).flatMap((cg) => cg.categories.flatMap((c) => c.dishes));
      }),
    ])
      .then(([entriesData, dishesData]) => {
        setEntries(entriesData);
        setDishes(dishesData);
      })
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, [restaurantID]);

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
    if (!form.eventName || !form.eventDescription || !form.date || !form.startTime || !form.endTime) return;

    setSaving(true);
    try {
      const isEdit = !!form.id;
      const res = await fetch(isEdit ? `/api/user/profil/calendar/${form.id}` : "/api/user/profil/calendar", {
        method: isEdit ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          restaurantId: restaurantID,
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
      setForm(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const remove = async (id) => {
    const prevEntries = entries;
    setEntries((prev) => prev.filter((e) => e.id !== id));
    try {
      const res = await fetch(`/api/user/profil/calendar/${id}?restaurantId=${restaurantID}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Fehler beim Löschen");
    } catch {
      setEntries(prevEntries);
    }
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center text-gray-400">Laden...</div>;
  }

  if (!restaurantID || error) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="max-w-sm w-full bg-white rounded-2xl border border-red-200 p-6 text-center space-y-4 shadow-sm">
          <p className="text-3xl">⚠️</p>
          <p className="font-semibold text-gray-800">{error ?? "Kein Restaurant angegeben."}</p>
          <Link href="/staff" className="block w-full bg-gray-900 text-white font-semibold rounded-xl px-4 py-3 hover:bg-gray-700 transition-colors">
            Zurück zum Dashboard
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-2xl mx-auto space-y-6">
        <div className="flex items-center gap-4">
          <Link href="/staff" className="p-2 rounded-xl hover:bg-gray-100 transition-colors text-gray-500">
            ← Zurück
          </Link>
          <h1 className="text-xl font-bold text-gray-900">Aktionen &amp; Events</h1>
        </div>

        {form ? (
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-5 space-y-3">
            <input className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm" placeholder="Titel" value={form.eventName} onChange={(e) => setForm({ ...form, eventName: e.target.value })} />
            <textarea className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm" placeholder="Beschreibung" value={form.eventDescription} onChange={(e) => setForm({ ...form, eventDescription: e.target.value })} />
            <div className="grid grid-cols-3 gap-2">
              <input type="date" className="border border-gray-200 rounded-xl px-3 py-2 text-sm" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} />
              <input type="time" className="border border-gray-200 rounded-xl px-3 py-2 text-sm" value={form.startTime} onChange={(e) => setForm({ ...form, startTime: e.target.value })} />
              <input type="time" className="border border-gray-200 rounded-xl px-3 py-2 text-sm" value={form.endTime} onChange={(e) => setForm({ ...form, endTime: e.target.value })} />
            </div>
            <select className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm" value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })}>
              {Object.entries(TYPE_LABELS).map(([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>
            {form.type === "specialDish" && (
              <select className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm" value={form.dishId} onChange={(e) => setForm({ ...form, dishId: e.target.value })}>
                <option value="">Gericht auswählen</option>
                {dishes.map((d) => (
                  <option key={d.id} value={d.id}>
                    {d.name}
                  </option>
                ))}
              </select>
            )}
            <div className="flex justify-between pt-1">
              <button onClick={submit} disabled={saving} className="bg-gray-900 hover:bg-gray-700 text-white font-semibold rounded-xl px-4 py-2 text-sm disabled:opacity-50">
                {saving ? "Speichert..." : "Speichern"}
              </button>
              <button onClick={() => setForm(null)} className="text-sm text-gray-500 hover:text-gray-700">
                Abbrechen
              </button>
            </div>
          </div>
        ) : (
          <button onClick={() => setForm({ ...EMPTY_FORM })} className="w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-xl px-4 py-3 text-sm transition-colors">
            + Neuer Eintrag
          </button>
        )}

        {entries.length === 0 && !form && <div className="text-center text-gray-400 py-8">Noch keine Einträge.</div>}

        <ul className="space-y-2">
          {entries.map((entry) => (
            <li key={entry.id} className="bg-white rounded-2xl border border-gray-200 shadow-sm p-4 flex items-center justify-between gap-3">
              <div className="min-w-0">
                <p className="font-medium text-sm text-gray-800 truncate">{entry.eventName}</p>
                <p className="text-xs text-gray-400">
                  {TYPE_LABELS[entry.type]} · {new Date(entry.date).toLocaleDateString("de-DE")} · {entry.startTime}–{entry.endTime}
                  {entry.dish ? ` · ${entry.dish.name}` : ""}
                </p>
              </div>
              <div className="flex gap-2 shrink-0">
                <button onClick={() => startEdit(entry)} className="text-xs font-semibold px-3 py-1.5 rounded-xl border border-gray-200 hover:border-gray-400 text-gray-600">
                  Bearbeiten
                </button>
                <button onClick={() => remove(entry.id)} className="text-xs font-semibold px-3 py-1.5 rounded-xl border border-red-200 hover:bg-red-50 text-red-600">
                  Löschen
                </button>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default function StaffCalendarPage() {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return <div className="min-h-screen flex items-center justify-center text-gray-400">Laden...</div>;
  }

  if (!session) {
    return <div className="min-h-screen flex items-center justify-center text-gray-500">Kein Zugriff</div>;
  }

  // Ob das Restaurant (Owner-Abo) Zugriff auf Events hat, prüft die API
  // (assertCalendarAccess) serverseitig — session.user.subscription bezieht
  // sich auf den eingeloggten Staff-User, nicht auf das Restaurant, und ist
  // dafür hier nicht aussagekräftig (analog zu staff/availability).
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center text-gray-400">Laden...</div>}>
      <CalendarContent />
    </Suspense>
  );
}
