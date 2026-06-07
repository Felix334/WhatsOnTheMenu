"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";

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

// ─── Abonnement-Verwaltung ────────────────────────────────────────────────────
const TIER_LABELS = { FreeTier: "Free", Professional: "Professional", Business: "Business", Individuell: "Business" };
const TIER_COLORS = {
  FreeTier: "bg-gray-100 text-gray-700",
  Professional: "bg-amber-100 text-amber-800",
  Business: "bg-orange-100 text-orange-800",
  Individuell: "bg-orange-100 text-orange-800",
};

function SubscriptionSection() {
  const [sub, setSub] = useState(null);
  const [loading, setLoading] = useState(true);
  const [confirmCancel, setConfirmCancel] = useState(false);
  const [working, setWorking] = useState(false);

  useEffect(() => {
    fetch("/api/payment/subscription")
      .then((r) => r.json())
      .then((d) => setSub(d.subscription))
      .finally(() => setLoading(false));
  }, []);

  const handleCancel = async () => {
    setWorking(true);
    const res = await fetch("/api/payment/cancel", { method: "POST" });
    if (res.ok) {
      setSub((prev) => ({ ...prev, cancelAtPeriodEnd: true, status: "canceling" }));
      toast.success("Abonnement wird zum Periodenende gekündigt");
    } else {
      toast.error("Fehler beim Kündigen");
    }
    setWorking(false);
    setConfirmCancel(false);
  };

  const handleReactivate = async () => {
    setWorking(true);
    const res = await fetch("/api/payment/reactivate", { method: "POST" });
    if (res.ok) {
      setSub((prev) => ({ ...prev, cancelAtPeriodEnd: false, status: "active" }));
      toast.success("Abonnement reaktiviert");
    } else {
      toast.error("Fehler beim Reaktivieren");
    }
    setWorking(false);
  };

  const openPortal = async () => {
    setWorking(true);
    const res = await fetch("/api/payment/portal", { method: "POST" });
    const data = await res.json();
    if (data.url) window.location.href = data.url;
    else { toast.error("Portal konnte nicht geöffnet werden"); setWorking(false); }
  };

  if (loading) return <p className="text-sm text-gray-400">Lädt…</p>;

  if (!sub) {
    return (
      <Card>
        <CardContent className="pt-6">
          <p className="text-sm text-gray-500 mb-4">Du hast noch kein aktives Abonnement.</p>
          <Button asChild><a href="/pricing">Tarife ansehen</a></Button>
        </CardContent>
      </Card>
    );
  }

  const periodEnd = sub.currentPeriodEnd
    ? new Date(sub.currentPeriodEnd * 1000).toLocaleDateString("de-DE", { day: "numeric", month: "long", year: "numeric" })
    : null;

  const isCanceling = sub.cancelAtPeriodEnd;

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <h2 className="text-base font-semibold">Aktuelles Abonnement</h2>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-3">
            <span className={`px-3 py-1 rounded-full text-sm font-semibold ${TIER_COLORS[sub.tier] ?? "bg-gray-100 text-gray-700"}`}>
              {TIER_LABELS[sub.tier] ?? sub.tier}
            </span>
            {isCanceling ? (
              <span className="px-3 py-1 rounded-full text-sm font-medium bg-red-50 text-red-700 border border-red-200">
                Läuft aus am {periodEnd}
              </span>
            ) : (
              <span className="px-3 py-1 rounded-full text-sm font-medium bg-green-50 text-green-700 border border-green-200">
                Aktiv · Verlängert am {periodEnd}
              </span>
            )}
          </div>

          {isCanceling && (
            <div className="rounded-lg bg-amber-50 border border-amber-200 px-4 py-3 text-sm text-amber-800">
              Du behältst bis zum <strong>{periodEnd}</strong> vollen Zugang. Danach wird dein Konto auf FreeTier zurückgesetzt.
            </div>
          )}

          <div className="flex flex-wrap gap-2 pt-2">
            <Button variant="outline" onClick={openPortal} disabled={working}>
              Zahlungsmethode ändern
            </Button>
            {isCanceling ? (
              <Button onClick={handleReactivate} disabled={working}>
                {working ? "Wird reaktiviert…" : "Kündigung rückgängig machen"}
              </Button>
            ) : (
              <Button variant="destructive" onClick={() => setConfirmCancel(true)} disabled={working}>
                Abonnement kündigen
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      <Dialog open={confirmCancel} onOpenChange={setConfirmCancel}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Abonnement kündigen?</DialogTitle>
            <DialogDescription>
              Du behältst deinen Zugang bis zum <strong>{periodEnd}</strong>. Danach wird dein Konto auf FreeTier zurückgesetzt. Du kannst die Kündigung jederzeit rückgängig machen.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setConfirmCancel(false)} disabled={working}>Abbrechen</Button>
            <Button variant="destructive" onClick={handleCancel} disabled={working}>
              {working ? "Wird gekündigt…" : "Ja, kündigen"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

// ─── Navigation ───────────────────────────────────────────────────────────────
const SECTIONS = [
  { id: "staff", label: "Mitarbeiter", icon: "👥" },
  { id: "subscription", label: "Abonnement", icon: "💳" },
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
            {activeSection === "subscription" && <SubscriptionSection />}
          </div>
        </div>
      </div>
    </div>
  );
}
