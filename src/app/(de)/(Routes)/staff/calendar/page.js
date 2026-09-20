"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { useSession } from "next-auth/react";
import { useUiLanguage } from "@/app/components/useUiLanguage";
import { DynamicLink, DynamicLinkButton } from "@/app/components/DynamicLink";

// Schluessel sind DB-Werte und bleiben; nur die Beschriftung wechselt.
const typeLabels = (tk) => ({ promotion: tk.typeAktion, event: tk.typeEvent, specialDish: tk.typeTagesgericht });
const EMPTY_FORM = { id: null, eventName: "", eventDescription: "", date: "", multiDay: false, endDate: "", startTime: "", endTime: "", type: "promotion", dishId: "" };

function CalendarContent() {
  const { t, locale } = useUiLanguage();
  const tc = t.staff.common;
  const tk = t.staff.calendar;
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
      setError(tc.noRestaurantId);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);
    Promise.all([
      fetch(`/api/user/profil/calendar?restaurantId=${restaurantID}`).then(async (r) => {
        const data = await r.json();
        if (!r.ok) throw new Error(data.message || tc.loadError);
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
      multiDay: !!entry.endDate,
      endDate: entry.endDate?.slice(0, 10) ?? "",
      startTime: entry.startTime ?? "",
      endTime: entry.endTime ?? "",
      type: entry.type,
      dishId: entry.dishId ?? "",
    });

  const submit = async () => {
    if (!form.eventName || !form.eventDescription || !form.date) return;
    if (form.multiDay && !form.endDate) return;
    if (!form.multiDay && !!form.startTime !== !!form.endTime) return;

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
          endDate: form.multiDay ? form.endDate : null,
          startTime: form.multiDay ? null : form.startTime || null,
          endTime: form.multiDay ? null : form.endTime || null,
          type: form.type,
          dishId: form.type === "specialDish" && form.dishId ? form.dishId : null,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || tc.saveError);

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
      if (!res.ok) throw new Error(tc.deleteError);
    } catch {
      setEntries(prevEntries);
    }
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center text-gray-400">{tc.loading}</div>;
  }

  if (!restaurantID || error) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="max-w-sm w-full bg-white rounded-2xl border border-red-200 p-6 text-center space-y-4 shadow-sm">
          <p className="text-3xl">⚠️</p>
          <p className="font-semibold text-gray-800">{error ?? tc.noRestaurantGiven}</p>
          <DynamicLink href="/staff" className="block w-full bg-gray-900 text-white font-semibold rounded-xl px-4 py-3 hover:bg-gray-700 transition-colors">
            {tc.backToDashboard}
          </DynamicLink>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-2xl mx-auto space-y-6">
        <div className="flex items-center gap-4">
          <DynamicLink href="/staff" className="p-2 rounded-xl hover:bg-gray-100 transition-colors text-gray-500">
            ← {tc.back}
          </DynamicLink>
          <h1 className="text-xl font-bold text-gray-900">{tk.title}</h1>
        </div>
        {form ? (
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-5 space-y-3">
            <input className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm" placeholder={tk.titleField} value={form.eventName} onChange={(e) => setForm({ ...form, eventName: e.target.value })} />
            <textarea className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm" placeholder={tk.description} value={form.eventDescription} onChange={(e) => setForm({ ...form, eventDescription: e.target.value })} />
            <label className="flex items-center gap-2 text-sm text-gray-600">
              <input
                type="checkbox"
                checked={form.multiDay}
                onChange={(e) => setForm({ ...form, multiDay: e.target.checked, endDate: "", startTime: "", endTime: "" })}
              />
              {tk.multiDay}
            </label>

            {form.multiDay ? (
              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-1">
                  <p className="text-xs text-gray-400">{tk.from}</p>
                  <input type="date" className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} />
                </div>
                <div className="space-y-1">
                  <p className="text-xs text-gray-400">{tk.to}</p>
                  <input type="date" className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm" value={form.endDate} onChange={(e) => setForm({ ...form, endDate: e.target.value })} />
                </div>
              </div>
            ) : (
              <>
                <input type="date" className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} />
                <div className="grid grid-cols-2 gap-2">
                  <input type="time" className="border border-gray-200 rounded-xl px-3 py-2 text-sm" value={form.startTime} onChange={(e) => setForm({ ...form, startTime: e.target.value })} />
                  <input type="time" className="border border-gray-200 rounded-xl px-3 py-2 text-sm" value={form.endTime} onChange={(e) => setForm({ ...form, endTime: e.target.value })} />
                </div>
              </>
            )}
            <select className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm" value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })}>
              {Object.entries(typeLabels(tk)).map(([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>
            {form.type === "specialDish" && (
              <select className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm" value={form.dishId} onChange={(e) => setForm({ ...form, dishId: e.target.value })}>
                <option value="">{tk.pickDish}</option>
                {dishes.map((d) => (
                  <option key={d.id} value={d.id}>
                    {d.name}
                  </option>
                ))}
              </select>
            )}
            <div className="flex justify-between pt-1">
              <button onClick={submit} disabled={saving} className="bg-gray-900 hover:bg-gray-700 text-white font-semibold rounded-xl px-4 py-2 text-sm disabled:opacity-50">
                {saving ? tc.saving : tc.save}
              </button>
              <button onClick={() => setForm(null)} className="text-sm text-gray-500 hover:text-gray-700">
                {tc.cancel}
              </button>
            </div>
          </div>
        ) : (
          <button onClick={() => setForm({ ...EMPTY_FORM })} className="w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-xl px-4 py-3 text-sm transition-colors">
            + Neuer Eintrag
          </button>
        )}

        {entries.length === 0 && !form && <div className="text-center text-gray-400 py-8">{tk.empty}</div>}

        <ul className="space-y-2">
          {entries.map((entry) => (
            <li key={entry.id} className="bg-white rounded-2xl border border-gray-200 shadow-sm p-4 flex items-center justify-between gap-3">
              <div className="min-w-0">
                <p className="font-medium text-sm text-gray-800 truncate">{entry.eventName}</p>
                <p className="text-xs text-gray-400">
                  {typeLabels(tk)[entry.type]} ·{" "}
                  {entry.endDate
                    ? `${new Date(entry.date).toLocaleDateString(locale)}–${new Date(entry.endDate).toLocaleDateString(locale)}`
                    : `${new Date(entry.date).toLocaleDateString(locale)} · ${entry.startTime && entry.endTime ? `${entry.startTime}–${entry.endTime}` : tk.allDay}`}
                  {entry.dish ? ` · ${entry.dish.name}` : ""}
                </p>
              </div>
              <div className="flex gap-2 shrink-0">
                <button onClick={() => startEdit(entry)} className="text-xs font-semibold px-3 py-1.5 rounded-xl border border-gray-200 hover:border-gray-400 text-gray-600">
                  {tc.edit}
                </button>
                <button onClick={() => remove(entry.id)} className="text-xs font-semibold px-3 py-1.5 rounded-xl border border-red-200 hover:bg-red-50 text-red-600">
                  {tc.delete}
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
  const { t } = useUiLanguage();
  const tc = t.staff.common;
  const tk = t.staff.calendar;
  const { data: session, status } = useSession();

  if (status === "loading") {
    return <div className="min-h-screen flex items-center justify-center text-gray-400">{tc.loading}</div>;
  }

  if (!session) {
    return <div className="min-h-screen flex items-center justify-center text-gray-500">{tc.noAccess}</div>;
  }
  if (session.user.subscription !== "Professional") {
    return (
      <div>
        <div>
          <DynamicLinkButton href="/staff">{tc.back}</DynamicLinkButton>
        </div>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-red-600 font-bold text-2xl">{tc.noAccess}</div>
        </div>
      </div>
    );
  }

  // Ob das Restaurant (Owner-Abo) Zugriff auf Events hat, prüft die API
  // (assertCalendarAccess) serverseitig — session.user.subscription bezieht
  // sich auf den eingeloggten Staff-User, nicht auf das Restaurant, und ist
  // dafür hier nicht aussagekräftig (analog zu staff/availability).
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center text-gray-400" />}>
      <CalendarContent />
    </Suspense>
  );
}
