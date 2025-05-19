"use client"

// Nicht den Ordner extra öffen


import Image from "next/image";
import Link from "next/link";
import LoginForm from "./components/Anmelden";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu"
import PermControleLocation from "./components/LocasionPermission";

export default function Home() {
  const [renderLogin, setRenderLogin] = useState(false);
  const [closeInput, setCloseInput] = useState(false)

  const renderMLogin = () => {
    if(closeInput){
      setRenderLogin(false);
    }
    if (!renderLogin) {
      setRenderLogin(true);
    } else {
      setRenderLogin(false);
    }
  };
  return (
    <div className="min-h-screen bg-gradient-to-r from-red-900 via-red-600 to-red-400 flex flex-col items-center justify-center text-white font-sans p-8">
      <header className="mb-12 text-center align-top leading-tight grid gap-0 relative flex">
        <h1 className="text-2xl md:text-5xl font-bold mb-0 top-0">Whats-On-The-Menu.de</h1>
        <p className="text-1xl md:text-3xl font-bold mb-0 ">Ihre visualisierte Speisekarte!</p>
        <p className="text-1xl md:text-3xl font-bold mb-0">Finden sie was sie wirklich essen wollen!</p>
      </header>
      <main className="w-full max-w-9xl bg-opacity-20 rounded-xl shadow-lg p-8 backdrop-blur-md">
        <section className="mb-6 grid grid-cols-[repeat(auto-fit,minmax(250px,1fr))] justify-center gap-4">
          <Card className="flex item-center grid gap-1">
            <CardHeader>
              <CardTitle>Login</CardTitle>
              <CardDescription>Melde dich jetzt an um all unsere Funktionen benutzen zu können</CardDescription>
            </CardHeader>
            <CardContent>
              <Button className="flex" onClick={renderMLogin}>
                Login
              </Button>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Unsere Partner</CardTitle>
              <CardDescription>Finden sie herraus wer schon Teil unserer Community geworden ist.</CardDescription>
            </CardHeader>
            <CardContent>
              <Button asChild className="flex">
                <Link href="./Routes/UnserePartner">Unsere Partner</Link>
              </Button>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Unser Team</CardTitle>
            </CardHeader>
            <CardContent>
              <Button asChild className="flex">
                <Link href="./Routes/UnserTeam">Unser Team</Link>
              </Button>
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
        </section>
      </main>
      <div className="absolute item-center justify-center flex grid fixed">
            {renderLogin && <LoginForm closeInput={renderLogin}/>}
      </div>
    </div>
  );
}
