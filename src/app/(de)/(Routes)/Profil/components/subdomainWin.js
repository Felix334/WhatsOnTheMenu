"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { ExternalLink } from "lucide-react";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { subdomainSchema } from "@/lib/schemas/subdomain";

const ROOT_DOMAIN = "whatisonmymenu.com";

// Lokal zeigt der Link auf <subdomain>.localhost:<port>, sonst auf die echte Domain
export const buildSubdomainUrl = (subdomain) => {
  if (typeof window !== "undefined" && window.location.hostname.endsWith("localhost")) {
    const { protocol, port } = window.location;
    return `${protocol}//${subdomain}.localhost${port ? `:${port}` : ""}`;
  }
  return `https://${subdomain}.${ROOT_DOMAIN}`;
};

const SubdomainWin = ({ open, onOpenChange, restaurantId, onSaved }) => {
  const [saved, setSaved] = useState(null);
  const [value, setValue] = useState("");
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!open || !restaurantId) return;
    setLoading(true);
    fetch(`/api/user/profil/subdomain?restaurantId=${encodeURIComponent(restaurantId)}`)
      .then((res) => (res.ok ? res.json() : Promise.reject(res)))
      .then((data) => {
        setSaved(data.subdomain);
        setValue(data.subdomain ?? "");
      })
      .catch(() => toast.error("Subdomain konnte nicht geladen werden"))
      .finally(() => setLoading(false));
  }, [open, restaurantId]);

  const normalized = value.trim().toLowerCase();
  const validation = normalized ? subdomainSchema.safeParse(normalized) : null;
  const error = validation && !validation.success ? validation.error.issues[0]?.message : null;
  const unchanged = normalized === (saved ?? "");

  const save = async (subdomain) => {
    setSaving(true);
    try {
      const res = await fetch("/api/user/profil/subdomain", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ restaurantId, subdomain }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.message || "Fehler beim Speichern");
      setSaved(data.subdomain);
      setValue(data.subdomain ?? "");
      onSaved?.(data.subdomain ?? null);
      toast.success(data.subdomain ? "Subdomain gespeichert!" : "Subdomain entfernt");
    } catch (err) {
      toast.error(err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Eigene Subdomain</DialogTitle>
          <DialogDescription>Gäste erreichen deine Speisekarte dann direkt unter einer eigenen Adresse.</DialogDescription>
        </DialogHeader>

        <form
          className="space-y-4"
          onSubmit={(e) => {
            e.preventDefault();
            if (!error && normalized && !unchanged) save(normalized);
          }}
        >
          <div className="space-y-1.5">
            <Label htmlFor="subdomain">Subdomain</Label>
            <div className="flex items-center gap-2">
              <Input id="subdomain" value={value} onChange={(e) => setValue(e.target.value)} placeholder="deinrestaurant" disabled={loading || saving} autoComplete="off" spellCheck={false} maxLength={63} className="flex-1" />
              <span className="text-sm text-gray-500 whitespace-nowrap">.{ROOT_DOMAIN}</span>
            </div>
            {error ? <p className="text-xs text-red-500">{error}</p> : <p className="text-xs text-gray-400">3–63 Zeichen: Kleinbuchstaben, Ziffern und Bindestriche.</p>}
          </div>

          {saved && (
            <div className="rounded-lg border bg-gray-50 px-3 py-2 text-sm flex items-center justify-between gap-2">
              <span className="truncate">
                Aktiv: <strong>{saved}.{ROOT_DOMAIN}</strong>
              </span>
              <a href={buildSubdomainUrl(saved)} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-amber-600 hover:underline shrink-0">
                Öffnen <ExternalLink className="size-3.5" />
              </a>
            </div>
          )}

          <div className="flex justify-end gap-2">
            {saved && (
              <Button type="button" variant="outline" onClick={() => save(null)} disabled={saving}>
                Entfernen
              </Button>
            )}
            <Button type="submit" disabled={loading || saving || !normalized || !!error || unchanged}>
              {saving ? "Speichern…" : "Speichern"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export { SubdomainWin };
