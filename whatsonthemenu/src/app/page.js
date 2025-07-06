"use client";

// Nicht den Ordner extra öffen

import Image from "next/image";
import Link from "next/link";
import LoginForm from "./components/Anmelden";
import Registrieren from "./components/Registrieren";
import Profile from "./components/Profile";
import PermControleLocation from "./components/LocasionPermission";
import SlowRenderImage from "./components/slowRenderImage"

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { NavigationMenu, NavigationMenuContent, NavigationMenuItem, NavigationMenuLink, NavigationMenuList, NavigationMenuTrigger, navigationMenuTriggerStyle } from "@/components/ui/navigation-menu";
import { useRouter } from "next/navigation";
import path from "path";

// Mit next/auth neuschreiben

export default function Home() {
  const [renderLogin, setRenderLogin] = useState(false);
  const [closeInput, setCloseInput] = useState(false);
  const [renderRegister, setRenderRegister] = useState(false);
  const [userID, setUserID] = useState("");
  const [role, setRole] = useState("");
  const [hasReloaded, setHasReloaded] = useState(false);

  const router = useRouter();

  useEffect(() => {
    if (userID && role) {
      window.localStorage.setItem("userID", userID);
      window.localStorage.setItem("role", role);
    } else {
      var userID_ = window.localStorage.getItem("userID");
      if (userID_) {
        setUserID(userID_);
      }
    }
  }, [userID, role]);

  useEffect(() => {
    // Fixes the url reload
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

  // Routeprotection in middleware einfügen








  // Ich hab nichts an der Überschrift verändert das Package hat sich verändert

  return (
    <div className="min-h-screen bg-gradient-to-r from-red-900 via-red-600 to-red-400 flex flex-col items-center justify-center text-white font-sans p-8">
      <header className="mb-12 text-center align-top leading-tight grid grid-col-1 gap-0 relative">
        <h1 className="text-2xl md:text-5xl font-bold mb-0 top-0">Whats-On-The-Menu.de</h1>
        <p className="text-1xl md:text-3xl font-bold mb-0 ">Ihre visualisierte Speisekarte!</p>
        <p className="text-1xl md:text-3xl font-bold mb-0">Finden sie was sie wirklich essen wollen!</p>
        <div className="fixed top-0 right-0 p-1 flex z-20">{userID && <Profile setUserID={setUserID} />}</div>
      </header>
      <main className="w-full max-w-9xl bg-opacity-20 rounded-xl shadow-lg p-8 backdrop-blur-md z-10">
        <section className="mb-6 grid grid-cols-[repeat(auto-fit,minmax(250px,1fr))] justify-center gap-4">
          {!userID && (
            <>
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
            </>
          )}
          <Card>
            <CardHeader>
              <CardTitle>Unsere Partner</CardTitle>
              <CardDescription>Finden sie herraus wer schon Teil unserer Community geworden ist.</CardDescription>
            </CardHeader>
            <CardContent>
              <Button asChild>
                <Link href={{ pathname: "/Routes/UnserePartner", query: { ...router.query, ...(userID ? { userID: userID } : {}) } }}>Partner</Link>
              </Button>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Unser Team</CardTitle>
            </CardHeader>
            <CardContent>
              <Button asChild>
                <Link href={{ pathname: "/Routes/UnserTeam/", query: { ...router.query, ...(userID ? { userID: userID } : {}) } }}>Unser Team</Link>
              </Button>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Mobile Funktionen</CardTitle>
            </CardHeader>
            <CardContent>
              <Button asChild>
                <Link href={{ pathname: "/Routes/Mobile/", query: { ...router.query, ...(userID ? { userID: userID } : {}) } }}>Mobile Funktionen</Link>
              </Button>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Unsere Funktionen</CardTitle>
            </CardHeader>
            <CardContent>
              <Button asChild>
                <Link href={{ pathname: "/Routes/WieFunktionierts", query: { ...router.query, ...(userID ? { userID: userID } : {}) } }}>Wie Funktionierts?</Link>
              </Button>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Werden sie ein Teil unserer Community</CardTitle>
            </CardHeader>
            <CardContent>
              <Button asChild>
                <Link href={{ pathname: "/Routes/Community/", query: { ...router.query, ...(userID ? { userID: userID } : {}) } }}>Anfrage stellen</Link>
              </Button>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Tisch reservieren</CardTitle>
              <CardDescription>Hier einfach und schnell einen Tisch reservieren</CardDescription>
            </CardHeader>
            <CardContent>
              <Button asChild>
                <Link href={{ pathname: "/Routes/Reservierung/", query: { ...router.query, ...(userID ? { userID: userID } : {}) } }}>Reservierung</Link>
              </Button>
            </CardContent>
          </Card>
          {userID && (
            <Card>
              <CardHeader>
                <CardTitle>Mein Restaurant</CardTitle>
                <CardDescription>Profil bearbeiten</CardDescription>
              </CardHeader>
              <CardContent>
                <Button asChild>
                  <Link className="" href={{ pathname: "/Routes/Profil/", query: { ...router.query, ...(userID ? { userID: userID } : {}) } }}>
                    Profil
                  </Link>
                </Button>
              </CardContent>
            </Card>
          )}
        </section>
          <SlowRenderImage />
      </main>
      <div className="absolute item-center justify-center align-center flex grid">
        {renderLogin && <LoginForm renderLogin={setRenderLogin} userID={setUserID} role={setRole} />}
        {renderRegister && <Registrieren renderRegistrieren={setRenderRegister} />}
      </div>
    </div>
  );
}
