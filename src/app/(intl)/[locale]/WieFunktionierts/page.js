import HowItWorksPage from "@/app/components/HowItWorksPage";
import { getDictionary, buildAlternates } from "@/i18n";

// Der Ordner heisst "WieFunktionierts", die englische URL ist aber
// /en/how-it-works — Zuordnung, Rewrite und Weiterleitung kommen aus
// src/i18n/slugs.mjs. Hier immer den sprachneutralen Pfad verwenden.

export const dynamic = "force-static";

export async function generateMetadata({ params }) {
  const { locale } = await params;
  const t = getDictionary(locale);
  return {
    title: t.meta.howItWorks.title,
    description: t.meta.howItWorks.description,
    alternates: buildAlternates("/WieFunktionierts", locale),
  };
}

export default async function Page({ params }) {
  const { locale } = await params;
  return <HowItWorksPage dict={getDictionary(locale)} locale={locale} />;
}
