"use client";
import Image from "next/image";
import Link from "next/link";
import Script from "next/script";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useSession } from "next-auth/react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { NavigationMenu, NavigationMenuItem, NavigationMenuList } from "@/components/ui/navigation-menu";

import LoginForm from "./components/Anmelden";
import Registrieren from "./components/Registrieren";
import Profile from "./components/Profile";
import ExplainCards from "./components/explainCards";
import FooterPart from "./components/footerPart";
import RenderUserID from "./components/renderUserID";

import SpeiseKarteHandyNeu from "./components/img/SpeisekarteHandyNeu.png";
import SpeiseKarteLaptopNeu from "./components/img/SpeisekarteLaptopNeu.png";
import { AdminLink, FreeTierLink, WieFunktionierts } from "./components/renderDynamicLinks";

import WebsiteIcon from "./icon.svg";

function HomeContent() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [renderRegister, setRenderRegister] = useState(false);
  const [navShadow, setNavShadow] = useState(false);
  const [renderLogin, setRenderLogin] = useState(false);

  const { data: session, status } = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();

  const userID = session?.user?.id || "";
  const role = session?.user?.role || "";
  const autherizedUser = userID && status === "authenticated";
  const adminAcc = userID && role === "Admin" && status === "authenticated";


  useEffect(() => {
    const authError = searchParams.get("error");
    if (!authError) return;
    toast.error(authError === "OAuthAccountNotLinked" ? "Diese E-Mail ist bereits mit einer anderen Anmeldemethode verknüpft." : "Anmeldung abgebrochen oder fehlgeschlagen. Bitte versuche es erneut.");
    setRenderLogin(true);
    router.replace("/", { scroll: false });
  }, [searchParams, router]);

  useEffect(() => {
    const handleScroll = () => {
      setNavShadow(window.scrollY > 100);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToSection = (id) => {
    const element = document.querySelector(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const checkVercelEnv = () => {
    console.log("Vercel-Env:", process.env.VERCEL_ENV)
  }

  const renderLoginW = () => setRenderLogin((prev) => !prev);
  return (
    <div>
      <div className="h-full bg-gray-50">
        {/* Navigation */}
        <RenderUserID />
        <nav className={`bg-white/95 backdrop-blur sticky top-0 z-50 transition-shadow duration-300 ${navShadow ? "shadow-lg" : "shadow-sm"}`}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="relative flex justify-center md:justify-between items-center h-16">
              <div className="flex items-center justify-center md:justify-start">
                <div className="text-2xl font-bold text-red-800 text-center md:text-left">
                  <Image src={WebsiteIcon} alt="" width={28} height={28} className="inline align-middle mx-1" /> WhatIsOnMyMenu.com
                </div>

              </div>
              <div className="hidden md:flex items-center gap-3">
                <NavigationMenu>
                  <NavigationMenuList>
                    <NavigationMenuItem>
                      {status === "authenticated" && adminAcc ? (
                        <Button variant="ghost" asChild>
                          <AdminLink searchParams={userID} />
                        </Button>
                      ) : (
                        <></>
                      )}
                    </NavigationMenuItem>
                    <NavigationMenuItem>
                      <Button variant="ghost" onClick={() => scrollToSection("#features")}>
                        Features
                      </Button>
                    </NavigationMenuItem>
                    <NavigationMenuItem>
                      <Button variant="ghost">
                        <WieFunktionierts />
                      </Button>
                    </NavigationMenuItem>
                    <NavigationMenuItem>
                      <Button variant="ghost" onClick={() => scrollToSection("#pricing")}>
                        Angebote
                      </Button>
                    </NavigationMenuItem>

                    {!userID && (
                      <NavigationMenuItem>
                        <Button variant="" onClick={renderLoginW}>
                          Anmelden
                        </Button>
                      </NavigationMenuItem>
                    )}
                  </NavigationMenuList>
                </NavigationMenu>
                {autherizedUser && <Profile />}
              </div>
              <div className="absolute left-0 inset-y-0 flex items-center md:hidden">
                <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
                  <SheetTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                      </svg>
                    </Button>
                  </SheetTrigger>
                  <SheetContent side="left" className="grid grid-cols-3 [&>button]:hidden">
                    <div className="space-y-1 top-6 relative">
                      <div>
                        {status === "authenticated" && adminAcc ? (
                          <Button variant="ghost" asChild>
                            <Link
                              href={{
                                pathname: "/Admin",
                                query: { ...router.queryString },
                              }}
                            >
                              Admin Konsole
                            </Link>
                          </Button>
                        ) : (
                          <></>
                        )}
                      </div>
                      <div>
                        {status === "authenticated" && userID ? (
                          <div>
                            <Button variant="ghost" asChild>
                              <Link href={{ pathname: "/Profil", query: { ...router.queryString } }}>Profil</Link>
                            </Button>
                          </div>
                        ) : (
                          <></>
                        )}
                      </div>
                      <Button
                        variant="ghost"
                        onClick={() => {
                          scrollToSection("#features");
                          setMobileMenuOpen(false);
                        }}
                      >
                        Features
                      </Button>
                      <Button
                        variant="ghost"
                        onClick={() => {
                          scrollToSection("#pricing");
                          setMobileMenuOpen(false);
                        }}
                      >
                        Angebote
                      </Button>
                      <Button
                        variant="ghost"
                        onClick={() => {
                          scrollToSection("#examples");
                          setMobileMenuOpen(false);
                        }}
                      >
                        Beispiele
                      </Button>
                      {status === "authenticated" || userID ? null : (
                        <Button
                          variant="outline"
                          aria-label="Log in"
                          onClick={() => {
                            setMobileMenuOpen(false);
                            renderLoginW();
                          }}
                        >
                          Anmelden
                        </Button>
                      )}
                    </div>
                  </SheetContent>
                </Sheet>
              </div>
              {autherizedUser && (
                <div className="absolute right-0 inset-y-0 flex items-center md:hidden">
                  <Profile />
                </div>
              )}
            </div>
          </div>
        </nav>

        <main>
          {/* Hero Section */}
          <section className="relative overflow-hidden py-24 bg-linear-to-br from-red-900 to-gray-950 text-white">
            {/* Dezente Deko-Flächen im Hintergrund */}
            <div aria-hidden className="pointer-events-none absolute -top-32 -right-32 w-96 h-96 rounded-full bg-red-500/20 blur-3xl" />
            <div aria-hidden className="pointer-events-none absolute -bottom-40 -left-24 w-80 h-80 rounded-full bg-yellow-400/10 blur-3xl" />
            <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                <div>
                  <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
                    Digitale Speisekarten in <span className="text-red-300">wenigen Minuten</span> erstellen
                  </h1>
                  <p className="text-xl mb-8 text-white/70">Erstellen Sie professionelle, interaktive Speisekarten für Ihr Restaurant. Mit QR-Codes, mehrsprachiger Unterstützung und einfacher Bearbeitung.</p>
                  <div className="flex flex-col sm:flex-row gap-4">
                    {!userID && (
                      <Button asChild className="bg-yellow-400 text-gray-900 hover:bg-yellow-300 font-semibold text-base px-8 py-3 h-auto shadow-lg">
                        <a href="/ErstelleRestaurantAccount/FreeTier">Jetzt kostenlos starten</a>
                      </Button>
                    )}
                    {!userID && (
                      <Button variant="outline" className="border-white/50 text-white hover:bg-white/10 font-medium text-base px-8 py-3 h-auto" onClick={renderLoginW}>
                        Anmelden
                      </Button>
                    )}
                  </div>
                  <div className="mt-8 flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-6 text-sm text-white/70">
                    <div className="flex items-center">
                      <span className="text-green-400 mr-2">✓</span>
                      Kostenlose Standardversion verfügbar
                    </div>
                    <div className="flex items-center">
                      <span className="text-green-400 mr-2">✓</span>
                      Übersichtliche Gestaltung für Ihre Kunden
                    </div>
                  </div>
                </div>

                {/* Produkt-Vorschau rechts */}
                <div className="relative hidden lg:flex items-center justify-center">
                  <div aria-hidden className="absolute w-72 h-72 rounded-full bg-red-400/25 blur-3xl" />
                  <Image src={SpeiseKarteHandyNeu} alt="Digitale Speisekarte auf dem Smartphone" priority className="relative w-60 xl:w-68 h-auto rotate-3 rounded-3xl shadow-2xl ring-1 ring-white/20 transition-transform duration-300 hover:rotate-0" />
                </div>
              </div>
            </div>
          </section>
          <section className="bg-white flex items-center justify-center py-12 px-4">
            <div className="mx-auto max-w-6xl text-center">
              <header className="mb-10">
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-semibold text-gray-900">Passt sich einfach Ihren Geräten an</h2>
                <p className="mt-3 text-gray-500 text-sm sm:text-base">Optimiert für Smartphone, Tablet und Desktop - ohne Kompromisse im Design.</p>
              </header>
              <div className="flex flex-col sm:flex-row gap-6 items-center justify-center w-full max-w-5xl mx-auto">
                <div className="relative w-full max-w-sm sm:max-w-xs md:max-w-md aspect-4/3">
                  <Image src={SpeiseKarteLaptopNeu} className="object-contain drop-shadow-2xl" alt="Speisekarte Laptop" />
                </div>
                <div className="relative w-full max-w-70 sm:max-w-30 md:max-w-62.5 aspect-9/16 sm:-ml-10 sm:translate-y-4">
                  <Image src={SpeiseKarteHandyNeu} className="object-contain drop-shadow-2xl" alt="Speisekarte Handy" />
                </div>
              </div>
            </div>
          </section>
          <ExplainCards />
          {/* CTA Section */}
          <section className="py-20 bg-linear-to-br from-red-800 to-red-950 text-white">
            <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
              <h2 className="text-3xl md:text-4xl font-bold mb-6">Bereit für Ihre erste digitale Speisekarte?</h2>
              <p className="text-xl mb-8 text-red-100">Schließen Sie sich einer wachsenden Gruppe von Restaurants an, die bereits auf digitale Speisekarten setzen</p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                {!userID && (
                  <Button asChild className="bg-yellow-400 text-gray-900 hover:bg-yellow-300 font-semibold text-base px-10 py-3 h-auto shadow-lg">
                    <a href="/ErstelleRestaurantAccount/FreeTier">Kostenlos loslegen</a>
                  </Button>
                )}
                <Button asChild variant="outline" className="border-white/50 text-white hover:bg-white/10 font-medium text-base px-10 py-3 h-auto">
                  <a href="#pricing">Preise ansehen</a>
                </Button>
              </div>
            </div>
          </section>

          {/* Pricing Preview */}
          <section id="pricing" className="py-20 bg-gray-50">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center mb-16">
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Transparente Preise</h2>
                <p className="text-xl text-gray-600">Wähle den Plan, der zu Ihrem Restaurant passt</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-3 gap-8 items-stretch">
                <Card className="flex flex-col h-full transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
                  <CardHeader>
                    <CardTitle>Starter</CardTitle>
                    <div className="text-3xl font-bold ">Kostenlos</div>
                  </CardHeader>

                  <CardContent className="flex flex-col flex-1">
                    <ul className="space-y-3 mb-8">
                      <li className="flex items-center">
                        <span className="text-green-500 mr-2">✓</span>Bis zu 7 Kategorien
                      </li>
                      <li className="flex items-center">
                        <span className="text-green-500 mr-2">✓</span>Bis zu 30 Gerichte
                      </li>
                      <li className="flex items-center">
                        <span className="text-green-500 mr-2">✓</span>
                        Basis Templates
                      </li>
                      <li className="flex items-center">
                        <span className="text-green-500 mr-2">✓</span>
                        QR-Code
                      </li>
                    </ul>

                    {/* Button nach unten drücken */}
                    <div className="mt-auto">
                      <Button asChild className="w-full">
                        <FreeTierLink searchParams={userID} />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
                <Card className="flex flex-col h-full border-2 border-amber-400 relative transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
                  <Badge className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-yellow-400 text-gray-900">Coming Soon</Badge>
                  <CardHeader>
                    <CardTitle>Business</CardTitle>
                    <div className="text-3xl font-bold ">
                      7.99€<span className="text-lg font-normal">/Monat</span>
                    </div>
                  </CardHeader>

                  <CardContent className="flex flex-col flex-1">
                    <ul className="space-y-3 mb-8">
                      <li className="flex items-center">
                        <span className="text-green-500 mr-2">✓</span>Bis zu 15 Kategorien
                      </li>
                      <li className="flex items-center">
                        <span className="text-green-500 mr-2">✓</span>Bis zu 100 Gerichte
                      </li>
                      <li className="flex items-center">
                        <span className="text-green-500 mr-2">✓</span>
                        Basis Templates
                      </li>
                      <li className="flex items-center">
                        <span className="text-green-500 mr-2">✓</span>
                        QR-Code
                      </li>
                    </ul>

                    {/* Button nach unten drücken */}
                  </CardContent>
                </Card>

                <Card className="flex flex-col h-full bg-linear-to-b from-red-800 to-red-900 text-white border-2 border-red-600 relative shadow-xl transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl">
                  <Badge className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-yellow-400 text-gray-900">Coming Soon</Badge>
                  <CardHeader>
                    <CardTitle>Professional</CardTitle>
                    <div className="text-3xl font-bold">
                      <span className="text-lg font-normal">/Monat</span>
                    </div>
                  </CardHeader>
                  <CardContent className="flex flex-col flex-1">
                    <ul className="space-y-3 mb-8">
                      <li className="flex items-center">
                        <span className="text-green-400 mr-2">✓</span>
                        Bis zu 25 Kategorien
                      </li>
                      <li className="flex items-center">
                        <span className="text-green-400 mr-2">✓</span>Bis zu 200 Gerichte
                      </li>
                      <li className="flex items-center">
                        <span className="text-green-400 mr-2">✓</span>Premium Templates
                      </li>
                      <li className="flex items-center">
                        <span className="text-green-400 mr-2">✓</span>QR-Code
                      </li>
                      <li className="flex items-center">
                        <span className="text-green-400 mr-2">✓</span>Management-System
                      </li>
                      <li className="flex items-center">
                        <span className="text-green-400 mr-2">✓</span>Gerichtverfügbarkeitsanzeige
                      </li>
                      <li className="flex items-center">
                        <span className="text-green-400 mr-2">✓</span>Event-Kalender
                      </li>
                      <li className="flex items-center">
                        <span className="text-green-400 mr-2">✓</span>Eigene Subdomain
                      </li>
                    </ul>
                  </CardContent>
                </Card>
              </div>
            </div>
          </section>
        </main>
        <FooterPart />
        <Script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-4153577229204032" crossOrigin="anonymous" strategy="afterInteractive" />
        <Script id="adsbygoogle-init" strategy="afterInteractive">
          {`(adsbygoogle = window.adsbygoogle || []).push({});`}
        </Script>

        <div className="fixed align-top grid z-10 mt-0 top-0">
          {renderLogin && <LoginForm renderLogin={setRenderLogin} />}
          {renderRegister && <Registrieren renderRegistrieren={setRenderRegister} />}
        </div>
      </div>
    </div>
  );
}

function LoadingFallback() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="h-16 bg-white shadow-sm"></div>
      <div className="h-96 bg-linear-to-br from-red-900 to-gray-950"></div>
    </div>
  );
}

export default function Home() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <HomeContent />
    </Suspense>
  );
}
