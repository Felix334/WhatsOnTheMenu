"use client";
import { useState, useEffect, useReducer } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { NavigationMenu, NavigationMenuContent, NavigationMenuItem, NavigationMenuLink, NavigationMenuList, NavigationMenuTrigger, navigationMenuTriggerStyle } from "@/components/ui/navigation-menu";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { useRouter } from "next/navigation";

export default function Page() {
  const [userData, setUserData] = useState([]);
  const [userID, setUserID] = useState("");

  const router = useRouter();

  useEffect(() => {
    const getUserID = () => {
      const storedUserID = window.localStorage.getItem("userID");
      if (!storedUserID) return null;
      setUserID(storedUserID);
    };
    getUserID();
  }, []);

  useEffect(() => {
    const getUserData = async () => {
      if (!userID) {
        alertUser();
        return;
      }
      try {
        const resp = await fetch("/api/user/profil/getData", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            userID: userID,
          }),
        });
        const data = await resp.json();
        setUserData(data);
        console.log(data);
      } catch (error) {
        console.error("Failed to fetch user data:", error);
      }
    };
    getUserData();
  }, [userID]);

  return <div>test-dashboard</div>;
}

function alertUser() {
  window.alert("Bitte melden sie sich mit einem gültigen Benutzter-Konto an um diese Seite nutzten zu können");
}
