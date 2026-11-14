"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { signIn, signOut, useSession } from "next-auth/react";
import { toast } from "sonner";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

// Kunde löst einen Übernahme-Link ein: erst Google-Login, dann übernehmen.
// Alle Prüfungen passieren in /api/claim/[token].
export default function ClaimPage() {
  const { token } = useParams();
  const router = useRouter();
  const { data: session, status, update } = useSession();

  const [preview, setPreview] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [claiming, setClaiming] = useState(false);

  useEffect(() => {
    fetch(`/api/claim/${encodeURIComponent(token)}`)
      .then(async (res) => {
        const data = await res.json().catch(() => ({}));
        if (!res.ok) throw new Error(data.message || "Link ungültig");
        setPreview(data);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [token]);

  const claim = async () => {
    setClaiming(true);
    try {
      const res = await fetch(`/api/claim/${encodeURIComponent(token)}`, { method: "POST" });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.message || "Übernahme fehlgeschlagen");
      // JWT neu laden, damit Rolle "Owner" und restaurantId in der Session stehen
      await update();
      toast.success(`${data.restaurantName} gehört jetzt dir!`);
      router.replace("/Profil");
    } catch (err) {
      toast.error(err.message);
      setClaiming(false);
    }
  };

  let body;
  if (loading || status === "loading") {
    body = <p className="text-sm text-gray-500">Link wird geprüft …</p>;
  } else if (error) {
    body = <p className="text-sm text-red-600">{error}</p>;
  } else if (!session) {
    body = (
      <div className="space-y-3">
        <p className="text-sm text-gray-600">Melde dich mit deinem Google-Konto an, um das Restaurant zu übernehmen.</p>
        <Button className="w-full" onClick={() => signIn("google", { callbackUrl: window.location.href })}>
          Mit Google anmelden
        </Button>
      </div>
    );
  } else {
    body = (
      <div className="space-y-3">
        <p className="text-sm text-gray-600">
          Angemeldet als <span className="font-medium text-gray-900">{session.user?.email}</span>. Nach der Übernahme verwaltest du Speisekarte und
          Restaurant mit diesem Konto.
        </p>
        <Button className="w-full" onClick={claim} disabled={claiming}>
          {claiming ? "Wird übernommen …" : "Restaurant übernehmen"}
        </Button>
        <Button variant="ghost" className="w-full" onClick={() => signOut({ callbackUrl: window.location.href })} disabled={claiming}>
          Anderes Konto verwenden
        </Button>
      </div>
    );
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-amber-50 p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>{preview ? preview.restaurantName : "Restaurant übernehmen"}</CardTitle>
          <CardDescription>
            Für dich wurde auf WhatIsOnMyMenu.com bereits eine digitale Speisekarte vorbereitet.
            {preview?.restrictedToEmail && " Dieser Link ist an ein bestimmtes Google-Konto gebunden."}
          </CardDescription>
        </CardHeader>
        <CardContent>{body}</CardContent>
      </Card>
    </main>
  );
}
