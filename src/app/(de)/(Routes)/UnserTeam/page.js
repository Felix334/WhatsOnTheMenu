import AboutPage from "@/app/components/AboutPage";
import { getDictionary } from "@/i18n";

export const dynamic = "force-static";

export default function Page() {
  return <AboutPage dict={getDictionary("de")} locale="de" />;
}
