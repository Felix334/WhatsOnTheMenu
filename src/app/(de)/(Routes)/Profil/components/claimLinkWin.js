"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Copy, Link2 } from "lucide-react";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

// Nur für Bau-Accounts sichtbar (Server entscheidet über CLAIM_BUILDER_EMAILS).
// Erzeugt einen Link, mit dem ein Kunde dieses Restaurant übernimmt.
const ClaimLinkWin = () => {
  const [allowed, setAllowed] = useState(false);
  const [claim, setClaim] = useState(null);
  const [email, setEmail] = useState("");
  const [link, setLink] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    fetch("/api/user/profil/claimLink")
      .then((res) => (res.ok ? res.json() : { allowed: false }))
      .then((data) => {
        setAllowed(Boolean(data.allowed));
        setClaim(data.claim ?? null);
      })
      .catch(() => setAllowed(false));
  }, []);

  if (!allowed) return null;

  const create = async () => {
    setBusy(true);
    try {
      const res = await fetch("/api/user/profil/claimLink", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.message || "Link konnte nicht erstellt werden");
      setClaim(data.claim);
      setLink(`${window.location.origin}/beanspruchen/${data.token}`);
      toast.success("Übernahme-Link erstellt");
    } catch (err) {
      toast.error(err.message);
    } finally {
      setBusy(false);
    }
  };

  const revoke = async () => {
    setBusy(true);
    try {
      const res = await fetch("/api/user/profil/claimLink", { method: "DELETE" });
      if (!res.ok) throw new Error("Link konnte nicht widerrufen werden");
      setClaim(null);
      setLink("");
      toast.success("Link widerrufen");
    } catch (err) {
      toast.error(err.message);
    } finally {
      setBusy(false);
    }
  };

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(link);
      toast.success("Link kopiert");
    } catch {
      toast.error("Kopieren fehlgeschlagen — bitte manuell markieren");
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <Link2 className="size-4" />
          <span className="hidden md:inline">Übernahme-Link</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Restaurant an Kunden übergeben</DialogTitle>
          <DialogDescription>
            Der Kunde öffnet den Link, meldet sich mit Google an und wird Besitzer dieses Restaurants. Danach hat dieser Account keinen Zugriff mehr darauf
            und kann die nächste Speisekarte anlegen.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="claim-email">Google-Konto des Kunden (empfohlen)</Label>
            <Input
              id="claim-email"
              type="email"
              placeholder="wirt@gmail.com — leer = jeder mit dem Link"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={busy}
            />
            <p className="text-xs text-gray-500">Ist eine E-Mail gesetzt, kann nur genau dieses Konto den Link einlösen.</p>
          </div>

          {link ? (
            <div className="space-y-2">
              <Label htmlFor="claim-link">Link (wird nur jetzt angezeigt)</Label>
              <div className="flex gap-2">
                <Input id="claim-link" readOnly value={link} onFocus={(e) => e.target.select()} />
                <Button type="button" variant="outline" size="icon" onClick={copy} aria-label="Link kopieren">
                  <Copy className="size-4" />
                </Button>
              </div>
            </div>
          ) : (
            claim && (
              <p className="text-sm text-gray-600">
                Es gibt einen aktiven Link{claim.email ? ` für ${claim.email}` : ""}, gültig bis {new Date(claim.expiresAt).toLocaleDateString("de-DE")}. Ein
                neuer Link macht ihn ungültig.
              </p>
            )
          )}

          <div className="flex justify-end gap-2">
            {claim && (
              <Button type="button" variant="ghost" onClick={revoke} disabled={busy}>
                Widerrufen
              </Button>
            )}
            <Button type="button" onClick={create} disabled={busy}>
              {claim ? "Neuen Link erstellen" : "Link erstellen"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export { ClaimLinkWin };
