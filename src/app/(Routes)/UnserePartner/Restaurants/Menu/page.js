import { notFound, permanentRedirect } from "next/navigation";

// Alt-URL (?restaurantID=...): bereits gedruckte QR-Codes bleiben gültig und
// landen per Redirect auf der neuen, CDN-gecachten Pfad-URL.
// permanentRedirect = 308: signalisiert Google den dauerhaften Umzug, damit die
// Alt-URL aus dem Index fällt (307 hätte sie dort auf Dauer gehalten).
export default async function LegacyMenuRedirect({ searchParams }) {
  const { restaurantID, tableNumber } = await searchParams;
  if (!restaurantID) notFound();
  const suffix = tableNumber ? `?tableNumber=${encodeURIComponent(tableNumber)}` : "";
  permanentRedirect(`/UnserePartner/Restaurants/Menu/${encodeURIComponent(restaurantID)}${suffix}`);
}
