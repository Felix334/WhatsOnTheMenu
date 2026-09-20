import AboutPage from "@/app/components/AboutPage";
import { getDictionary, buildAlternates } from "@/i18n";

export const dynamic = "force-static";

export async function generateMetadata({ params }) {
  const { locale } = await params;
  const t = getDictionary(locale);
  return {
    title: t.meta.team.title,
    description: t.meta.team.description,
    alternates: buildAlternates("/UnserTeam", locale),
  };
}

export default async function Page({ params }) {
  const { locale } = await params;
  return <AboutPage dict={getDictionary(locale)} locale={locale} />;
}
