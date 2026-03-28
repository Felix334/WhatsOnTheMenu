// components/Links.js
"use client";

import Link from "next/link";
import { useMemo } from "react";
import { useSearchParams } from "next/navigation";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";

/**
 * Hilfs-Hook: Query-Parameter in Objekt umwandeln und memoizen
 */
function useQueryObject() {
  const searchParams = useSearchParams();

  return useMemo(() => {
    const q = {};
    if (searchParams) {
      for (const [key, value] of searchParams.entries()) {
        q[key] = value;
      }
    }
    return q;
  }, [searchParams]);
}

/**
 * Hook: Session-Daten
 */
function useAuth() {
  const { data: session, status } = useSession();

  const userID = session?.user?.id || "";
  const role = session?.user?.role || "";

  const authorizedUser = !!userID && status === "authenticated";
  const adminAcc = authorizedUser && role === "Admin";

  return { userID, role, authorizedUser, adminAcc };
}

/* -------------------- Links -------------------- */

// Home-Link (immer sichtbar)
export function HomeLink() {
  return <Link href="/">Home</Link>;
}

// Profil-Link
export function ProfilLink() {
  const query = useQueryObject();
  const queryString = Object.keys(query).length ? `?${new URLSearchParams(query).toString()}` : "";
  const { autherizedUser } = useAuth();

  if (!autherizedUser) return null;
  return <Link href={`/profile${queryString}`}>Profil</Link>;
}

// Admin-Link
function AdminLink({ searchParams }) {
  const queryString = Object.keys(searchParams).length ? `?${new URLSearchParams(searchParams).toString()}` : "";

  return (
    <Button>
      <Link href={`/Admin${queryString}`}>Admin</Link>
    </Button>
  );
}
// Logout-Link
export function LogoutLink() {
  const { autherizedUser } = useAuth();
  if (!autherizedUser) return null;
  return <Link href="/logout">Logout</Link>;
}

// FreeTier-Link
export default function FreeTierLink({ searchParams }) {
  const queryString = Object.keys(searchParams).length ? `?${new URLSearchParams(searchParams).toString()}` : "";

  return (
    <Button asChild>
      <Link href={`/ErstelleRestaurantAccount/FreeTier${queryString}`}>Abo abschließen</Link>
    </Button>
  );
}

// Professional-Link
export function ProfessionalTierLink({ searchParams }) {
  const queryString = Object.keys(searchParams).length ? `?${new URLSearchParams(searchParams).toString()}` : "";

return (
  <Button className="bg-yellow-400 hover:bg-green-600 text-black" asChild>
    <Link href={`/ErstelleRestaurantAccount/Professional${queryString}`}>
      Abo abschließen
    </Link>
  </Button>
);
}

// Enterprise-Link
export function EnterpriseTierLink() {
  const query = useQueryObject();
  const queryString = Object.keys(query).length ? `?${new URLSearchParams(query).toString()}` : "";

  return (
    <Button asChild>
      <Link href={`/ErstelleRestaurantAccount/Individuell${queryString}`}>Jetzt prüfen</Link>
    </Button>
  );
}

// Unsere Partner-Link
export function UnserePartnerLink() {
  const query = useQueryObject();
  const queryString = Object.keys(query).length ? `?${new URLSearchParams(query).toString()}` : "";

  return <Link href={`/UnserePartner${queryString}`}>Unsere Partner</Link>;
}

// Demo-Link
export function DemoLink() {
  const query = useQueryObject();
  const queryString = Object.keys(query).length ? `?${new URLSearchParams(query).toString()}` : "";

  return <Link href={`/demo${queryString}`}>Demo buchen</Link>;
}

// Jetzt kostenlos starten / Registrierung-Link
export function RegisterLink() {
  const query = useQueryObject();
  const queryString = Object.keys(query).length ? `?${new URLSearchParams(query).toString()}` : "";

  return <Link href={`/register${queryString}`}>Kostenlos registrieren</Link>;
}

// Alle dynamischen Links nach und nach ersetzen damit die Seite statisch geladen und gecached werden können

export { AdminLink, FreeTierLink };
