import HomePage from "@/app/components/HomePage";
import { getDictionary, buildAlternates, ogLocales } from "@/i18n";

// Uebersetzte Startseite: /en, spaeter /fr, /es ...
// Gleiches Markup wie die deutsche Fassung, nur ein anderes Woerterbuch.

export async function generateMetadata({ params }) {
  const { locale } = await params;
  const t = getDictionary(locale);

  return {
    title: t.meta.home.title,
    description: t.meta.home.description,
    alternates: buildAlternates("/", locale),
    openGraph: {
      title: t.meta.home.ogTitle,
      description: t.meta.home.ogDescription,
      url: `/${locale}`,
      siteName: "WhatIsOnMyMenu",
      locale: ogLocales[locale],
      images: [{ url: "/og-image.png", width: 1200, height: 630 }],
      type: "website",
    },
  };
}

export default async function IntlHome({ params }) {
  const { locale } = await params;
  return <HomePage t={getDictionary(locale)} locale={locale} />;
}
