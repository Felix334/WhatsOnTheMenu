import { NextRequest, NextResponse } from "next/server";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useRouter } from "next/router";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import profileImage from "./img/account_profile_user_avatar_icon_219236.jpg"; // Ensure this path is correct
import { useState } from "react";

const Profile = () => {
  const [openProfil, setOpenProfil] = useState(false);

  const toggleWindow = () => {
    if (!openProfil) {
      setOpenProfil(true);
    } else {
      setOpenProfil(false);
    }
  };

  const ProfilWin = () => {
    return(
      <div className="fixed  bg-black  flex justify-center items-center z-50">
        Popup
      </div>
    )
  }

  return (
    <div onClick={toggleWindow}>
      <Avatar className="w-12 h-12 z-50 cursor-pointer">
        {" "}
        {/* Added cursor-pointer for better UX */}
        <AvatarImage src={profileImage.src} alt="Profile Image" /> {/* Use profileImage.src for local images */}
        <AvatarFallback>Profil</AvatarFallback>
      </Avatar>
      {openProfil && <ProfilWin/>}
    </div>
  );
};
export default Profile;
