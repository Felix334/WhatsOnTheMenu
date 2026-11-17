"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { useUiLanguage } from "@/app/components/useUiLanguage";
import { fmt } from "@/i18n/format";
import { Copy, Link2 } from "lucide-react";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

// Nur für Bau-Accounts sichtbar (Server entscheidet über CLAIM_BUILDER_EMAILS).
// Erzeugt einen Link, mit dem ein Kunde dieses Restaurant übernimmt.
const ClaimLinkWin = () => {
  const { t: uiDict, locale } = useUiLanguage();
  const tc = uiDict.dashboard.claimLink;
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
      if (!res.ok) throw new Error(data.message || tc.createError);
      setClaim(data.claim);
      setLink(`${window.location.origin}/beanspruchen/${data.token}`);
      toast.success(tc.created);
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
      if (!res.ok) throw new Error(tc.revokeError);
      setClaim(null);
      setLink("");
      toast.success(tc.revoked);
    } catch (err) {
      toast.error(err.message);
    } finally {
      setBusy(false);
    }
  };

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(link);
      toast.success(tc.copied);
    } catch {
      toast.error(tc.copyError);
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <Link2 className="size-4" />
          <span className="hidden md:inline">{tc.button}</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{tc.title}</DialogTitle>
          <DialogDescription>
            {tc.description}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="claim-email">{tc.emailLabel}</Label>
            <Input
              id="claim-email"
              type="email"
              placeholder={tc.emailPlaceholder}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={busy}
            />
            <p className="text-xs text-gray-500">{tc.emailHint}</p>
          </div>

          {link ? (
            <div className="space-y-2">
              <Label htmlFor="claim-link">{tc.linkLabel}</Label>
              <div className="flex gap-2">
                <Input id="claim-link" readOnly value={link} onFocus={(e) => e.target.select()} />
                <Button type="button" variant="outline" size="icon" onClick={copy} aria-label={tc.copy}>
                  <Copy className="size-4" />
                </Button>
              </div>
            </div>
          ) : (
            claim && (
              <p className="text-sm text-gray-600">
                {fmt(claim.email ? tc.activeFor : tc.active, {
                  email: claim.email,
                  date: new Date(claim.expiresAt).toLocaleDateString(locale === "de" ? "de-DE" : "en-GB"),
                })}
              </p>
            )
          )}

          <div className="flex justify-end gap-2">
            {claim && (
              <Button type="button" variant="ghost" onClick={revoke} disabled={busy}>
                {tc.revoke}
              </Button>
            )}
            <Button type="button" onClick={create} disabled={busy}>
              {claim ? tc.createNew : tc.create}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export { ClaimLinkWin };
