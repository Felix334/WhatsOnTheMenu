"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardHeader, CardContent } from "@/components/ui/card";

// ─── Konstanten ───────────────────────────────────────────────────────────────
const ROLE_LABELS = { manager: "Manager", waiter: "Kellner", kitchen: "Küchenleitung" };
const ROLE_COLORS = {
  manager: "bg-purple-100 text-purple-800 border-purple-200",
  waiter:  "bg-blue-100 text-blue-800 border-blue-200",
  kitchen: "bg-orange-100 text-orange-800 border-orange-200",
};

// ─── Mitarbeiter-Karte ────────────────────────────────────────────────────────
function StaffCard({ entry, onApprove, onRemove }) {
  return (
    <div className={`flex items-center justify-between rounded-xl border px-4 py-3 ${entry.approved ? "bg-white" : "bg-amber-50 border-amber-200"}`}>
      <div className="space-y-0.5">
        <p className="text-sm font-medium text-gray-900">{entry.user?.name ?? "—"}</p>
        <p className="text-xs text-gray-500">{entry.email}</p>
        <span className={`inline-block text-xs font-medium px-2 py-0.5 rounded-full border ${ROLE_COLORS[entry.role]}`}>
          {ROLE_LABELS[entry.role]}
        </span>
      </div>
      <div className="flex gap-2 shrink-0">
        {!entry.approved && entry.userId && (
          <Button size="sm" onClick={() => onApprove(entry.id)}>
            Genehmigen
          </Button>
        )}
        {!entry.approved && !entry.userId && (
          <span className="text-xs text-amber-600 font-medium self-center">Noch nicht registriert</span>
        )}
        <Button size="sm" variant="outline" onClick={() => onRemove(entry.id)}>
          Entfernen
        </Button>
      </div>
    </div>
  );
}

// ─── Mitarbeiter-Verwaltung ───────────────────────────────────────────────────
function StaffSection() {
  const [staff, setStaff] = useState([]);
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("waiter");
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    fetch("/api/restaurant/staff")
      .then((r) => r.json())
      .then((d) => setStaff(d.staff ?? []))
      .finally(() => setFetching(false));
  }, []);

  const handleAdd = async () => {
    if (!email.trim()) return;
    setLoading(true);
    const res = await fetch("/api/restaurant/staff", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: email.trim(), role }),
    });
    const data = await res.json();
    if (res.ok) {
      setStaff((prev) => [data.staff, ...prev]);
      setEmail("");
      toast.success("Mitarbeiter hinzugefügt");
    } else {
      toast.error(data.message ?? "Fehler beim Hinzufügen");
    }
    setLoading(false);
  };

  const handleApprove = async (id) => {
    const res = await fetch(`/api/restaurant/staff/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ approved: true }),
    });
    if (res.ok) {
      setStaff((prev) => prev.map((s) => (s.id === id ? { ...s, approved: true } : s)));
      toast.success("Mitarbeiter genehmigt");
    } else {
      toast.error("Fehler beim Genehmigen");
    }
  };

  const handleRemove = async (id) => {
    const res = await fetch(`/api/restaurant/staff/${id}`, { method: "DELETE" });
    if (res.ok) {
      setStaff((prev) => prev.filter((s) => s.id !== id));
      toast.success("Mitarbeiter entfernt");
    } else {
      toast.error("Fehler beim Entfernen");
    }
  };

  const pending  = staff.filter((s) => !s.approved);
  const approved = staff.filter((s) => s.approved);

  return (
    <div className="space-y-6">
      {/* Neuen Mitarbeiter hinzufügen */}
      <Card>
        <CardHeader>
          <h2 className="text-base font-semibold">Mitarbeiter hinzufügen</h2>
          <p className="text-sm text-gray-500">
            Der Mitarbeiter registriert sich mit dieser E-Mail-Adresse. Du genehmigst den Zugang anschließend hier.
          </p>
        </CardHeader>
        <CardContent className="space-y-3">
          <div>
            <Label>E-Mail-Adresse</Label>
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleAdd()}
              placeholder="mitarbeiter@beispiel.de"
              className="mt-1"
            />
          </div>
          <div>
            <Label>Rolle</Label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
            >
              <option value="waiter">Kellner — Bestellungen sehen & abhaken</option>
              <option value="kitchen">Küchenleitung — Verfügbarkeit verwalten</option>
              <option value="manager">Manager — Vollzugriff auf Betrieb</option>
            </select>
          </div>
          <Button onClick={handleAdd} disabled={loading || !email.trim()}>
            {loading ? "Wird hinzugefügt…" : "Hinzufügen"}
          </Button>
        </CardContent>
      </Card>

      {/* Ausstehende Genehmigungen */}
      {fetching ? (
        <p className="text-sm text-gray-400">Lädt…</p>
      ) : (
        <>
          {pending.length > 0 && (
            <div className="space-y-2">
              <h3 className="text-sm font-semibold text-amber-700 uppercase tracking-wide">
                Ausstehend ({pending.length})
              </h3>
              {pending.map((s) => (
                <StaffCard key={s.id} entry={s} onApprove={handleApprove} onRemove={handleRemove} />
              ))}
            </div>
          )}

          {approved.length > 0 && (
            <div className="space-y-2">
              <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide">
                Aktiv ({approved.length})
              </h3>
              {approved.map((s) => (
                <StaffCard key={s.id} entry={s} onApprove={handleApprove} onRemove={handleRemove} />
              ))}
            </div>
          )}

          {staff.length === 0 && (
            <p className="text-sm text-gray-400 text-center py-8">Noch keine Mitarbeiter hinzugefügt.</p>
          )}
        </>
      )}
    </div>
  );
}

// ─── Navigation ───────────────────────────────────────────────────────────────
const SECTIONS = [
  { id: "staff", label: "Mitarbeiter", icon: "👥" },
];

// ─── Seite ────────────────────────────────────────────────────────────────────
export default function SettingsPage() {
  const { data: session, status } = useSession();
  const [activeSection, setActiveSection] = useState("staff");

  if (status === "loading") {
    return <div className="min-h-screen flex items-center justify-center text-gray-500">Laden…</div>;
  }

  if (!session || session.user?.role !== "Owner") {
    return <div className="min-h-screen flex items-center justify-center text-gray-500">Kein Zugriff</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-8">Einstellungen</h1>

        <div className="flex gap-8">
          {/* Sidebar */}
          <nav className="w-48 shrink-0 space-y-1">
            {SECTIONS.map((s) => (
              <button
                key={s.id}
                onClick={() => setActiveSection(s.id)}
                className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-medium text-left transition-colors ${
                  activeSection === s.id
                    ? "bg-white shadow-sm text-gray-900"
                    : "text-gray-600 hover:bg-white hover:text-gray-900"
                }`}
              >
                <span>{s.icon}</span>
                <span>{s.label}</span>
              </button>
            ))}
          </nav>

          {/* Inhalt */}
          <div className="flex-1 min-w-0">
            {activeSection === "staff" && <StaffSection />}
          </div>
        </div>
      </div>
    </div>
  );
}
