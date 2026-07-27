"use client";

import { useEffect, useState, useCallback } from "react";
import { useSession } from "next-auth/react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";

const ROLE_LABELS = { manager: "Manager", waiter: "Kellner", kitchen: "Küchenleitung" };
const CURRENT_ROLE_LABELS = { Owner: "Restaurant-Inhaber", Admin: "Administrator", Staff: "Mitarbeiter" };

export default function StaffInvitationDialog() {
  const { data: session, status, update } = useSession();
  const [invitations, setInvitations] = useState([]);
  const [working, setWorking] = useState(false);

  const load = useCallback(async () => {
    try {
      const res = await fetch("/api/restaurant/staff/invitations");
      if (!res.ok) return;
      const data = await res.json();
      setInvitations(data.invitations ?? []);
    } catch {
      /* still */
    }
  }, []);

  useEffect(() => {
    if (status === "authenticated") load();
  }, [status, load]);

  if (status !== "authenticated" || invitations.length === 0) return null;

  const invite = invitations[0];
  const currentRole = session?.user?.role;
  // Owner/Admin behalten ihre Hauptrolle – die serverseitige Prüfung stuft sie nie herab.
  const hasElevatedRole = currentRole && currentRole !== "User";
  const keepsMainRole = currentRole === "Owner" || currentRole === "Admin";

  const respond = async (action) => {
    setWorking(true);
    try {
      const res = await fetch(`/api/restaurant/staff/invitations/${invite.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action }),
      });
      if (!res.ok) {
        toast.error("Aktion fehlgeschlagen");
        return;
      }
      const data = await res.json().catch(() => ({}));
      setInvitations((prev) => prev.filter((i) => i.id !== invite.id));

      if (action === "accept") {
        toast.success(`Einladung von „${invite.restaurant?.name ?? "Restaurant"}“ angenommen`);
        // Session/JWT neu laden, damit die neue Rolle & Mitgliedschaft sofort greifen.
        if (data.roleChanged) await update();
      } else {
        toast.success("Einladung abgelehnt");
      }
    } finally {
      setWorking(false);
    }
  };

  return (
    <Dialog open onOpenChange={() => {}}>
      <DialogContent className="sm:max-w-md" showCloseButton={false}>
        <DialogHeader>
          <DialogTitle>Einladung ins Team</DialogTitle>
          <DialogDescription>
            <strong>{invite.restaurant?.name ?? "Ein Restaurant"}</strong> möchte dich als{" "}
            <strong>{ROLE_LABELS[invite.role] ?? invite.role}</strong> hinzufügen.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-3 text-sm text-gray-600">
          <p>
            Wenn du zustimmst, erhältst du Zugriff auf die entsprechenden Funktionen dieses
            Restaurants. Du kannst die Einladung auch ablehnen.
          </p>

          {hasElevatedRole && (
            <div className="rounded-lg border border-amber-300 bg-amber-50 px-4 py-3 text-amber-800">
              <p className="font-semibold">
                ⚠️ Du hast bereits die Rolle {CURRENT_ROLE_LABELS[currentRole] ?? currentRole}.
              </p>
              {keepsMainRole ? (
                <p className="mt-1">
                  Deine Hauptrolle bleibt erhalten – die Mitarbeiter-Berechtigung kommt zusätzlich
                  hinzu. Stimme nur zu, wenn du wirklich für dieses Restaurant tätig sein möchtest.
                </p>
              ) : (
                <p className="mt-1">
                  Mit der Zustimmung wird deine Rolle geändert. Bestehende Berechtigungen können sich
                  dadurch ändern.
                </p>
              )}
            </div>
          )}

          {invitations.length > 1 && (
            <p className="text-xs text-gray-400">
              Du hast {invitations.length} offene Einladungen. Nach dieser Entscheidung wird die
              nächste angezeigt.
            </p>
          )}
        </div>

        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={() => respond("decline")} disabled={working}>
            Ablehnen
          </Button>
          <Button onClick={() => respond("accept")} disabled={working}>
            {working ? "Wird verarbeitet…" : "Zustimmen"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
