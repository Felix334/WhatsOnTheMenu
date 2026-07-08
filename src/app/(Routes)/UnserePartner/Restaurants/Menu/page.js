import { redirect } from "next/navigation";

// Alt-URL (?restaurantID=...): bereits gedruckte QR-Codes bleiben gültig und
// landen per Redirect auf der neuen, CDN-gecachten Pfad-URL
export default async function LegacyMenuRedirect({ searchParams }) {
  const { restaurantID, tableNumber } = await searchParams;
  if (!restaurantID) redirect("/");
  const suffix = tableNumber ? `?tableNumber=${encodeURIComponent(tableNumber)}` : "";
  redirect(`/UnserePartner/Restaurants/Menu/${encodeURIComponent(restaurantID)}${suffix}`);
}
