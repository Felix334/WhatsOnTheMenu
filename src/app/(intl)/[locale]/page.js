import HomePage from "@/app/components/HomePage";
import { getDictionary, buildAlternates, ogLocales } from "@/i18n";

// Uebersetzte Startseite: /en, spaeter /fr, /es ...
// Gleiches Markup wie die deutsche Fassung, nur ein anderes Woerterbuch.

export async function generateMetadata({ params }) {
  const { locale } = await params;
  const t = getDictionary(locale);

  return {
    // absolute: Keyword-Titel bewusst ohne angehaengte Marke (sonst > 60 Zeichen)
    title: { absolute: t.meta.home.title },
    description: t.meta.home.description,
    alternates: buildAlternates("/", locale),
    // Bild kommt aus src/app/(intl)/[locale]/opengraph-image.js
    openGraph: {
      title: t.meta.home.ogTitle,
      description: t.meta.home.ogDescription,
      url: `/${locale}`,
      siteName: "WhatIsOnMyMenu",
      locale: ogLocales[locale],
      type: "website",
    },
  };
}

export default async function IntlHome({ params }) {
  const { locale } = await params;
  return <HomePage t={getDictionary(locale)} locale={locale} />;
}
