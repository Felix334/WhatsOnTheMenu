"use client";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import profileImage from "./img/account_profile_user_avatar_icon_219236.jpg";
import { useState, useRef, useEffect } from "react";

const Profile = () => {
  const [openProfil, setOpenProfil] = useState(false);
  const [closeLogout, setCloseLogout] = useState(true);
  const modalRef = useRef(null);
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const toggleWindow = () => {
    setOpenProfil(!openProfil);
  };

  const handleClickOutside = (event) => {
    if (modalRef.current && !modalRef.current.contains(event.target)) {
      setOpenProfil(false);
    }
  };

  const logout = () => {
    window.localStorage.removeItem("userID");
    const params = new URLSearchParams(searchParams.toString());
    params.delete("id");
    const newUrl = `${pathname}${params.toString() ? "?" + params.toString() : ""}`;
    router.replace(newUrl, { shallow: true }).then(() => {
      handleClickOutside();
      setCloseLogout(false);
      router.refresh();
      router.reload();
      window.location.reload();
    });
    return;
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
    const userID = window.localStorage.getItem("userID");
    const newQuery = new URLSearchParams(searchParams.toString());
    if (userID) {
      const pathname = "/Routes/Profil/";
      newQuery.set("userID", userID);
      const queryString = newQuery.toString();
      router.replace(`${pathname}?${queryString}`);
    } else {
      window.alert("Bitte anmelden");
    }
  };

  return (
    <div className="relative">
      {closeLogout ? (
        <div onClick={toggleWindow}>
          <Avatar className="w-12 h-12 cursor-pointer z-50">
            <AvatarImage src={profileImage.src} alt="Profilbild" />
            <AvatarFallback>PR</AvatarFallback>
          </Avatar>
        </div>
      ) : null}

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
                <Button variant="outline" className="w-full bg-grey-100 text-black mb-2">
                  Einstellungen
                </Button>
              </Link>
              <Button
                variant="destructive"
                className="w-full"
                onClick={() => {
                  logout();
                }}
              >
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
