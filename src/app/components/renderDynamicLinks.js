// components/Links.js
"use client";
import Link from "next/link";
import { useMemo } from "react";
import { useSearchParams } from "next/navigation";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { hasEqualOrHigherTier } from "@/lib/tierRank";
import de from "@/i18n/de";
import { localizedPath } from "@/i18n/config";

// Beschriftungen kommen aus dem Woerterbuch. Ohne labels-Prop faellt jede
// Komponente auf Deutsch zurueck — so bleiben alle bestehenden Aufrufer
// in den deutschen Seiten unveraendert gueltig.
const fallback = de.links;

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

export function HomeLink({ labels = fallback }) {
  return <Link href="/">{labels.home}</Link>;
}

export function ProfilLink({ labels = fallback }) {
  const query = useQueryObject();
  const queryString = Object.keys(query).length ? `?${new URLSearchParams(query).toString()}` : "";
  const { authorizedUser } = useAuth();
  if (!authorizedUser) return null;
  return <Link href={`/profile${queryString}`} prefetch={false}>{labels.profile}</Link>;
}

function AdminLink({ labels = fallback }) {
  const query = useQueryObject();
  const queryString = Object.keys(query).length ? `?${new URLSearchParams(query).toString()}` : "";
  return (
    <Button asChild>
      <Link href={`/Admin${queryString}`}>{labels.adminConsole}</Link>
    </Button>
  );
}

export function LogoutLink({ labels = fallback }) {
  const { authorizedUser } = useAuth();
  if (!authorizedUser) return null;
  return <Link href="/logout">{labels.logout}</Link>;
}

export default function FreeTierLink({ className, labels = fallback }) {
  const query = useQueryObject();
  const queryString = Object.keys(query).length ? `?${new URLSearchParams(query).toString()}` : "";
  const { data: session } = useSession();

  if (hasEqualOrHigherTier(session?.user?.subscription, "FreeTier")) {
    return (
      <Button className={className} variant="outline" disabled>
        {labels.alreadyActive}
      </Button>
    );
  }

  return (
    <Button asChild className={className}>
      <Link href={`/ErstelleRestaurantAccount/FreeTier${queryString}`}>{labels.subscribe}</Link>
    </Button>
  );
}

export function BusinessTierLink({ className, labels = fallback }) {
  const query = useQueryObject();
  const { userID } = useAuth();
  const { data: session } = useSession();

  if (hasEqualOrHigherTier(session?.user?.subscription, "Business")) {
    return (
      <Button className={className} variant="outline" disabled>
        {labels.alreadyActive}
      </Button>
    );
  }

  return (
    <Button className={className} asChild>
      <Link href={{ pathname: "/ErstelleRestaurantAccount/Business", query: { ...query, ...(userID ? { userID } : {}) } }} prefetch={false}>
        {labels.subscribe}
      </Link>
    </Button>
  );
}

export function ProfessionalTierLink({ labels = fallback }) {
  const query = useQueryObject();
  const { userID } = useAuth();
  const { data: session } = useSession();

  if (hasEqualOrHigherTier(session?.user?.subscription, "Professional")) {
    return (
      <Button variant="outline" disabled>
        {labels.alreadyActive}
      </Button>
    );
  }

  return (
    <Button className="bg-yellow-400 hover:bg-green-600 text-black" asChild>
      <Link href={{ pathname: "/ErstelleRestaurantAccount/Professional", query: { ...query, ...(userID ? { userID } : {}) } }} prefetch={false}>
        {labels.subscribe}
      </Link>
    </Button>
  );
}

export function EnterpriseTierLink({ labels = fallback }) {
  const query = useQueryObject();
  const queryString = Object.keys(query).length ? `?${new URLSearchParams(query).toString()}` : "";
  return (
    <Button asChild>
      <Link href={`/ErstelleRestaurantAccount/Individuell${queryString}`}>{labels.checkNow}</Link>
    </Button>
  );
}

export function DemoLink({ labels = fallback }) {
  const query = useQueryObject();
  const queryString = Object.keys(query).length ? `?${new URLSearchParams(query).toString()}` : "";
  return <Link href={`/demo${queryString}`}>{labels.bookDemo}</Link>;
}

export function RegisterLink({ labels = fallback }) {
  const query = useQueryObject();
  const queryString = Object.keys(query).length ? `?${new URLSearchParams(query).toString()}` : "";
  return <Link href={`/register${queryString}`}>{labels.registerFree}</Link>;
}

export function WieFunktionierts({ locale = "de", label }) {
  const query = useQueryObject();
  const queryString = Object.keys(query).length ? `?${new URLSearchParams(query).toString()}` : "";
  return (
    <Link href={`${localizedPath("/WieFunktionierts", locale)}${queryString}`} prefetch={false}>
      {label ?? fallback.howItWorks}
    </Link>
  );
}

export { AdminLink, FreeTierLink };