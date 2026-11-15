import ImprintPage from "@/app/components/ImprintPage";
import { getDictionary, buildAlternates } from "@/i18n";

export const dynamic = "force-static";

const t = getDictionary("de");

export const metadata = {
  title: t.meta.imprint.title,
  description: t.meta.imprint.description,
  alternates: buildAlternates("/Impressum", "de"),
};

export default function Page() {
  return <ImprintPage dict={t} locale="de" />;
}
