// components/Links.js
"use client";

import Link from "next/link";
import { useMemo } from "react";
import { useSearchParams } from "next/navigation";
import { useSession } from "next-auth/react";

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
  const autherizedUser = userID && status === "authenticated";
  const adminAcc = autherizedUser && role === "Admin";

  return { userID, role, autherizedUser, adminAcc };
}

/* -------------------- Links -------------------- */

// Home-Link (immer sichtbar)
export function HomeLink() {
  return <Link href="/">Home</Link>;
}

// Profil-Link
export function ProfilLink() {
  const query = useQueryObject();
  const queryString = Object.keys(query).length
    ? `?${new URLSearchParams(query).toString()}`
    : "";
  const { autherizedUser } = useAuth();

  if (!autherizedUser) return null;
  return <Link href={`/profile${queryString}`}>Profil</Link>;
}

// Admin-Link
export function AdminLink() {
  const query = useQueryObject();
  const queryString = Object.keys(query).length
    ? `?${new URLSearchParams(query).toString()}`
    : "";
  const { autherizedUser, adminAcc } = useAuth();

  if (!autherizedUser || !adminAcc) return null;
  return <Link href={`/admin${queryString}`}>Admin</Link>;
}

// Logout-Link
export function LogoutLink() {
  const { autherizedUser } = useAuth();
  if (!autherizedUser) return null;
  return <Link href="/logout">Logout</Link>;
}

// FreeTier-Link
export function FreeTierLink() {
  const query = useQueryObject();
  const queryString = Object.keys(query).length
    ? `?${new URLSearchParams(query).toString()}`
    : "";

  return <Link href={`/ErstelleRestaurantAccount/FreeTier${queryString}`}>Jetzt starten</Link>;
}

// Professional-Link
export function ProfessionalLink() {
  const query = useQueryObject();
  const queryString = Object.keys(query).length
    ? `?${new URLSearchParams(query).toString()}`
    : "";

  return <Link href={`/ErstelleRestaurantAccount/Professional${queryString}`}>Jetzt starten</Link>;
}

// Enterprise-Link
export function EnterpriseLink() {
  const query = useQueryObject();
  const queryString = Object.keys(query).length
    ? `?${new URLSearchParams(query).toString()}`
    : "";

  return <Link href={`/ErstelleRestaurantAccount/Individuell${queryString}`}>Jetzt prüfen</Link>;
}

// Unsere Partner-Link
export function UnserePartnerLink() {
  const query = useQueryObject();
  const queryString = Object.keys(query).length
    ? `?${new URLSearchParams(query).toString()}`
    : "";

  return <Link href={`/UnserePartner${queryString}`}>Unsere Partner</Link>;
}

// Demo-Link
export function DemoLink() {
  const query = useQueryObject();
  const queryString = Object.keys(query).length
    ? `?${new URLSearchParams(query).toString()}`
    : "";

  return <Link href={`/demo${queryString}`}>Demo buchen</Link>;
}

// Jetzt kostenlos starten / Registrierung-Link
export function RegisterLink() {
  const query = useQueryObject();
  const queryString = Object.keys(query).length
    ? `?${new URLSearchParams(query).toString()}`
    : "";

  return <Link href={`/register${queryString}`}>Kostenlos registrieren</Link>;
}



// Alle dynamischen Links nach und nach ersetzen damit die Seite statisch geladen werden kann