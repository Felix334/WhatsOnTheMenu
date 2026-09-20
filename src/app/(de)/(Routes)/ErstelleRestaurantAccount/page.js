"use client";

import TierChooser from "@/app/components/TierChooser";
import de from "@/i18n/de";

export default function Page() {
  return <TierChooser t={de.tierChooser} locale="de" />;
}
