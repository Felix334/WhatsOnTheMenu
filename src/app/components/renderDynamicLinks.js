// components/Links.js
"use client";
import Link from "next/link";
import { useMemo } from "react";
import { useSearchParams } from "next/navigation";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { hasEqualOrHigherTier } from "@/lib/tierRank";

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
  return <Link href={`/profile${queryString}`} prefetch={false}>Profil</Link>;
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

export default function FreeTierLink({ className }) {
  const query = useQueryObject();
  const queryString = Object.keys(query).length ? `?${new URLSearchParams(query).toString()}` : "";
  const { data: session } = useSession();

  if (hasEqualOrHigherTier(session?.user?.subscription, "FreeTier")) {
    return (
      <Button className={className} variant="outline" disabled>
        Bereits aktiv
      </Button>
    );
  }

  return (
    <Button asChild className={className}>
      <Link href={`/ErstelleRestaurantAccount/FreeTier${queryString}`}>Abo abschließen</Link>
    </Button>
  );
}

export function BusinessTierLink({ className }) {
  const query = useQueryObject();
  const { userID } = useAuth();
  const { data: session } = useSession();

  if (hasEqualOrHigherTier(session?.user?.subscription, "Business")) {
    return (
      <Button className={className} variant="outline" disabled>
        Bereits aktiv
      </Button>
    );
  }

  return (
    <Button className={className} asChild>
      <Link href={{ pathname: "/ErstelleRestaurantAccount/Business", query: { ...query, ...(userID ? { userID } : {}) } }} prefetch={false}>
        Abo abschließen
      </Link>
    </Button>
  );
}

export function ProfessionalTierLink() {
  const query = useQueryObject();
  const { userID } = useAuth();
  const { data: session } = useSession();

  if (hasEqualOrHigherTier(session?.user?.subscription, "Professional")) {
    return (
      <Button variant="outline" disabled>
        Bereits aktiv
      </Button>
    );
  }

  return (
    <Button className="bg-yellow-400 hover:bg-green-600 text-black" asChild>
      <Link href={{ pathname: "/ErstelleRestaurantAccount/Professional", query: { ...query, ...(userID ? { userID } : {}) } }} prefetch={false}>
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
  return <Link href={`/WieFunktionierts${queryString}`} prefetch={false}>Wie Funktionierts</Link>;
}

export { AdminLink, FreeTierLink };