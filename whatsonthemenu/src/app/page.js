"use client";

// Nicht den Ordner extra öffen

import Image from "next/image";
import Link from "next/link";

import LoginForm from "./components/Anmelden";
import Registrieren from "./components/Registrieren";
import Profile from "./components/Profile";
import PermControleLocation from "./components/LocasionPermission";
import SlowRenderImage from "./components/slowRenderImage";

import { useState, useEffect, useReducer } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import path from "path";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { NavigationMenu, NavigationMenuContent, NavigationMenuItem, NavigationMenuLink, NavigationMenuList, NavigationMenuTrigger, navigationMenuTriggerStyle } from "@/components/ui/navigation-menu";

//console.log(process.env)

// Mit next/auth neuschreiben

export default function Home() {
  const [renderLogin, setRenderLogin] = useState(false);
  const [closeInput, setCloseInput] = useState(false);
  const [renderRegister, setRenderRegister] = useState(false);
  const [userID, setUserID] = useState("");
  const [role, setRole] = useState("");
  const [hasReloaded, setHasReloaded] = useState(false);
  const [renderCookieWin, setRenderCookieWin] = useState(false);
  const [autherizedUser, setIsAutherizedUser] = useState(false);
  const [renderDashBoard, setRenderDashBoard] = useState(false);

  const router = useRouter();

  useEffect(() => {
    if (userID && role) {
      console.log("User-ID:", userID, "role:", role);
      window.localStorage.setItem("userID", userID);
      window.localStorage.setItem("role", role);
    } else {
      var userID_ = window.localStorage.getItem("userID");
      var role_ = window.localStorage.getItem("role");
      if (userID_ && role_) {
        setUserID(userID_);
        setRole(role_);
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

  useEffect(() => {
    console.log("Checke:", userID, role);
    if (userID && (role == "Owner" || role == "Admin")) {
      setIsAutherizedUser(true);
    }
  }, [userID, role]);

  useEffect(() => {
    console.log("Checke:", userID, role);
    if (userID && role == "Admin") {
      setRenderDashBoard(true);
    }
  }, [userID, role]);

  // Anzeige für Authorisierte Benutzer noch nicht voll funktionsfähig (Rollencheck)

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

  // SUPABASE configurieren =>Funktioniert auch mit Prisma

  return (
    <div className="min-h-screen bg-gradient-to-r from-red-900 via-red-600 to-red-400 flex flex-col items-center justify-center text-white font-sans p-8">
      <header className="mb-12 text-center align-top leading-tight grid grid-col-1 gap-0 relative">
        <h1 className="text-2xl md:text-5xl font-bold mb-0 top-0 font-blue">Whats-On-The-Menu.de</h1>
        <p className="text-1xl md:text-3xl font-bold mb-0 ">Ihre visualisierte Speisekarte!</p>
        <p className="text-1xl md:text-3xl font-bold mb-0">Finden sie was sie wirklich essen wollen!</p>
        <div>
          <Button className="absolute flex left-0" onClick={recreateDB}>DB neu erstellen</Button>
        </div>
        <div className="fixed top-0 right-0 p-1 flex z-20">{userID && <Profile setUserID={setUserID} />}</div>
      </header>
      <main className="w-full max-w-9xl bg-opacity-20 rounded-xl shadow-lg p-8 backdrop-blur-md z-10">
        <section className="mb-6 grid grid-cols-[repeat(auto-fit,minmax(250px,1fr))] justify-center gap-4">
          {!userID && (
            <>
              <Card className="item-center grid gap-1">
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
                <Link href={{ pathname: "/UnserePartner", query: { ...router.query, ...(userID ? { userID: userID } : {}) } }}>Partner</Link>
              </Button>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Unser Team</CardTitle>
            </CardHeader>
            <CardContent>
              <Button asChild>
                <Link href={{ pathname: "/UnserTeam/", query: { ...router.query, ...(userID ? { userID: userID } : {}) } }}>Unser Team</Link>
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
                <Link href={{ pathname: "/WieFunktionierts", query: { ...router.query, ...(userID ? { userID: userID } : {}) } }}>Wie Funktionierts?</Link>
              </Button>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Werden sie ein Teil unserer Community</CardTitle>
            </CardHeader>
            <CardContent>
              <Button asChild>
                <Link href={{ pathname: "/ErstelleRestaurantAccount/", query: { ...router.query, ...(userID ? { userID: userID } : {}) } }}>Anfrage stellen</Link>
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
                <Link href={{ pathname: "/Reservierung/", query: { ...router.query, ...(userID ? { userID: userID } : {}) } }}>Reservierung</Link>
              </Button>
            </CardContent>
          </Card>
          {autherizedUser && (
            <Card>
              <CardHeader>
                <CardTitle>Mein Restaurant</CardTitle>
                <CardDescription>Profil bearbeiten</CardDescription>
              </CardHeader>
              <CardContent>
                <Button asChild>
                  <Link className="" href={{ pathname: "/Profil/", query: { ...router.query, ...(userID ? { userID: userID } : {}) } }}>
                    Profil
                  </Link>
                </Button>
              </CardContent>
            </Card>
          )}
          {renderDashBoard && (
            <Card>
              <CardHeader>
                <CardTitle>Mein Dashboard</CardTitle>
                <CardDescription>Kunden-Übersicht</CardDescription>
              </CardHeader>
              <CardContent>
                <Button asChild>
                  <Link className="" href={{ pathname: "/Protected/Dashboard/", query: { ...router.query, ...(userID ? { userID: userID } : {}) } }}>
                    Dashboard
                  </Link>
                </Button>
              </CardContent>
            </Card>
          )}
        </section>
        <section className="">
          <SlowRenderImage />
        </section>
        <section>
          <button onClick={printUserDevice}>Device</button>
        </section>
      </main>
      <div className="fixed align-top grid z-10 mt-0 top-0">
        {renderLogin && <LoginForm renderLogin={setRenderLogin} userID={setUserID} role={setRole} />}
        {renderRegister && <Registrieren renderRegistrieren={setRenderRegister} />}
      </div>
    </div>
  );
}

function printUserDevice() {
  console.log("Device:", navigator.userAgent);
  console.log("Sprache:", navigator.language);
  console.log("Sprachen:", navigator.languages);
  console.log("Browser Online?: ", navigator.onLine);
  console.log("Cookies erlaubt?: ", navigator.cookieEnabled);
  console.log("Gerätespeicher: ", navigator.deviceMemory);
  console.log("Hardware-Prozessoren: ", navigator.hardwareConcurrency);
}

function goToMobile(){
  var touchp = window.navigator.maxTouchPoints;
  if(touchp > 1){
    return <Link href={{ pathname: "/Routes/Mobile/", query: { ...router.query, ...(userID ? { userID: userID } : {}) } }}>Mobile Funktionen</Link>
  }
}

function recreateDB(){
  //const dbPush = fetch("")
  console.log(process.env.NEXT_PUBLIC_API_KEY)
}