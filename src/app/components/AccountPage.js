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
import { tierLabel } from "@/lib/tierLabels";
import { localizedPath } from "@/i18n/config";

// Kontoseite (/account Englisch, /de/Konto Deutsch). Sprache kommt aus der
// URL wie bei den uebrigen oeffentlichen Seiten — erreichbar ist sie ueber das
// Profil-Menue, das die Sprache der aktuellen Seite kennt. Texte: account.*

const DATE_LOCALES = { de: "de-DE", en: "en-GB" };

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

export default function AccountPage({ t, locale }) {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [account, setAccount] = useState(null);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    if (status !== "authenticated") return;
    if (session) {
      setAccount(session.user);
    }
  }, [status, session]);

  if (status === "loading") return <Centered>{t.loading}</Centered>;
  if (status === "unauthenticated") return <Centered>{t.signInFirst}</Centered>;

  // Solange /api/user/me lädt, mit Session-Daten arbeiten
  const user = account ?? session?.user ?? {};
  const userId = account?.id ?? session?.user?.id;
  const isOwner = user.role === "Owner";
  const hasRestaurant = !!account?.restaurant;

  const roleLabel = t.roles[user.role] ?? user.role ?? t.roles.User;
  const subscriptionLabel = tierLabel(user.subscription);
  const statusLabel = account?.subscriptionStatus ? (t.subscriptionStatuses[account.subscriptionStatus] ?? account.subscriptionStatus) : null;
  const memberSince = account?.createdAt ? new Date(account.createdAt).toLocaleDateString(DATE_LOCALES[locale] ?? locale, { day: "2-digit", month: "long", year: "numeric" }) : null;

  const handleDelete = async () => {
    setConfirmOpen(false);
    setDeleting(true);
    try {
      const resp = await fetch(`/api/deleteAccount/${userId}`, { method: "DELETE" });
      if (!resp.ok) throw new Error("delete failed");
      toast.success(t.deleteSuccess);
      await signOut({ redirect: false });
      router.push(localizedPath("/", locale));
    } catch {
      toast.error(t.deleteError);
      setDeleting(false);
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-amber-100 py-16 px-4">
      <div className="max-w-2xl mx-auto space-y-6">
        {/* Kopf */}
        <Card className="border-amber-100 shadow-xl">
          <CardContent className="p-8">
            <div className="flex items-center gap-5">
              <Avatar className="w-20 h-20">
                <AvatarImage src={user.image || undefined} alt={t.avatarAlt} />
                <AvatarFallback>{(user.name?.[0] ?? "U").toUpperCase()}</AvatarFallback>
              </Avatar>
              <div className="min-w-0">
                <h1 className="text-2xl font-serif font-bold text-gray-900 truncate">{user.name || t.roles.User}</h1>
                <p className="text-gray-500 truncate">{user.email}</p>
                <Badge className="mt-2 bg-amber-500/10 text-amber-700 border-amber-200">{roleLabel}</Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Account-Daten */}
        <Card className="border-gray-100 shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg">{t.detailsTitle}</CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <InfoRow label={t.name} value={user.name || "—"} />
            <InfoRow label={t.email} value={user.email || "—"} />
            <InfoRow label={t.role} value={roleLabel} />
            {(isOwner || user.subscription) && <InfoRow label={t.subscription} value={subscriptionLabel} />}
            {isOwner && statusLabel && <InfoRow label={t.subscriptionStatus} value={statusLabel} />}
            {hasRestaurant && <InfoRow label={t.restaurant} value={account.restaurant.name} />}
            {memberSince && <InfoRow label={t.memberSince} value={memberSince} />}
          </CardContent>
        </Card>

        {/* Gefahrenzone */}
        <Card className="border-red-200 shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg text-red-700">{t.deleteTitle}</CardTitle>
          </CardHeader>
          <CardContent className="pt-0 space-y-4">
            <p className="text-sm text-gray-500">{isOwner ? t.deleteHintOwner : t.deleteHint}</p>
            <Button variant="destructive" disabled={deleting} onClick={() => setConfirmOpen(true)}>
              {deleting ? t.deleting : t.deleteButton}
            </Button>
          </CardContent>
        </Card>
      </div>

      <ConfirmDialog
        open={confirmOpen}
        onOpenChange={setConfirmOpen}
        title={t.confirmTitle}
        description={hasRestaurant ? t.confirmWithRestaurant : t.confirmWithoutRestaurant}
        confirmLabel={t.confirmButton}
        onConfirm={handleDelete}
      />
    </main>
  );
}
