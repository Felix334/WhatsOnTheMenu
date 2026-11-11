import HomePage from "@/app/components/HomePage";
import { getDictionary, buildAlternates } from "@/i18n";
export async function generateMetadata() {
  const t = getDictionary("de");
  return {
    // absolute: Keyword-Titel bewusst ohne angehaengte Marke (sonst > 60 Zeichen)
    title: { absolute: t.meta.home.title },
    description: t.meta.home.description,
    alternates: buildAlternates("/", "de"),
    // Bild kommt aus src/app/(de)/opengraph-image.js
    openGraph: {
      title: t.meta.home.ogTitle,
      description: t.meta.home.ogDescription,
      url: "/",
      siteName: "WhatIsOnMyMenu",
      locale: "de_DE",
      type: "website",
    },
  };
}

export default function Home() {
  return <HomePage t={getDictionary("de")} locale="de" />;
}
