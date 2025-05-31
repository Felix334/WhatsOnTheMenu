"use client"
import { NextRequest, NextResponse } from "next/server";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import profileImage from "./img/account_profile_user_avatar_icon_219236.jpg"; // Ensure this path is correct
import { useState, useRef, useEffect } from "react";

const Profile = () => {
  const [openProfil, setOpenProfil] = useState(false);
  const modalRef = useRef(null);
  const router = useRouter();

  const toggleWindow = () => {
    setOpenProfil(!openProfil);
  };

  const handleClickOutside = (event) => {
    if (modalRef.current && !modalRef.current.contains(event.target)) {
      setOpenProfil(false);
    }
  };

  useEffect(() => {
    if (openProfil) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [openProfil]);

  const goToProfil = () => {
    // Seperate Route für Restaurants
    const userID = window.localStorage.getItem("userID")
    const { query } = router;
    console.log("Daten(Profil Compontent):", query, userID)
    if (userID) {
      const pathname = "/Routes/Profil/";
      console.log("Routing Info:", pathname, query);
      const newQuery = { ...query, userID };
      const queryString = new URLSearchParams(newQuery).toString();
      router.replace(`${pathname}?${queryString}`);
    } else {
      window.alert("Bitte anmelden");
    }
  };

  return (
    <div className="relative">
      <div onClick={toggleWindow}>
        <Avatar className="w-12 h-12 cursor-pointer z-50">
          <AvatarImage src={profileImage.src} alt="Profilbild" />
          <AvatarFallback>PR</AvatarFallback>
        </Avatar>
      </div>

      {openProfil && (
        <div className="fixed inset-0 z-100 ag-opacity-zero flex items-center justify-center">
          <div ref={modalRef} className="bg-white rounded-2xl shadow-lg p-6 w-80 max-w-full text-center space-y-4 z-50">
            <Avatar className="w-20 h-20 mx-auto">
              <AvatarImage src={profileImage.src} alt="Profilbild" />
              <AvatarFallback>PR</AvatarFallback>
            </Avatar>
            <div>
              <h2 className="text-lg font-semibold">Max Mustermann</h2>
              <p className="text-sm text-gray-500">max@example.com</p>
            </div>
            <div className="space-y-2">
              <Button
                className="w-full"
                onClick={() => {
                  goToProfil();
                }}
              >
                Profil ansehen
              </Button>

              <Link href="/settings">
                <Button variant="outline" className="w-full">
                  Einstellungen
                </Button>
              </Link>
              <Button variant="destructive" className="w-full">
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
