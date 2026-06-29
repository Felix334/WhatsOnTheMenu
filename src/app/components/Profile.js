"use client";

import { useSearchParams } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import Link from "next/link";
import profileImage from "./img/account_profile_user_avatar_icon_219236.jpg";
import { useState, useRef, useEffect } from "react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";

const Profile = () => {
  const [openProfil, setOpenProfil] = useState(false);
  const modalRef = useRef(null);

  const searchParams = useSearchParams();
  const { data: session } = useSession();

  const role = session?.user?.role;
  const staffMembershipsRole = session?.user?.staffMemberships?.role;
  const googleImg = session?.user?.image;

  // Toggle
  const toggleWindow = () => {
    setOpenProfil((prev) => !prev);
  };

  // Outside click
  const handleClickOutside = (e) => {
    if (modalRef.current && !modalRef.current.contains(e.target)) {
      setOpenProfil(false);
    }
  };

  // Listener
  useEffect(() => {
    if (openProfil) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [openProfil]);

  // Logout

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

  return (
    <div className="relative">
      {/* Avatar */}
      <div onClick={toggleWindow}>
        <Avatar className="w-12 h-12 cursor-pointer">
          <AvatarImage src={googleImg || profileImage.src} alt="Profilbild" />
          <AvatarFallback>PR</AvatarFallback>
        </Avatar>
      </div>

      {/* Modal */}
      {openProfil && (
        <div className="fixed inset-0 z-100 bg-black/20 flex items-center justify-center">
          <div ref={modalRef} className="bg-white rounded-2xl shadow-lg p-6 w-80 text-center space-y-4">
            {/* Avatar groß */}
            <Avatar className="w-20 h-20 mx-auto">
              <AvatarImage src={googleImg || profileImage.src} alt="Profilbild" />

              <AvatarFallback>PR</AvatarFallback>
            </Avatar>

            {/* User Info */}
            <div>
              <h2 className="text-lg font-semibold">{session?.user?.name || "User"}</h2>

              <p className="text-sm text-gray-500">{session?.user?.email}</p>

              {role === "Admin" && <p className="text-red-600 font-bold">Admin</p>}

              {role === "Owner" && <p className="text-blue-600 font-bold">Restaurant-Besitzer</p>}

              {role === "Staff" && <p className="text-green-500 font-bold">Angestellter</p>}
            </div>

            {/* Buttons */}
            <div className="space-y-2 grid">
              {/* Eigene Konto-Seite – für jeden angemeldeten Nutzer */}
              <Link href={`/Konto?${queryString}`} onClick={() => setOpenProfil(false)}>
                <Button variant="outline" className="w-full">
                  Mein Konto
                </Button>
              </Link>

              {(role === "Owner" || role === "Admin" || role === "Staff") && (
                <Link href={`/Profil?${queryString}`} onClick={() => setOpenProfil(false)} prefetch={false}>
                  <Button variant="outline" className="w-full">
                    Profil
                  </Button>
                </Link>
              )}

              {role !== "Owner" && role !== "Admin" && role !== "Staff" && (
                <Link href={`/ErstelleRestaurantAccount?${queryString}`} onClick={() => setOpenProfil(false)} prefetch={false}>
                  <Button className="w-full">Unser Partnerprogramm</Button>
                </Link>
              )}
              {(role === "Owner" || role === "Staff" || staffMembershipsRole === "manager" || staffMembershipsRole === "waiter" || staffMembershipsRole === "kitchen") && (
                <Link href={`/staff?${queryString}`} onClick={() => setOpenProfil(false)} prefetch={false}>
                  <Button variant="outline" className="w-full">
                    Einstellungen
                  </Button>
                </Link>
              )}

              <Button variant="destructive" className="w-full" onClick={logout}>
                Abmelden
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;
