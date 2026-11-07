"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { Cookie } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getDictionary } from "@/i18n";

const COOKIE_NAME = "cookieConsent";

/**
 * Cookie-Hinweis. Reiner Hinweis, keine Einwilligung — es gibt nur technisch
 * notwendige Cookies (siehe /privacy, Abschnitt 5). Erscheint erst nach dem
 * Mount, damit er in keinem Prerender-HTML landet.
 */
export default function CookieBanner({ locale = "de" }) {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const consent = document.cookie.split("; ").some((row) => row.startsWith(`${COOKIE_NAME}=`));
    if (!consent) setShow(true);
  }, []);

  const dismissBanner = () => {
    const secure = window.location.protocol === "https:" ? "; Secure" : "";
    document.cookie = `${COOKIE_NAME}=acknowledged; max-age=31536000; path=/; SameSite=Lax${secure}`;
    setShow(false);
  };

  if (!show) return null;

  const t = getDictionary(locale).cookieBanner;

  return (
    // Optik an die Seite angelehnt: dunkel wie der Sprach-Hinweis, Gelb wie die
    // CTAs auf der Startseite. Kompakt unten links, damit es wenig verdeckt.
    <div
      role="region"
      aria-label={t.title}
      className="fixed inset-x-3 bottom-3 z-[9999] sm:inset-x-auto sm:bottom-5 sm:left-5 sm:max-w-sm animate-in fade-in slide-in-from-bottom-4 duration-500"
    >
      <div className="relative overflow-hidden rounded-2xl bg-gray-900 p-4 text-white shadow-2xl ring-1 ring-white/10">
        <div aria-hidden className="pointer-events-none absolute -right-10 -top-10 h-28 w-28 rounded-full bg-yellow-400/20 blur-2xl" />

        <div className="relative flex gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-yellow-400/15">
            <Cookie className="h-5 w-5 text-yellow-400" aria-hidden="true" />
          </div>

          <div className="min-w-0">
            <p className="font-semibold leading-tight">{t.title}</p>
            <p className="mt-1 text-sm leading-relaxed text-gray-300">{t.message}</p>
          </div>
        </div>

        <div className="relative mt-4 flex items-center justify-between gap-3">
          {/* Rechtsseiten sind nur deutsch, daher kein Sprachpraefix. prefetch aus:
              der Banner steht auf jeder Seite sofort im Viewport. */}
          <Link
            href="/privacy"
            prefetch={false}
            hrefLang="de"
            className="text-sm text-gray-400 underline underline-offset-4 decoration-gray-600 transition-colors hover:text-white hover:decoration-white"
          >
            {t.privacy}
          </Link>
          <Button onClick={dismissBanner} className="h-9 rounded-lg bg-yellow-400 px-5 font-semibold text-gray-900 shadow-lg shadow-yellow-400/20 hover:bg-yellow-300">
            {t.accept}
          </Button>
        </div>
      </div>
    </div>
  );
}
