// components/Links.js
"use client";
import Link from "next/link";
import { useMemo } from "react";
import { useSearchParams } from "next/navigation";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";

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

function useAuth() {
  const { data: session, status } = useSession();
  const userID = session?.user?.id || "";
  const role = session?.user?.role || "";
  const authorizedUser = !!userID && status === "authenticated";
  const adminAcc = authorizedUser && role === "Admin";
  return { userID, role, authorizedUser, adminAcc };
}

export function HomeLink() {
  return <Link href="/">Home</Link>;
}

export function ProfilLink() {
  const query = useQueryObject();
  const queryString = Object.keys(query).length ? `?${new URLSearchParams(query).toString()}` : "";
  const { authorizedUser } = useAuth();
  if (!authorizedUser) return null;
  return <Link href={`/profile${queryString}`}>Profil</Link>;
}

function AdminLink() {
  const query = useQueryObject();
  const queryString = Object.keys(query).length ? `?${new URLSearchParams(query).toString()}` : "";
  return (
    <Button asChild>
      <Link href={`/Admin${queryString}`}>Admin Konsole</Link>
    </Button>
  );
}

export function LogoutLink() {
  const { authorizedUser } = useAuth();
  if (!authorizedUser) return null;
  return <Link href="/logout">Logout</Link>;
}

export default function FreeTierLink() {
  const query = useQueryObject();
  const queryString = Object.keys(query).length ? `?${new URLSearchParams(query).toString()}` : "";
  return (
    <Button asChild>
      <Link href={`/ErstelleRestaurantAccount/FreeTier${queryString}`}>Abo abschließen</Link>
    </Button>
  );
}

export function ProfessionalTierLink() {
  const query = useQueryObject();
  const { userID } = useAuth();
  return (
    <Button className="bg-yellow-400 hover:bg-green-600 text-black" asChild>
      <Link href={{ pathname: "/ErstelleRestaurantAccount/Professional", query: { ...query, ...(userID ? { userID } : {}) } }}>
        Abo abschließen
      </Link>
    </Button>
  );
}

export function EnterpriseTierLink() {
  const query = useQueryObject();
  const queryString = Object.keys(query).length ? `?${new URLSearchParams(query).toString()}` : "";
  return (
    <Button asChild>
      <Link href={`/ErstelleRestaurantAccount/Individuell${queryString}`}>Jetzt prüfen</Link>
    </Button>
  );
}

export function DemoLink() {
  const query = useQueryObject();
  const queryString = Object.keys(query).length ? `?${new URLSearchParams(query).toString()}` : "";
  return <Link href={`/demo${queryString}`}>Demo buchen</Link>;
}

export function RegisterLink() {
  const query = useQueryObject();
  const queryString = Object.keys(query).length ? `?${new URLSearchParams(query).toString()}` : "";
  return <Link href={`/register${queryString}`}>Kostenlos registrieren</Link>;
}

export function WieFunktionierts() {
  const query = useQueryObject();
  const queryString = Object.keys(query).length ? `?${new URLSearchParams(query).toString()}` : "";
  return <Link href={`/WieFunktionierts${queryString}`}>Wie Funktionierts</Link>;
}

export { AdminLink, FreeTierLink };