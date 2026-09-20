"use client";
import Image from "next/image";
import Link from "next/link";

import { useState, useEffect, useCallback, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useSession } from "next-auth/react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { NavigationMenu, NavigationMenuItem, NavigationMenuList } from "@/components/ui/navigation-menu";

import LoginForm from "./Anmelden";
import Registrieren from "./Registrieren";
import Profile from "./Profile";
import ExplainCards from "./explainCards";
import FooterPart from "./footerPart";
import RenderUserID from "./renderUserID";
import LanguageSwitcher from "./LanguageSwitcher";

import SpeiseKarteHandyNeu from "./img/SpeisekarteHandyNeu.png";
import SpeiseKarteLaptopNeu from "./img/SpeisekarteLaptopNeu.png";
import { AdminLink, FreeTierLink, BusinessTierLink, WieFunktionierts } from "./renderDynamicLinks";

import WebsiteIcon from "../icon.svg";
import { localizedPath } from "@/i18n/config";

/**
 * Liest den ?error=-Parameter aus der URL und zeigt die passende Meldung.
 *
 * Bewusst als eigene, winzige Komponente: useSearchParams() zwingt die
 * umschliessende Suspense-Grenze beim statischen Prerendering auf den Fallback
 * zurueck. Solange dieser Hook in der grossen Seitenkomponente sass, bestand
 * das ausgelieferte HTML der Startseite nur aus dem Lade-Platzhalter — Google
 * bekam eine leere Huelle ohne <h1>, ohne Fliesstext. Isoliert betrifft das
 * jetzt nur noch diesen einen Knoten, der ohnehin nichts rendert.
 */
function AuthErrorToast({ t, locale, onAuthError }) {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const authError = searchParams.get("error");
    if (!authError) return;
    toast.error(authError === "OAuthAccountNotLinked" ? t.auth.accountNotLinked : t.auth.signInFailed);
    onAuthError();
    router.replace(locale === "de" ? "/" : `/${locale}`, { scroll: false });
  }, [searchParams, router, t, locale, onAuthError]);

  return null;
}

