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
  const googleImg = window.sessionStorage.getItem("googleProfileImg");
  if (!googleImg) {
    const setGoogleImg = session.user?.image;
    window.sessionStorage.setItem("googleProfileImg", setGoogleImg);
  }

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
  // 1️⃣ Optional: eigenes sessionStorage/Cookies aufräumen
  sessionStorage.removeItem("googleProfileImg");

  // 2️⃣ NextAuth ausloggen
  await signOut({
    redirect: true,       // redirect true sorgt für sauberen Logout
    callbackUrl: "/",     // wohin nach Logout
  });
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
        <div className="fixed inset-0 z-[100] bg-black/20 flex items-center justify-center">
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

              {role === "Owner" && <p className="text-blue-600 font-bold">Owner</p>}
            </div>

            {/* Buttons */}
            <div className="space-y-2 grid">
              {(role === "Owner" || role === "Admin") && (
                <Link href={`/Profil?${queryString}`} onClick={() => setOpenProfil(false)}>
                  <Button variant="outline" className="w-full">
                    Profil
                  </Button>
                </Link>
              )}

              {role !== "Owner" && role !== "Admin" && (
                <Link href={`/ErstelleRestaurantAccount?${queryString}`} onClick={() => setOpenProfil(false)}>
                  <Button className="w-full">Unser Partnerprogramm</Button>
                </Link>
              )}

              <Link href={`/settings?${queryString}`} onClick={() => setOpenProfil(false)}>
                <Button variant="outline" className="w-full">
                  Einstellungen
                </Button>
              </Link>

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
