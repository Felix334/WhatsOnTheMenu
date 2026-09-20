"use client";

import { useCallback, useMemo, useState } from "react";
import { useSession } from "next-auth/react";
import { getDictionary } from "@/i18n";
import { defaultLocale, isLocale } from "@/i18n/config";

/**
 * Oberflaechensprache der eingeloggten Bereiche (Profil, staff).
 *
 * Kommt aus `User.language` ueber das JWT — NICHT aus der URL. Die
 * eingeloggten Bereiche sind in robots.txt gesperrt, ein Sprach-Praefix
 * braechte dort keinen SEO-Vorteil, wuerde aber jede geschuetzte Route im
 * Middleware-`matcher` verdoppeln (`/staff` UND `/en/staff`) — eine
 * vergessene Zeile dort waere ein offenes Dashboard.
 *
 * Zweiter Vorteil: der Kellner bekommt seine Sprache, auch wenn der Chef
 * auf Deutsch arbeitet. Bei einer URL-Loesung haengt die Sprache am Link,
 * ueber den jemand hereinkommt.
 */
export function useUiLanguage() {
  const { data: session, update } = useSession();
  const [pending, setPending] = useState(false);

  const raw = session?.user?.language;
  const locale = isLocale(raw) ? raw : defaultLocale;
  const dict = useMemo(() => getDictionary(locale), [locale]);

  const setLanguage = useCallback(
    async (next) => {
      if (!isLocale(next) || next === locale) return;
      setPending(true);
      try {
        const res = await fetch("/api/user/language", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ language: next }),
        });
        if (!res.ok) throw new Error("Language update failed");
        // JWT neu ziehen, damit die Sprache ohne Reload ueberall greift —
        // dasselbe Muster wie beim Abo-Wechsel.
        await update();
      } finally {
        setPending(false);
      }
    },
    [locale, update]
  );

  return { locale, t: dict, setLanguage, pending };
}
