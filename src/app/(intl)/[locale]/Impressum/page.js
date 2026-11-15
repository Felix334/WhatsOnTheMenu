import ImprintPage from "@/app/components/ImprintPage";
import { getDictionary, buildAlternates } from "@/i18n";

export const dynamic = "force-static";

export async function generateMetadata({ params }) {
  const { locale } = await params;
  const t = getDictionary(locale);
  return {
    title: t.meta.imprint.title,
    description: t.meta.imprint.description,
    alternates: buildAlternates("/Impressum", locale),
  };
}

export default async function Page({ params }) {
  const { locale } = await params;
  return <ImprintPage dict={getDictionary(locale)} locale={locale} />;
}
