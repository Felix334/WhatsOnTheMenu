import { buildAlternates } from "@/i18n";

export const metadata = {
  alternates: buildAlternates("/UnserTeam", "de"),
  title: "Unser Team | WhatIsOnMyMenu.com",
  description: "Lerne das Team hinter WhatIsOnMyMenu.com kennen.",
};

export default function UnserTeamLayout({ children }) {
  return children;
}
