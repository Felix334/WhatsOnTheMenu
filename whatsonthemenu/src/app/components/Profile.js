import { NextRequest, NextResponse } from "next/server";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useRouter } from "next/router";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const Profile = () => {

  return (
    <div>
      <Avatar className="w-12 h-12 z-50">
        <AvatarImage src="/Image/account_profile_user_avatar_icon_219236.webp" /> {/* Corrected src path */}
        <AvatarFallback>Profil</AvatarFallback>
        <Link href="./Routes/Profil"></Link>
      </Avatar>
    </div>
  );
};

export default Profile;