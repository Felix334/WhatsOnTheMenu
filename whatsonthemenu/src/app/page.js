"use client";

import Head from "next/head";
import Image from "next/image";
import Link from "next/link";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";

import LoginForm from "./components/Anmelden";
import Registrieren from "./components/Registrieren";
import Profile from "./components/Profile";
import PermControleLocation from "./components/LocasionPermission";

export default function Home() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [renderRegister, setRenderRegister] = useState(false);
  const [navShadow, setNavShadow] = useState(false);
  const [userID, setUserID] = useState("");
  const [role, setRole] = useState("");
  const [renderCookieWin, setRenderCookieWin] = useState(false);
  const [autherizedUser, setIsAutherizedUser] = useState(false);
  //const [renderDashBoard, setRenderDashBoard] = useState(false);
  const [renderLogin, setRenderLogin] = useState(false);

  const router = useRouter();

  useEffect(() => {
    if (userID && role) {
      console.log("User-ID:", userID, "role:", role);
      window.localStorage.setItem("userID", userID);
      window.localStorage.setItem("role", role);
    } else {
      var userID_ = window.localStorage.getItem("userID");
      var role_ = window.localStorage.getItem("role");
      var restaurant_ID = window.localStorage.getItem("restaurnatID");
      if (userID_ && role_) {
        setUserID(userID_);
        setRole(role_);
        if (restaurant_ID) {
          setRestaurantID(restaurant_ID);
        }
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

  /*useEffect(() => {
    console.log("Checke:", userID, role);
    if (userID && role == "Admin") {
      setRenderDashBoard(true);
    }
  }, [userID, role]);*/

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

  return (
    <div>
      <Head>
        <title>
          MenuMaker - Digitale Speisekarten mit Bildern einfach erstellen
        </title>
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
      <div className="h-full bg-gray-50">
        {/* Navigation */}
        <nav
          className={`bg-white shadow-lg sticky top-0 z-50 ${
            navShadow ? "shadow-xl" : ""
          }`}
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <div className="absolute right-0 hidden md:block">
                {userID && (
                  <div>
                    <Profile />
                  </div>
                )}
              </div>
              <div className="flex items-center">
                <div className="text-2xl font-bold text-indigo-600">
                  🍽️ WhatsOnMyMenu
                </div>
              </div>
              <div className="hidden md:block">
                <NavigationMenu>
                  <NavigationMenuList>
                    <NavigationMenuItem>
                      <Button
                        variant="ghost"
                        onClick={() => scrollToSection("#features")}
                      >
                        Unsere Partner
                      </Button>
                    </NavigationMenuItem>
                    <NavigationMenuItem>
                      <Button
                        variant="ghost"
                        onClick={() => scrollToSection("#features")}
                      >
                        Features
                      </Button>
                    </NavigationMenuItem>
                    <NavigationMenuItem>
                      <Button
                        variant="ghost"
                        onClick={() => scrollToSection("#pricing")}
                      >
                        Preise
                      </Button>
                    </NavigationMenuItem>
                    <NavigationMenuItem>
                      <Button
                        variant="ghost"
                        onClick={() => scrollToSection("#examples")}
                      >
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
              <div className="md:hidden">
                <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
                  <SheetTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <svg
                        className="h-6 w-6"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M4 6h16M4 12h16M4 18h16"
                        />
                      </svg>
                    </Button>
                  </SheetTrigger>
                  <SheetContent side="right">
                    <div className="space-y-4">
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
                        <a href="/login">Anmelden</a>
                      </Button>
                      {userID ? (
                        {}
                      ) : (
                        <Button variant="" onClick={renderLoginW}>
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
                    Digitale Speisekarten in{" "}
                    <span className="text-black">wenigen Minuten</span>{" "}
                    erstellen
                  </h1>
                  <p className="text-xl mb-8 text-gray-400">
                    Erstelle professionelle, interaktive Speisekarten für dein
                    Restaurant. Mit QR-Codes, mehrsprachiger Unterstützung und
                    einfacher Bearbeitung.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4">
                    {!userID && (
                      <Button
                        asChild
                        className="bg-yellow-400 text-gray-900 hover:bg-yellow-300"
                      >
                        <a href="/editor">Jetzt kostenlos starten</a>
                      </Button>
                    )}
                    <Button
                      variant="outline"
                      onClick={() => scrollToSection("#demo")}
                      className="border-white text-yellow hover:bg-white hover:text-gray-900"
                    >
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
                <div className="relative">
                  <div className="floating">
                    <div className="menu-card rounded-2xl p-6 max-w-sm mx-auto">
                      <div className="bg-white rounded-lg p-4 mb-4">
                        <div className="flex items-center justify-between mb-3">
                          <h3 className="font-bold text-gray-800">
                            🍕 Bella Vista
                          </h3>
                          <div className="w-8 h-8 bg-gray-200 rounded"></div>
                        </div>
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-600">
                              Margherita Pizza
                            </span>
                            <span className="font-semibold text-gray-800">
                              12,90€
                            </span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-600">
                              Pasta Carbonara
                            </span>
                            <span className="font-semibold text-gray-800">
                              14,50€
                            </span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-600">Tiramisu</span>
                            <span className="font-semibold text-gray-800">
                              6,90€
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="text-center text-white text-sm">
                        Scan QR-Code für vollständige Karte
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Features Section */}
          <section id="features" className="py-20 bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center mb-16">
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                  Alles was du brauchst
                </h2>
                <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                  Von der Erstellung bis zur Veröffentlichung - alle Tools für
                  professionelle digitale Speisekarten
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                <Card className="card-hover">
                  <CardHeader>
                    <div className="feature-icon text-4xl mb-4">🎨</div>
                    <CardTitle>Einfach gehaltene Editoren</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription>
                      Intuitives Erstellen ohne technische Kenntnisse. Einfaches
                      Erstellen und Bearbeiten von Speisekarten.
                    </CardDescription>
                  </CardContent>
                </Card>

                <Card className="card-hover">
                  <CardHeader>
                    <div className="feature-icon text-4xl mb-4">📱</div>
                    <CardTitle>QR-Code Integration</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription>
                      Automatische QR-Code Generierung für einfache Integration
                      und Verwendung.
                    </CardDescription>
                  </CardContent>
                </Card>

                <Card className="card-hover">
                  <CardHeader>
                    <div className="feature-icon text-4xl mb-4">🌍</div>
                    <CardTitle>Premium-Features</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription>
                      Für ein noch intensiveres und ansprechenderes Erlebniss
                      für ihre Kunden
                    </CardDescription>
                  </CardContent>
                </Card>

                <Card className="card-hover">
                  <CardHeader>
                    <div className="feature-icon text-4xl mb-4">⚡</div>
                    <CardTitle>Echtzeit Updates</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription>
                      Daten und Bilder sofort aktualisieren - ohne neue QR-Codes
                      drucken zu müssen.
                    </CardDescription>
                  </CardContent>
                </Card>

                <Card className="card-hover">
                  <CardHeader>
                    <div className="feature-icon text-4xl mb-4">📊</div>
                    <CardTitle>Analytics Dashboard</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription>
                      Detaillierte Einblicke in beliebte Gerichte und
                      Kundenverhalten.
                    </CardDescription>
                  </CardContent>
                </Card>

                <Card className="card-hover">
                  <CardHeader>
                    <div className="feature-icon text-4xl mb-4">🎯</div>
                    <CardTitle>Anpassbare Designs</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription>
                      Professionelle Vorlagen die zu ihrem Restaurant-Branding
                      passen.
                    </CardDescription>
                  </CardContent>
                </Card>
              </div>
            </div>
          </section>

          {/* CTA Section */}
          <section className="py-20 bg-indigo-600 text-white">
            <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
              <h2 className="text-3xl md:text-4xl font-bold mb-6">
                Bereit für deine erste digitale Speisekarte?
              </h2>
              <p className="text-xl mb-8 text-indigo-100">
                Schließe dich einer wachsenden Gruppe von Restaurants an, die
                bereits auf digitale Speisekarten setzen
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button
                  asChild
                  className="bg-yellow-400 text-gray-900 hover:bg-yellow-300"
                >
                  <a href="/register">Kostenlos registrieren</a>
                </Button>
                <Button
                  variant="outline"
                  asChild
                  className="border-white text-white hover:bg-white hover:text-indigo-600"
                >
                  <a href="/demo">Demo buchen</a>
                </Button>
              </div>
            </div>
          </section>

          {/* Pricing Preview */}
          <section id="pricing" className="py-20 bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center mb-16">
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                  Transparente Preise
                </h2>
                <p className="text-xl text-gray-600">
                  Wähle den Plan, der zu deinem Restaurant passt
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
                <Card>
                  <CardHeader>
                    <CardTitle>Starter</CardTitle>
                    <div className="text-3xl font-bold text-indigo-600">
                      Kostenlos
                    </div>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-3 mb-8">
                      <li className="flex items-center">
                        <span className="text-green-500 mr-2">✓</span>1
                        Speisekarte
                      </li>
                      <li className="flex items-center">
                        <span className="text-green-500 mr-2">✓</span>Basis
                        Templates
                      </li>
                      <li className="flex items-center">
                        <span className="text-green-500 mr-2">✓</span>QR-Code
                      </li>
                    </ul>
                    <Button variant="secondary" asChild className="w-full">
                      <a href="/register?plan=starter">Kostenlos starten</a>
                    </Button>
                  </CardContent>
                </Card>

                <Card className="bg-indigo-600 text-white border-2 border-indigo-600 relative">
                  <Badge className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-yellow-400 text-gray-900">
                    Beliebt
                  </Badge>
                  <CardHeader>
                    <CardTitle>Professional</CardTitle>
                    <div className="text-3xl font-bold">
                      €<span className="text-lg font-normal">/Monat</span>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-3 mb-8">
                      <li className="flex items-center">
                        <span className="text-yellow-300 mr-2">✓</span>Keine
                        Adds in ihrem Menü
                      </li>
                      <li className="flex items-center">
                        <span className="text-yellow-300 mr-2">✓</span>
                        Unbegrenzte Karten
                      </li>
                      <li className="flex items-center">
                        <span className="text-yellow-300 mr-2">✓</span>Premium
                        Templates
                      </li>
                      <li className="flex items-center">
                        <span className="text-yellow-300 mr-2">✓</span>Analytics
                      </li>
                      <li className="flex items-center">
                        <span className="text-yellow-300 mr-2">✓</span>
                        Mehrsprachig
                      </li>
                    </ul>
                    <Button
                      asChild
                      className="w-full bg-yellow-400 text-gray-900 hover:bg-yellow-300"
                    >
                      <a href="/register?plan=professional">Jetzt starten</a>
                    </Button>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Enterprise</CardTitle>
                    <div className="text-3xl font-bold text-indigo-600">
                      Individuell
                    </div>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-3 mb-8">
                      <li className="flex items-center">
                        <span className="text-green-500 mr-2">✓</span>Alles aus
                        Professional
                      </li>
                      <li className="flex items-center">
                        <span className="text-green-500 mr-2">✓</span>White
                        Label
                      </li>
                      <li className="flex items-center">
                        <span className="text-green-500 mr-2">✓</span>API Zugang
                      </li>
                      <li className="flex items-center">
                        <span className="text-green-500 mr-2">✓</span>Priority
                        Support
                      </li>
                    </ul>
                    <Button asChild className="w-full">
                      <a href="/contact">Kontakt aufnehmen</a>
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </div>
          </section>
        </main>

        {/* Footer */}
        <footer className="bg-gray-900 text-white py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              <div>
                <div className="text-2xl font-bold mb-4">🍽️ MenuMaker</div>
                <p className="text-gray-400">
                  Die einfachste Art, professionelle digitale Speisekarten zu
                  erstellen.
                </p>
              </div>
              <div>
                <h4 className="font-semibold mb-4">Produkt</h4>
                <ul className="space-y-2 text-gray-400">
                  <li>
                    <a
                      href="/features"
                      className="hover:text-white transition-colors"
                    >
                      Features
                    </a>
                  </li>
                  <li>
                    <a
                      href="/pricing"
                      className="hover:text-white transition-colors"
                    >
                      Preise
                    </a>
                  </li>
                  <li>
                    <a
                      href="/templates"
                      className="hover:text-white transition-colors"
                    >
                      Vorlagen
                    </a>
                  </li>
                  <li>
                    <a
                      href="/integrations"
                      className="hover:text-white transition-colors"
                    >
                      Integrationen
                    </a>
                  </li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-4">Support</h4>
                <ul className="space-y-2 text-gray-400">
                  <li>
                    <a
                      href="/help"
                      className="hover:text-white transition-colors"
                    >
                      Hilfe Center
                    </a>
                  </li>
                  <li>
                    <a
                      href="/contact"
                      className="hover:text-white transition-colors"
                    >
                      Kontakt
                    </a>
                  </li>
                  <li>
                    <a
                      href="/tutorials"
                      className="hover:text-white transition-colors"
                    >
                      Tutorials
                    </a>
                  </li>
                  <li>
                    <a
                      href="/api-docs"
                      className="hover:text-white transition-colors"
                    >
                      API Docs
                    </a>
                  </li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-4">Unternehmen</h4>
                <ul className="space-y-2 text-gray-400">
                  <li>
                    <a
                      href="/about"
                      className="hover:text-white transition-colors"
                    >
                      Über uns
                    </a>
                  </li>
                  <li>
                    <a
                      href="/blog"
                      className="hover:text-white transition-colors"
                    >
                      Blog
                    </a>
                  </li>
                  <li>
                    <a
                      href="/careers"
                      className="hover:text-white transition-colors"
                    >
                      Karriere
                    </a>
                  </li>
                  <li>
                    <a
                      href="/press"
                      className="hover:text-white transition-colors"
                    >
                      Presse
                    </a>
                  </li>
                </ul>
              </div>
            </div>
            <div className="border-t border-gray-800 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
              <p className="text-gray-400 text-sm">
                © 2024 MenuMaker. Alle Rechte vorbehalten.
              </p>
              <div className="flex space-x-6 mt-4 md:mt-0">
                <a
                  href="/privacy"
                  className="text-gray-400 hover:text-white text-sm transition-colors"
                >
                  Datenschutz
                </a>
                <a
                  href="/terms"
                  className="text-gray-400 hover:text-white text-sm transition-colors"
                >
                  AGB
                </a>
                <a
                  href="/imprint"
                  className="text-gray-400 hover:text-white text-sm transition-colors"
                >
                  Impressum
                </a>
              </div>
            </div>
          </div>
        </footer>
        <div className="fixed align-top grid z-10 mt-0 top-0">
          {renderLogin && (
            <LoginForm
              renderLogin={setRenderLogin}
              userID={setUserID}
              role={setRole}
            />
          )}
          {renderRegister && (
            <Registrieren renderRegistrieren={setRenderRegister} />
          )}
        </div>
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

function goToMobile() {
  var touchp = window.navigator.maxTouchPoints;
  if (touchp > 1) {
    return (
      <Link
        href={{
          pathname: "/Routes/Mobile/",
          query: { ...router.query, ...(userID ? { userID: userID } : {}) },
        }}
      >
        Mobile Funktionen
      </Link>
    );
  }
}

function recreateDB() {
  //const dbPush = fetch("")
  console.log(process.env.NEXT_PUBLIC_API_KEY);
}
