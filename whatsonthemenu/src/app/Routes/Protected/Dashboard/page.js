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

  const router = useRouter();

  useEffect(() => {
    // Fetch data from API
    fetch("/api/user/profil/getData").then((response) => {
        if (response.ok) {
            response.json().then((data) => {
                setUserData(data);
            })
        }
    })
  })

  return (<div>test</div>);
}
