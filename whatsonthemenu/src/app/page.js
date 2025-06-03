"use client";

// Nicht den Ordner extra öffen

import Image from "next/image";
import Link from "next/link";
import LoginForm from "./components/Anmelden";
import Registrieren from "./components/Registrieren";
import Profile from "./components/Profile";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { NavigationMenu, NavigationMenuContent, NavigationMenuItem, NavigationMenuLink, NavigationMenuList, NavigationMenuTrigger, navigationMenuTriggerStyle } from "@/components/ui/navigation-menu";
import PermControleLocation from "./components/LocasionPermission";
import { useRouter } from "next/navigation";
import path from "path";


// Mit next/auth neuschreiben

export default function Home() {
  const [renderLogin, setRenderLogin] = useState(false);
  const [closeInput, setCloseInput] = useState(false);
  const [renderRegister, setRenderRegister] = useState(false);
  const [userID, setUserID] = useState("");
 const [hasReloaded, setHasReloaded] = useState(false);

  const router = useRouter();

  useEffect(() => {
    if (userID) {
      window.localStorage.setItem("userID", userID);
    } else {
      var userID_ = window.localStorage.getItem("userID");
      if (userID_) {
        setUserID(userID_);
      }
    }
  }, [userID]);

   useEffect(() => { // Fixes the url reload
    if (userID) {
      window.localStorage.setItem("userID", userID);
      const currentQuery = { ...router.query, userID };
      const queryString = new URLSearchParams(currentQuery).toString();
      const newUrl = `/?${queryString}`;
      router.replace(newUrl);
    }
  }, [userID, router]);


  const renderLoginW = () => {
    if (!renderLogin) {
      setRenderLogin(true);
    } else {
      setRenderLogin(false);
    }
  };

  const renderRegisterW = () => {
    if (!renderRegister) {
      setRenderRegister(true);
    } else {
      setRenderRegister(false);
    }
  };

  const goToUnserTeam = () => {
    if (userID) {
      const { query } = router;
      const pathname = "/Routes/Partner/";
      console.log("Routing Info:(page.js)", pathname, query);
      const newQuery = { ...query, userID };
      const queryString = new URLSearchParams(newQuery).toString();
      router.replace(`${pathname}?${queryString}`);
    } else {
      router.push("/Routes/Profil");
    }
  };

  const goToProfil = () => {
    // Seperate Route für Restaurants
    if (userID) {
      const { query } = router;
      const pathname = "/Routes/Profil/";
      console.log("Routing Info:(page.js)", pathname, query);
      const newQuery = { ...query, userID };
      const queryString = new URLSearchParams(newQuery).toString();
      router.replace(`${pathname}?${queryString}`);
    } else {
      window.alert("Bitte anmelden");
    }
  };
  
  const MobileFunktion = () => {
    if (userID) {
      const { query } = router;
      const pathname = "/Routes/Mobile/";
      console.log("Routing Info:(page.js)", pathname, query);
      const newQuery = { ...query, userID };
      const queryString = new URLSearchParams(newQuery).toString();
      router.replace(`${pathname}?${queryString}`);
    } else {
      router.push("/Routes/Mobile");
    }
  };

  const goToPartner = () => {
    if (userID) {
      const { query } = router;
      const pathname = "/Routes/Partner/";
      console.log("Routing Info:(page.js)", pathname, query);
      const newQuery = { ...query, userID };
      const queryString = new URLSearchParams(newQuery).toString();
      router.replace(`${pathname}?${queryString}`);
    } else {
      router.push("/Routes/Profil");
    }
  };
  // Profil Renderung ersetzen
  return (
    <div className="min-h-screen bg-gradient-to-r from-red-900 via-red-600 to-red-400 flex flex-col items-center justify-center text-white font-sans p-8">
      <header className="mb-12 text-center align-top leading-tight grid gap-0 relative flex">
        <h1 className="text-2xl md:text-5xl font-bold mb-0 top-0">Whats-On-The-Menu.de</h1>
        <p className="text-1xl md:text-3xl font-bold mb-0 ">Ihre visualisierte Speisekarte!</p>
        <p className="text-1xl md:text-3xl font-bold mb-0">Finden sie was sie wirklich essen wollen!</p>
        <div className="fixed top-0 right-0 p-1 flex z-20">{userID && <Profile setUserID={setUserID} />}</div>
      </header>
      <main className="w-full max-w-9xl bg-opacity-20 rounded-xl shadow-lg p-8 backdrop-blur-md z-10">
        <section className="mb-6 grid grid-cols-[repeat(auto-fit,minmax(250px,1fr))] justify-center gap-4">
          <Card className="flex item-center grid gap-1">
            <CardHeader>
              <CardTitle>Login</CardTitle>
              <CardDescription>Melde dich jetzt an um all unsere Funktionen benutzen zu können</CardDescription>
            </CardHeader>
            <CardContent>
              <Button className="flex" onClick={renderLoginW}>
                Login
              </Button>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Registrieren</CardTitle>
              <CardDescription>Neuen Account erstellen</CardDescription>
            </CardHeader>
            <CardContent>
              <Button className="flex" onClick={renderRegisterW}>
                Registrieren
              </Button>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Unsere Partner</CardTitle>
              <CardDescription>Finden sie herraus wer schon Teil unserer Community geworden ist.</CardDescription>
            </CardHeader>
            <CardContent>
              <Button className="flex" onClick={goToPartner}>
                Unsere Partner
              </Button>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Unser Team</CardTitle>
            </CardHeader>
            <CardContent>
              <Button onClick={goToUnserTeam}>Unser Team</Button>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Mobile Funktionen</CardTitle>
            </CardHeader>
            <CardContent>
              <Button asChild className="flex">
                <Link href="./Routes/Mobile">Mobile Funktionen</Link>
              </Button>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Wie funktioniert`s?</CardTitle>
            </CardHeader>
            <CardContent>
              <Button asChild className="flex">
                <Link href="./WieFunktionierts">Wie Funktioniert`s</Link>
              </Button>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Werden sie ein Teil unserer Community</CardTitle>
            </CardHeader>
            <CardContent>
              <Button asChild className="flex">
                <Link href="Community">Anfrage stellen</Link>
              </Button>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Tisch reservieren</CardTitle>
              <CardDescription>Hier einfach und schnell einen Tisch reservieren</CardDescription>
            </CardHeader>
            <CardContent>
              <Button asChild className="flex">
                <Link href="./Routes/Reservierungen">Reservieren</Link>
              </Button>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Mein Restaurant</CardTitle>
              <CardDescription>Profil bearbeiten</CardDescription>
            </CardHeader>
            <CardContent>
              <Button
                onClick={() => {
                  goToProfil();
                }}
              >
                Mein Profil
              </Button>
            </CardContent>
          </Card>
        </section>
      </main>
      <div className="absolute item-center justify-center align-center flex grid">
        {renderLogin && <LoginForm renderLogin={setRenderLogin} userID={setUserID} />}
        {renderRegister && <Registrieren renderRegistrieren={setRenderRegister} />}
      </div>
    </div>
  );
}
