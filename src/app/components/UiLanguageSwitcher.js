"use client";

import { Globe } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { locales, localeNames } from "@/i18n/config";
import { useUiLanguage } from "./useUiLanguage";

/**
 * Sprachumschalter fuer die eingeloggten Bereiche.
 *
 * Anders als LanguageSwitcher (oeffentliche Seiten) fuehrt er nicht auf eine
 * andere URL, sondern speichert die Sprache am Nutzer. Deshalb Buttons statt
 * Links — hier gibt es nichts zu crawlen.
 */
export default function UiLanguageSwitcher({ className }) {
  const { locale, t, setLanguage, pending } = useUiLanguage();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" aria-label={t.nav.language} disabled={pending} className={`gap-1.5 ${className || ""}`}>
          <Globe className="h-4 w-4" />
          <span className="uppercase text-xs font-medium">{locale}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {locales.map((l) => (
          <DropdownMenuItem key={l} onSelect={() => setLanguage(l)} className={l === locale ? "font-semibold" : undefined}>
            {localeNames[l]}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
