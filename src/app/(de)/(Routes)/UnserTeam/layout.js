import { buildAlternates, getDictionary } from "@/i18n";

// Titel und Beschreibung aus dem Woerterbuch — dieselbe Quelle wie die
// uebersetzte Fassung unter (intl)/[locale]/UnserTeam, damit beide nicht
// auseinanderlaufen.
const t = getDictionary("de");

export const metadata = {
  alternates: buildAlternates("/UnserTeam", "de"),
  title: t.meta.team.title,
  description: t.meta.team.description,
};

export default function UnserTeamLayout({ children }) {
  return children;
}
