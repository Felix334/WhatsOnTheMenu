import HomePage from "@/app/components/HomePage";
import { getDictionary, buildAlternates } from "@/i18n";
export async function generateMetadata() {
  const t = getDictionary("de");
  return {
    title: t.meta.home.title,
    description: t.meta.home.description,
    alternates: buildAlternates("/", "de"),
    openGraph: {
      title: t.meta.home.ogTitle,
      description: t.meta.home.ogDescription,
      url: "/",
      siteName: "WhatIsOnMyMenu",
      locale: "de_DE",
      images: [{ url: "/og-image.png", width: 1200, height: 630 }],
      type: "website",
    },
  };
}

export default function Home() {
  return <HomePage t={getDictionary("de")} locale="de" />;
}
