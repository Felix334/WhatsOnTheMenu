"use client";

import Head from "next/head";
import Image from "next/image";
import Link from "next/link";

import { useState, useEffect } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { NavigationMenu, NavigationMenuContent, NavigationMenuItem, NavigationMenuLink, NavigationMenuList, NavigationMenuTrigger } from "@/components/ui/navigation-menu";

import LoginForm from "./components/Anmelden";
import Registrieren from "./components/Registrieren";
import Profile from "./components/Profile";
import PermControleLocation from "./components/LocasionPermission";
import ExplainCards from "./components/explainCards";
import FooterPart from "./components/footerPart";
const BeispielKarte = require("./components/img/Beispiel-Karte.png");
const BeispielKarte2 = require("./components/img/Beispiel-Karte2.png");

export default function Home() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [renderRegister, setRenderRegister] = useState(false);
  const [navShadow, setNavShadow] = useState(false);
  const [renderCookieWin, setRenderCookieWin] = useState(false);
  const [renderLogin, setRenderLogin] = useState(false);
  const [setTrue, setSetTrue] = useState(false);
  const [adminAcces, setAdminAccess] = useState(false);

  const { data: session, status } = useSession();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const userID = session?.user?.id || "";
  const role = session?.user?.role || "";
  const autherizedUser = userID && (role === "Owner" || role === "Admin") && status === "authenticated";
  const adminAcc = userID && role === "Admin";

  useEffect(() => {
    if (userID && !setTrue) {
      const newSearchParams = new URLSearchParams(searchParams);
      newSearchParams.set("userID", userID); // Add or update userID
      const newUrl = `${pathname}?${newSearchParams.toString()}`;
      router.replace(newUrl);
      setSetTrue(true);
    }
  }, [userID, setTrue, router, pathname, searchParams]); // Dependencies to re-run only when needed

  useEffect(() => {
    if (adminAcc) {
      setAdminAccess(true);
      console.log("Admin");
    }
  }, [adminAcc]);

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
  useEffect(() => {
    const testDB = async () => {
      var resp = await fetch("/api/findAll");
    };
  });

  return (
    <div>
      <Head>
        <title>MenuMaker - Digitale Speisekarten mit Bildern einfach erstellen</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta charSet="UTF-8" />
        <style jsx>{`
          .gradient-bg {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          }
          .card-hover {
            transition: all 0.3s ease;
          }
          .card-hover:hover {
            transform: translateY(-8px);
            box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
          }
          .feature-icon {
            background: linear-gradient(135deg, #ff6b6b, #ffa726);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
          }
          @keyframes float {
            0%,
            100% {
              transform: translateY(0px);
            }
            50% {
              transform: translateY(-20px);
            }
          }
          .floating {
            animation: float 6s ease-in-out infinite;
          }
          .menu-card {
            background: rgba(255, 255, 255, 0.1);
            backdrop-filter: blur(10px);
            border: 1px solid rgba(255, 255, 255, 0.2);
          }
        `}</style>
      </Head>
      <div className="h-full bg-gray-50 hero-bg">
        {/* Navigation */}
        <nav className={`bg-white shadow-lg sticky top-0 z-50 ${navShadow ? "shadow-xl" : ""}`}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-center md:justify-between items-center h-16">
              <div className="absolute right-0  md:block">
                {userID && (
                  <div>
                    <Profile />
                  </div>
                )}
              </div>
              <div className="flex items-center justify-center md:justify-start">
                <div className="text-2xl font-bold text-red-800 text-center md:text-left">🍽️ WhatsOnMyMenu</div>
              </div>
              <div className="hidden right-0 md:block">
                <NavigationMenu>
                  <NavigationMenuList>
                    <NavigationMenuItem>
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
                    </NavigationMenuItem>
                    <NavigationMenuItem>
                      <Button variant="ghost" asChild>
                        <Link
                          href={{
                            pathname: "/UnserePartner",
                            query: { ...router.queryString },
                          }}
                        >
                          Unsere Partner
                        </Link>
                      </Button>
                    </NavigationMenuItem>
                    <NavigationMenuItem>
                      <Button variant="ghost" onClick={() => scrollToSection("#features")}>
                        Features
                      </Button>
                    </NavigationMenuItem>
                    <NavigationMenuItem>
                      <Button variant="ghost" onClick={() => scrollToSection("#pricing")}>
                        Preise
                      </Button>
                    </NavigationMenuItem>
                    <NavigationMenuItem>
                      <Button variant="ghost" onClick={() => scrollToSection("#examples")}>
                        Beispiele
                      </Button>
                    </NavigationMenuItem>

                    {!userID && (
                      <NavigationMenuItem>
                        <Button variant="" onClick={renderLoginW}>
                          Anmelden
                        </Button>
                      </NavigationMenuItem>
                    )}
                    {!userID && (
                      <NavigationMenuItem>
                        <Button asChild>
                          <a href="/register">Kostenlos starten</a>
                        </Button>
                      </NavigationMenuItem>
                    )}
                  </NavigationMenuList>
                </NavigationMenu>
              </div>
              <div className="absolute left-0 flex flex-col md:hidden">
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
                        Preise
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

                      <Button variant="ghost" asChild>
                        <Link
                          href={{
                            pathname: "/UnserePartner",
                            query: { ...router.queryString },
                          }}
                        >
                          Unsere Partner
                        </Link>
                      </Button>
                      {status === "authenticated" || userID ? null : (
                        <Button
                          variant="outlined"
                          aria-label="Log in"
                          onClick={() => {
                            setMobileMenuOpen(false);
                            renderLoginWindow();
                          }}
                        >
                          Anmelden
                        </Button>
                      )}
                    </div>
                  </SheetContent>
                </Sheet>
              </div>
            </div>
          </div>
        </nav>

        <main>
          {/* Hero Section */}
          <section className="gradient-bg text-red-500 py-20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                <div>
                  <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
                    Digitale Speisekarten in <span className="text-yellow-700">wenigen Minuten</span> erstellen
                  </h1>
                  <p className="text-xl mb-8 text-gray-400">Erstelle professionelle, interaktive Speisekarten für dein Restaurant. Mit QR-Codes, mehrsprachiger Unterstützung und einfacher Bearbeitung.</p>
                  <div className="flex flex-col sm:flex-row gap-4">
                    {!userID && (
                      <Button asChild className="bg-yellow-400 text-gray-900 hover:bg-yellow-300">
                        <a href="/editor">Jetzt kostenlos starten</a>
                      </Button>
                    )}
                    <Button variant="outline" onClick={() => scrollToSection("#demo")} className="border-white text-yellow hover:bg-white hover:text-gray-900">
                      Live Demo ansehen
                    </Button>
                  </div>
                  <div className="mt-8 flex items-center space-x-6 text-sm">
                    <div className="flex items-center">
                      <span className="text-green-300 mr-2">✓</span>
                      Kostenlose Standartversion verfügbar
                    </div>
                    <div className="flex items-center">
                      <span className="text-green-300 mr-2">✓</span>
                      Premium für 14 Tage kostenlos testen
                    </div>
                  </div>
                </div>
                <div className="bg-white rounded-lg p-2 mb-4 overflow-hidden">
                  <Image src={BeispielKarte} alt="Beispiel Speisekarte" width={400} height={600} className="rounded-lg object-cover w-full h-auto" priority />
                </div>
                <div className="bg-white rounded-lg p-2 mb-4 overflow-hidden">
                  <Image src={BeispielKarte2} alt="Beispiel Speisekarte" width={400} height={600} className="rounded-lg object-cover w-full h-auto" priority />
                </div>
              </div>
            </div>
          </section>
          <ExplainCards />
          {/* CTA Section */}
          <section className="py-20 bg-red-800 text-white">
            <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
              <h2 className="text-3xl md:text-4xl font-bold mb-6">Bereit für deine erste digitale Speisekarte?</h2>
              <p className="text-xl mb-8 text-indigo-100">Schließe dich einer wachsenden Gruppe von Restaurants an, die bereits auf digitale Speisekarten setzen</p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button asChild className="bg-yellow-400 text-gray-900 hover:bg-yellow-300">
                  <a href="/register">Kostenlos registrieren</a>
                </Button>
                <Button variant="outline" asChild className="border-white text-white hover:bg-white hover:text-indigo-600">
                  <a href="/demo">Demo buchen</a>
                </Button>
              </div>
            </div>
          </section>

          {/* Pricing Preview */}
          <section id="pricing" className="py-20 bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center mb-16">
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Transparente Preise</h2>
                <p className="text-xl text-gray-600">Wähle den Plan, der zu deinem Restaurant passt</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
                <Card className="flex flex-col h-full">
                  <CardHeader>
                    <CardTitle>Starter</CardTitle>
                    <div className="text-3xl font-bold text-red-800">Kostenlos</div>
                  </CardHeader>

                  <CardContent className="flex flex-col flex-1">
                    <ul className="space-y-3 mb-8">
                      <li className="flex items-center">
                        <span className="text-green-500 mr-2">✓</span>7 Speisekarte
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
                        <Link
                          href={{
                            pathname: "./ErstelleRestaurantAccount/FreeTier",
                            query: { ...router.queryString },
                          }}
                        >
                          Jetzt starten
                        </Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-red-800 text-white border-2 border-red-600 relative">
                  <Badge className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-yellow-400 text-gray-900">Empfohlen</Badge>
                  <CardHeader>
                    <CardTitle>Professional</CardTitle>
                    <div className="text-3xl font-bold">
                      9.99€<span className="text-lg font-normal">/Monat</span>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-3 mb-8">
                      <li className="flex items-center">
                        <span className="text-green-300 mr-2">✓</span>Keine Adds in ihrem Menü
                      </li>
                      <li className="flex items-center">
                        <span className="text-green-300 mr-2">✓</span>
                        15 Karten
                      </li>
                      <li className="flex items-center">
                        <span className="text-green-300 mr-2">✓</span>Premium Templates
                      </li>
                      <li className="flex items-center">
                        <span className="text-green-300 mr-2">✓</span>
                        Mehrsprachig
                      </li>
                      <li className="flex items-center">
                        <span className="text-green-300 mr-2">✓</span>QR-Code
                      </li>
                      <li className="flex items-center">
                        <span className="text-green-300 mr-2">✓</span>Event-Planer
                      </li>
                    </ul>
                    <Button asChild className="w-full bg-yellow-400 text-gray-900 hover:bg-yellow-300">
                      <Link
                        href={{
                          pathname: "./ErstelleRestaurantAccount/Professional",
                         query: { ...router.queryString },
                        }}
                      >
                        Jetzt starten
                      </Link>
                    </Button>
                  </CardContent>
                </Card>

                <Card className="flex flex-col h-full">
                   <Badge className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-yellow-400 text-gray-900">Empfohlen</Badge>
                  <CardHeader>
                    <CardTitle>Enterprise</CardTitle>
                    <div className="text-3xl font-bold text-red-800">Individuell</div>
                  </CardHeader>

                  <CardContent className="flex flex-col flex-1">
                    <ul className="space-y-3 mb-8">
                      <li className="flex items-center">
                        <span className="text-green-500 mr-2">✓</span>
                        Alles aus Professional
                      </li>
                      <li className="flex items-center">
                        <span className="text-green-500 mr-2">✓</span>
                        White Label
                      </li>
                      <li className="flex items-center">
                        <span className="text-green-500 mr-2">✓</span>
                        API Zugang
                      </li>
                      <li className="flex items-center">
                        <span className="text-green-300 mr-2">✓</span>Analytics
                      </li>
                      <li className="flex items-center">
                        <span className="text-green-500 mr-2">✓</span>
                        Priority Support
                      </li>
                    </ul>

                    {/* Button nach unten */}
                    <div className="mt-auto">
                      <Button asChild className="w-full">
                        <Link
                          href={{
                            pathname: "./ErstelleRestaurantAccount/Individuell",
                            query: { ...router.queryString },
                          }}
                        >
                          Jetzt Kontakt aufnehmen
                        </Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </section>
        </main>
        <FooterPart />
        {/* Footer */}

        <div className="fixed align-top grid z-10 mt-0 top-0">
          {renderLogin && <LoginForm renderLogin={setRenderLogin} />}
          {renderRegister && <Registrieren renderRegistrieren={setRenderRegister} />}
        </div>
      </div>
    </div>
  );
}