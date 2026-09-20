import HowItWorksPage from "@/app/components/HowItWorksPage";
import { getDictionary, buildAlternates } from "@/i18n";

// Der Pfad bleibt bewusst "/WieFunktionierts", auch auf Englisch (/en/WieFunktionierts).
// Ein uebersetzter Pfad waere schoener zu lesen, wuerde aber bedeuten, dass
// hreflang zwischen zwei unterschiedlichen Pfaden verweist — das ist erlaubt,
// macht die Sitemap und den Sprachumschalter aber deutlich fehleranfaelliger.
// Google bewertet den Pfad-Namen ohnehin kaum; entscheidend ist der Inhalt.

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
