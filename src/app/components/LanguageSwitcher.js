"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Globe } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { locales, localeNames, localizedPath, stripLocale } from "@/i18n/config";

/**
 * Sprachumschalter.
 *
 * Bewusst echte <Link>-Elemente statt eines JS-Handlers: Google folgt Links,
 * aber keinen onClick-Handlern. Der Umschalter ist damit gleichzeitig ein
 * Crawling-Pfad zu den uebersetzten Seiten — zusaetzlich zu hreflang.
 *
 * hreflang auf dem Link sagt dem Crawler direkt, in welche Sprache er fuehrt.
 */
export default function LanguageSwitcher({ locale, label }) {
  const pathname = usePathname() || "/";
  const basePath = stripLocale(pathname);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" aria-label={label} className="gap-1.5">
          <Globe className="h-4 w-4" />
          <span className="uppercase text-xs font-medium">{locale}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {locales.map((l) => (
          <DropdownMenuItem key={l} asChild>
            <Link href={localizedPath(basePath, l)} hrefLang={l} lang={l} className={l === locale ? "font-semibold" : undefined}>
              {localeNames[l]}
            </Link>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
