import { NextRequest, NextResponse } from "next/server";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"


const Profile = () =>{
    return(
    <div>
        <Avatar>
            <AvatarImage src="./Image/account_profile_user_avatar_icon_219236.webp"/>
            <AvatarFallback>Profil</AvatarFallback>
        </Avatar>
    </div>
    )
}
export default Profile