"use client";

import { useSearchParams } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import Link from "next/link";
import profileImage from "./img/account_profile_user_avatar_icon_219236.jpg";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { UserRound, LayoutDashboard, Settings, Store, LogOut } from "lucide-react";

const ROLE_BADGES = {
  Admin: { label: "Admin", className: "bg-red-500/10 text-red-700 border-red-200" },
  Owner: { label: "Restaurant-Besitzer", className: "bg-blue-500/10 text-blue-700 border-blue-200" },
  Staff: { label: "Angestellter", className: "bg-green-500/10 text-green-700 border-green-200" },
};

const Profile = () => {
  const searchParams = useSearchParams();
  const { data: session } = useSession();

  const role = session?.user?.role;
  const staffMembershipsRole = session?.user?.staffMemberships?.[0]?.role;
  const googleImg = session?.user?.image;
  const initials = (session?.user?.name ?? "U")
    .split(" ")
    .map((part) => part[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  const logout = async () => {
    await signOut({ redirect: true, callbackUrl: "/" });
  };

  // Query bauen
  const userID = session?.user?.id;

  const params = new URLSearchParams(searchParams.toString());

  if (userID) {
    params.set("userID", userID);
  }

  const queryString = params.toString();

  const roleBadge = ROLE_BADGES[role];
  const isTeamMember = role === "Owner" || role === "Admin" || role === "Staff";
  const isStaffish = role === "Owner" || role === "Staff" || ["manager", "waiter", "kitchen"].includes(staffMembershipsRole);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button type="button" aria-label="Profilmenü öffnen" className="rounded-full ring-2 ring-transparent transition-all hover:ring-red-200 focus-visible:outline-none focus-visible:ring-red-300 cursor-pointer">
          <Avatar className="w-10 h-10">
            <AvatarImage src={googleImg || profileImage.src} alt="Profilbild" />
            <AvatarFallback>{initials}</AvatarFallback>
          </Avatar>
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" sideOffset={8} className="w-64">
        {/* Kopf: Avatar, Name, E-Mail, Rolle */}
        <DropdownMenuLabel className="font-normal">
          <div className="flex items-center gap-3 py-1">
            <Avatar className="w-10 h-10">
              <AvatarImage src={googleImg || profileImage.src} alt="Profilbild" />
              <AvatarFallback>{initials}</AvatarFallback>
            </Avatar>
            <div className="min-w-0">
              <p className="text-sm font-semibold text-gray-900 truncate">{session?.user?.name || "User"}</p>
              <p className="text-xs text-gray-500 truncate">{session?.user?.email}</p>
            </div>
          </div>
          {roleBadge && (
            <Badge variant="outline" className={`mt-1 ${roleBadge.className}`}>
              {roleBadge.label}
            </Badge>
          )}
        </DropdownMenuLabel>

        <DropdownMenuSeparator />

        <DropdownMenuGroup>
          <DropdownMenuItem asChild>
            <Link href={`/Konto?${queryString}`}>
              <UserRound className="size-4" />
              Mein Konto
            </Link>
          </DropdownMenuItem>

          {isTeamMember && (
            <DropdownMenuItem asChild>
              <Link href={`/Profil?${queryString}`} prefetch={false}>
                <LayoutDashboard className="size-4" />
                Profil
              </Link>
            </DropdownMenuItem>
          )}

          {!isTeamMember && (
            <DropdownMenuItem asChild>
              <Link href={`/ErstelleRestaurantAccount?${queryString}`} prefetch={false}>
                <Store className="size-4" />
                Unser Partnerprogramm
              </Link>
            </DropdownMenuItem>
          )}

          {isStaffish && (
            <DropdownMenuItem asChild>
              <Link href={`/staff?${queryString}`} prefetch={false}>
                <Settings className="size-4" />
                Einstellungen
              </Link>
            </DropdownMenuItem>
          )}
        </DropdownMenuGroup>

        <DropdownMenuSeparator />

        <DropdownMenuItem onClick={logout} className="text-red-600 focus:text-red-600 focus:bg-red-50">
          <LogOut className="size-4 text-red-600" />
          Abmelden
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default Profile;
