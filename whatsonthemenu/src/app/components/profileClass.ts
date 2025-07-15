/*"use client";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useState, useRef, useEffect } from "react";

// Changed to dynamic import or require since static imports don't work well with images in Next.js
const profileImage = require("./img/account_profile_user_avatar_icon_219236.jpg");

interface ProfileProps {
  // Add any props if needed
}

const Profile: React.FC<ProfileProps> = () => {
  const [openProfil, setOpenProfil] = useState<boolean>(false);
  const [closeLogout, setCloseLogout] = useState<boolean>(true);
  const modalRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const currentPathname = usePathname();
  const searchParams = useSearchParams();

  const toggleWindow = () => {
    setOpenProfil(prev => !prev);
  };

  const handleClickOutside = (event: MouseEvent) => {
    if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
      setOpenProfil(false);
    }
  };

  const logout = async () => {
    window.localStorage.removeItem("userID");
    const params = new URLSearchParams(window.location.search);
    params.delete("userID");
    const newUrl = `${currentPathname}${params.toString() ? "?" + params.toString() : ""}`;
    await router.replace(newUrl, { shallow: true });
    setOpenProfil(false);
    setCloseLogout(false);
    router.refresh();
    window.location.reload();
  };

  useEffect(() => {
    if (openProfil) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [openProfil]);

  const goToProfil = async () => {
    const userID = window.localStorage.getItem("userID");
    const newQuery = new URLSearchParams(searchParams?.toString() || '');
    if (userID) {
      const path = "/Routes/Profil/";
      newQuery.set("userID", userID);
      const queryString = newQuery.toString();
      await router.replace(`${path}?${queryString}`);
      await router.refresh();
    } else {
      window.alert("Bitte anmelden");
    }
  };

  return (
    <div className="relative">
      {closeLogout && (
        <div onClick={toggleWindow}>
          <Avatar className="w-12 h-12 cursor-pointer z-50">
            <AvatarImage src={profileImage.src || profileImage.default.src} alt="Profilbild" />
            <AvatarFallback>PR</AvatarFallback>
          </Avatar>
        </div>
      )}

      {openProfil && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
          <div 
            ref={modalRef} 
            className="bg-white rounded-2xl shadow-lg p-6 w-80 max-w-full text-center space-y-4"
          >
            <Avatar className="w-20 h-20 mx-auto">
              <AvatarImage src={profileImage.src || profileImage.default.src} alt="Profilbild" />
              <AvatarFallback>PR</AvatarFallback>
            </Avatar>
            <div>
              <h2 className="text-lg font-semibold">Max Mustermann</h2>
              <p className="text-sm text-gray-500">max@example.com</p>
            </div>
            <div className="space-y-2">
              <Button className="w-full" onClick={goToProfil}>
                Profil ansehen
              </Button>

              <Link href="/settings" passHref>
                <Button variant="outline" className="w-full bg-gray-100 text-black mb-2">
                  Einstellungen
                </Button>
              </Link>
              <Button 
                variant="destructive" 
                className="w-full" 
                onClick={logout}
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

export default Profile;*/