// Die Startseite wird fuer jede Sprache mit demselben Markup gerendert — nur
// das Woerterbuch (t) wechselt. Dadurch muss beim Hinzufuegen einer Sprache
// keine Zeile Layout dupliziert werden.
function HomeContent({ t, locale }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [renderRegister, setRenderRegister] = useState(false);
  const [navShadow, setNavShadow] = useState(false);
  const [renderLogin, setRenderLogin] = useState(false);

  const { data: session, status } = useSession();
  const router = useRouter();

  const userID = session?.user?.id || "";
  const role = session?.user?.role || "";
  const autherizedUser = userID && status === "authenticated";
  const adminAcc = userID && role === "Admin" && status === "authenticated";

  const showLogin = useCallback(() => setRenderLogin(true), []);

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

  const renderLoginW = () => setRenderLogin((prev) => !prev);
  return (
    <div>
      <div className="h-full bg-gray-50">
        {/* Navigation */}
        <Suspense fallback={null}>
          <AuthErrorToast t={t} locale={locale} onAuthError={showLogin} />
        </Suspense>
        <Suspense fallback={null}>
          <RenderUserID />
        </Suspense>
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
                          <Suspense fallback={null}>
                            <AdminLink labels={t.links} />
                          </Suspense>
                        </Button>
                      ) : (
                        <></>
                      )}
                    </NavigationMenuItem>
                    <NavigationMenuItem>
                      <Button variant="ghost" onClick={() => scrollToSection("#features")}>
                        {t.nav.features}
                      </Button>
                    </NavigationMenuItem>
                    <NavigationMenuItem>
                      <Button variant="ghost">
                        <Suspense fallback={<span>{t.nav.howItWorks}</span>}>
                          <WieFunktionierts locale={locale} label={t.nav.howItWorks} />
                        </Suspense>
                      </Button>
                    </NavigationMenuItem>
                    <NavigationMenuItem>
                      <Button variant="ghost" onClick={() => scrollToSection("#pricing")}>
                        {t.nav.pricing}
                      </Button>
                    </NavigationMenuItem>

                    {!userID && (
                      <NavigationMenuItem>
                        <Button variant="" onClick={renderLoginW}>
                          {t.nav.login}
                        </Button>
                      </NavigationMenuItem>
                    )}
                  </NavigationMenuList>
                </NavigationMenu>
                <LanguageSwitcher locale={locale} label={t.nav.language} />
                {autherizedUser && (
                  <Suspense fallback={null}>
                    <Profile />
                  </Suspense>
                )}
              </div>
              <div className="absolute left-0 inset-y-0 flex items-center md:hidden">
                <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
                  <SheetTrigger asChild>
                    <Button variant="ghost" size="icon" aria-label={t.nav.openMenu}>
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
                              {t.nav.adminConsole}
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
                              <Link href={{ pathname: "/Profil", query: { ...router.queryString } }}>{t.nav.profile}</Link>
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
                        {t.nav.features}
                      </Button>
                      <Button
                        variant="ghost"
                        onClick={() => {
                          scrollToSection("#pricing");
                          setMobileMenuOpen(false);
                        }}
                      >
                        {t.nav.pricing}
                      </Button>
                      {status === "authenticated" || userID ? null : (
                        <Button
                          variant="outline"
                          aria-label={t.nav.login}
                          onClick={() => {
                            setMobileMenuOpen(false);
                            renderLoginW();
                          }}
                        >
                          {t.nav.login}
                        </Button>
                      )}
                      <div className="pt-2">
                        <LanguageSwitcher locale={locale} label={t.nav.language} />
                      </div>
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
                    {t.home.hero.titleBefore}
                    <span className="text-red-300">{t.home.hero.titleHighlight}</span>
                    {t.home.hero.titleAfter}
                  </h1>
                  <p className="text-xl mb-8 text-white/70">{t.home.hero.subtitle}</p>
                  <div className="flex flex-col sm:flex-row gap-4">
                    {!userID && (
                      <Button asChild className="bg-yellow-400 text-gray-900 hover:bg-yellow-300 font-semibold text-base px-8 py-3 h-auto shadow-lg">
                        <a href={localizedPath("/ErstelleRestaurantAccount/FreeTier", locale)}>{t.home.hero.ctaPrimary}</a>
                      </Button>
                    )}
                    {!userID && (
                      <Button variant="outline" className="border-white/50 text-white hover:bg-white/10 font-medium text-base px-8 py-3 h-auto" onClick={renderLoginW}>
                        {t.home.hero.ctaSecondary}
                      </Button>
                    )}
                  </div>
                  <div className="mt-8 flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-6 text-sm text-white/70">
                    <div className="flex items-center">
                      <span className="text-green-400 mr-2">✓</span>
                      {t.home.hero.bullet1}
                    </div>
                    <div className="flex items-center">
                      <span className="text-green-400 mr-2">✓</span>
                      {t.home.hero.bullet2}
                    </div>
                  </div>
                </div>

                {/* Produkt-Vorschau rechts */}
                <div className="relative hidden lg:flex items-center justify-center">
                  <div aria-hidden className="absolute w-72 h-72 rounded-full bg-red-400/25 blur-3xl" />
                  <Image src={SpeiseKarteHandyNeu} alt={t.home.hero.phoneAlt} priority className="relative w-60 xl:w-68 h-auto rotate-3 rounded-3xl shadow-2xl ring-1 ring-white/20 transition-transform duration-300 hover:rotate-0" />
                </div>
              </div>
            </div>
          </section>
          <section className="bg-white flex items-center justify-center py-12 px-4">
            <div className="mx-auto max-w-6xl text-center">
              <header className="mb-10">
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-semibold text-gray-900">{t.home.responsive.title}</h2>
                <p className="mt-3 text-gray-500 text-sm sm:text-base">{t.home.responsive.subtitle}</p>
              </header>
              <div className="flex flex-col sm:flex-row gap-6 items-center justify-center w-full max-w-5xl mx-auto">
                <div className="relative w-full max-w-sm sm:max-w-xs md:max-w-md aspect-4/3">
                  <Image src={SpeiseKarteLaptopNeu} className="object-contain drop-shadow-2xl" alt={t.home.responsive.laptopAlt} />
                </div>
                <div className="relative w-full max-w-70 sm:max-w-30 md:max-w-62.5 aspect-9/16 sm:-ml-10 sm:translate-y-4">
                  <Image src={SpeiseKarteHandyNeu} className="object-contain drop-shadow-2xl" alt={t.home.responsive.phoneAlt} />
                </div>
              </div>
            </div>
          </section>
          <ExplainCards t={t.home.features} />
          {/* CTA Section */}
          <section className="py-20 bg-linear-to-br from-red-800 to-red-950 text-white">
            <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
              <h2 className="text-3xl md:text-4xl font-bold mb-6">{t.home.cta.title}</h2>
              <p className="text-xl mb-8 text-red-100">{t.home.cta.subtitle}</p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                {!userID && (
                  <Button asChild className="bg-yellow-400 text-gray-900 hover:bg-yellow-300 font-semibold text-base px-10 py-3 h-auto shadow-lg">
                    <a href={localizedPath("/ErstelleRestaurantAccount/FreeTier", locale)}>{t.home.cta.primary}</a>
                  </Button>
                )}
                <Button asChild variant="outline" className="border-white/50 text-black hover:bg-white/10 font-medium text-base px-10 py-3 h-auto">
                  <a href="#pricing">{t.home.cta.secondary}</a>
                </Button>
              </div>
            </div>
          </section>

          {/* Pricing Preview */}
          <section id="pricing" className="py-20 bg-gray-50">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center mb-16">
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">{t.home.pricing.title}</h2>
                <p className="text-xl text-gray-600">{t.home.pricing.subtitle}</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-3 gap-10 items-stretch">
                <Card className="flex flex-col h-full min-h-140 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
                  <CardHeader>
                    <CardTitle>{t.home.pricing.starter.name}</CardTitle>
                    <div className="text-3xl font-bold ">{t.home.pricing.free}</div>
                  </CardHeader>

                  <CardContent className="flex flex-col flex-1">
                    <ul className="space-y-3 mb-8">
                      {t.home.pricing.starter.features.map((feature) => (
                        <li key={feature} className="flex items-center">
                          <span className="text-green-500 mr-2">✓</span>
                          {feature}
                        </li>
                      ))}
                    </ul>

                    {/* Button nach unten drücken */}
                    <div className="mt-auto">
                      <Suspense fallback={null}>
                        <FreeTierLink className="w-full" labels={t.links} />
                      </Suspense>
                    </div>
                  </CardContent>
                </Card>
                <Card className="flex flex-col h-full min-h-140 border-2 border-amber-400 relative transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
                  <CardHeader>
                    <CardTitle>{t.home.pricing.business.name}</CardTitle>
                    <div className="text-3xl font-bold ">
                      7.99€<span className="text-lg font-normal">{t.home.pricing.perMonth}</span>
                    </div>
                  </CardHeader>

                  <CardContent className="flex flex-col flex-1">
                    <ul className="space-y-3 mb-8">
                      {t.home.pricing.business.features.map((feature) => (
                        <li key={feature} className="flex items-center">
                          <span className="text-green-500 mr-2">✓</span>
                          {feature}
                        </li>
                      ))}
                    </ul>

                    {/* Button nach unten drücken */}
                    <div className="mt-auto">
                      <Suspense fallback={null}>
                        <BusinessTierLink className="w-full bg-amber-400 hover:bg-amber-500 text-gray-900" labels={t.links} />
                      </Suspense>
                    </div>
                  </CardContent>
                </Card>

                <Card className="flex flex-col h-full min-h-140 bg-linear-to-b from-red-800 to-red-900 text-white border-2 border-red-600 relative shadow-xl transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl">
                  <Badge className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-yellow-400 text-gray-900">{t.home.pricing.comingSoon}</Badge>
                  <CardHeader>
                    <CardTitle>{t.home.pricing.professional.name}</CardTitle>
                    <div className="text-3xl font-bold">
                      <span className="text-lg font-normal">{t.home.pricing.perMonth}</span>
                    </div>
                  </CardHeader>
                  <CardContent className="flex flex-col flex-1">
                    <ul className="space-y-3 mb-8">
                      {t.home.pricing.professional.features.map((feature) => (
                        <li key={feature} className="flex items-center">
                          <span className="text-green-400 mr-2">✓</span>
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </div>
            </div>
          </section>
        </main>
        <Suspense fallback={null}>
          <FooterPart t={t.footer} locale={locale} />
        </Suspense>
        <div className="fixed align-top grid z-10 mt-0 top-0">
          {renderLogin && <LoginForm renderLogin={setRenderLogin} />}
          {renderRegister && <Registrieren renderRegistrieren={setRenderRegister} />}
        </div>
      </div>
    </div>
  );
}

export default function HomePage({ t, locale }) {
  return <HomeContent t={t} locale={locale} />;
}
