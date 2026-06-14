"use client";

import { useEffect, useState } from "react";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";

const ROLE_LABELS = {
  Admin: "Administrator",
  Owner: "Restaurant-Besitzer",
  Staff: "Mitarbeiter",
  Manager: "Manager",
  Executive: "Executive",
  User: "Nutzer",
};

const SUBSCRIPTION_LABELS = {
  NoSubscription: "Kein Abo",
  FreeTier: "Free",
  Professional: "Professional",
  Business: "Business",
};

function Centered({ children }) {
  return <div className="min-h-screen flex items-center justify-center text-gray-500">{children}</div>;
}

function InfoRow({ label, value }) {
  return (
    <div className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0">
      <span className="text-sm text-gray-500">{label}</span>
      <span className="text-sm font-medium text-gray-900 text-right">{value}</span>
    </div>
  );
}

export default function KontoPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [account, setAccount] = useState(null);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    if (status !== "authenticated") return;
    let active = true;
    fetch("/api/user/me")
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => {
        if (active && d?.user) setAccount(d.user);
      })
      .catch(() => {});
    return () => {
      active = false;
    };
  }, [status]);

  if (status === "loading") return <Centered>Lädt…</Centered>;
  if (status === "unauthenticated") return <Centered>Bitte melde dich an.</Centered>;

  // Solange /api/user/me lädt, mit Session-Daten arbeiten
  const user = account ?? session?.user ?? {};
  const userId = account?.id ?? session?.user?.id;
  const isOwner = user.role === "Owner";
  const hasRestaurant = !!account?.restaurant;

  const roleLabel = ROLE_LABELS[user.role] ?? user.role ?? "Nutzer";
  const subscriptionLabel = SUBSCRIPTION_LABELS[user.subscription] ?? user.subscription ?? "Kein Abo";
  const memberSince = account?.createdAt
    ? new Date(account.createdAt).toLocaleDateString("de-DE", { day: "2-digit", month: "long", year: "numeric" })
    : null;

  const handleDelete = async () => {
    setConfirmOpen(false);
    setDeleting(true);
    try {
      const resp = await fetch(`/api/deleteAccount/${userId}`, { method: "DELETE" });
      if (!resp.ok) throw new Error("delete failed");
      toast.success("Account erfolgreich gelöscht.");
      await signOut({ redirect: false });
      router.push("/");
    } catch {
      toast.error("Fehler beim Löschen des Accounts.");
      setDeleting(false);
    }
  };

  const deleteDescription = hasRestaurant
    ? "Dein Account UND dein Restaurant (inkl. Menü, Gerichte, Bestellungen und Mitarbeiter) werden unwiderruflich gelöscht. Ein aktives Abonnement wird automatisch gekündigt. Diese Aktion kann nicht rückgängig gemacht werden."
    : "Dein Account wird unwiderruflich gelöscht. Diese Aktion kann nicht rückgängig gemacht werden.";

  return (
    <main className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-amber-100 py-16 px-4">
      <div className="max-w-2xl mx-auto space-y-6">
        {/* Kopf */}
        <Card className="border-amber-100 shadow-xl">
          <CardContent className="p-8">
            <div className="flex items-center gap-5">
              <Avatar className="w-20 h-20">
                <AvatarImage src={user.image || undefined} alt="Profilbild" />
                <AvatarFallback>{(user.name?.[0] ?? "U").toUpperCase()}</AvatarFallback>
              </Avatar>
              <div className="min-w-0">
                <h1 className="text-2xl font-serif font-bold text-gray-900 truncate">{user.name || "Nutzer"}</h1>
                <p className="text-gray-500 truncate">{user.email}</p>
                <Badge className="mt-2 bg-amber-500/10 text-amber-700 border-amber-200">{roleLabel}</Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Account-Daten */}
        <Card className="border-gray-100 shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg">Konto-Daten</CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <InfoRow label="Name" value={user.name || "—"} />
            <InfoRow label="E-Mail" value={user.email || "—"} />
            <InfoRow label="Rolle" value={roleLabel} />
            {(isOwner || user.subscription) && <InfoRow label="Abo" value={subscriptionLabel} />}
            {isOwner && account?.subscriptionStatus && (
              <InfoRow label="Abo-Status" value={account.subscriptionStatus} />
            )}
            {hasRestaurant && <InfoRow label="Restaurant" value={account.restaurant.name} />}
            {memberSince && <InfoRow label="Mitglied seit" value={memberSince} />}
          </CardContent>
        </Card>

        {/* Gefahrenzone */}
        <Card className="border-red-200 shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg text-red-700">Account löschen</CardTitle>
          </CardHeader>
          <CardContent className="pt-0 space-y-4">
            <p className="text-sm text-gray-500">
              {isOwner
                ? "Beim Löschen deines Accounts wird auch dein Restaurant mit allen Daten entfernt und ein laufendes Abonnement gekündigt."
                : "Hier kannst du deinen Account unwiderruflich löschen."}
            </p>
            <Button variant="destructive" disabled={deleting} onClick={() => setConfirmOpen(true)}>
              {deleting ? "Wird gelöscht…" : "Account löschen"}
            </Button>
          </CardContent>
        </Card>
      </div>

      <ConfirmDialog
        open={confirmOpen}
        onOpenChange={setConfirmOpen}
        title="Account wirklich löschen?"
        description={deleteDescription}
        confirmLabel="Endgültig löschen"
        onConfirm={handleDelete}
      />
    </main>
  );
}
