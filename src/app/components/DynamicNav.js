"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";

import Profile from "./Profile";
import { Button } from "@/components/ui/button";
import { NavigationMenu, NavigationMenuContent, NavigationMenuItem, NavigationMenuList } from "@/components/ui/navigation-menu";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { AdminLink, ProfilLink } from "./renderDynamicLinks"; // Use dynamic links for auth routes
import { DynamicLinkButton } from "./DynamicLink";

export default function DynamicNav({ onLoginClick, scrollToSection, mobileMenuOpen, onMobileMenuToggle, navShadow }) {
  const [adminAccess, setAdminAccess] = useState(false);
  const { data: session, status } = useSession();

  const userID = session?.user?.id || "";
  const role = session?.user?.role || "";
  const autherizedUser = userID && status === "authenticated";
  const adminAcc = userID && role === "Admin" && status === "authenticated";

  useEffect(() => {
    if (adminAcc) {
      setAdminAccess(true);
    }
  }, [adminAcc]);

  const handleLogin = () => {
    onLoginClick();
  };

  const toggleMobileMenu = () => {
    onMobileMenuToggle();
  };

  return (
    <nav className={`bg-white shadow-lg sticky top-0 z-50 ${navShadow ? "shadow-xl" : ""}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-center md:justify-between items-center h-16">
          <div className="absolute right-0 md:block">
            {autherizedUser && (
              <div>
                <Profile />
              </div>
            )}
          </div>
          <div className="flex items-center justify-center md:justify-start">
            <div className="text-2xl font-bold text-red-800 text-center md:text-left">🍽️ WhatIsOnMyMenu</div>
          </div>
          <div className="hidden right-0 md:block">
            <NavigationMenu>
              <NavigationMenuList>
                <NavigationMenuContent>
                  <NavigationMenuItem>
                    <AdminLink asChild>
                      <Button variant="ghost">Admin Konsole</Button>
                    </AdminLink>
                  </NavigationMenuItem>
                  <NavigationMenuItem>
                    <DynamicLinkButton href="/UnserePartner" variant="ghost">
                      Unsere Partner
                    </DynamicLinkButton>
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
                    <>
                      <NavigationMenuItem>
                        <Button variant="" onClick={handleLogin}>
                          Anmelden
                        </Button>
                      </NavigationMenuItem>
                      <NavigationMenuItem>
                        <Button asChild>
                          <a href="/register">Kostenlos starten</a>
                        </Button>
                      </NavigationMenuItem>
                    </>
                  )}
                </NavigationMenuContent>
              </NavigationMenuList>
            </NavigationMenu>
          </div>
          <div className="absolute left-0 flex flex-col md:hidden">
            <Sheet open={mobileMenuOpen} onOpenChange={toggleMobileMenu}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon">
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="grid grid-cols-3 [&>button]:hidden">
                <div className="space-y-1 top-6 relative">
                  {adminAccess && (
                    <div>
                      <AdminLink asChild>
                        <Button variant="ghost">Admin Konsole</Button>
                      </AdminLink>
                    </div>
                  )}
                  {autherizedUser && (
                    <div>
                      <ProfilLink asChild>
                        <Button variant="ghost">Profil</Button>
                      </ProfilLink>
                    </div>
                  )}
                  <Button
                    variant="ghost"
                    onClick={() => {
                      scrollToSection("#features");
                      toggleMobileMenu();
                    }}
                  >
                    Features
                  </Button>
                  <Button
                    variant="ghost"
                    onClick={() => {
                      scrollToSection("#pricing");
                      toggleMobileMenu();
                    }}
                  >
                    Preise
                  </Button>
                  <Button
                    variant="ghost"
                    onClick={() => {
                      scrollToSection("#examples");
                      toggleMobileMenu();
                    }}
                  >
                    Beispiele
                  </Button>
                  <DynamicLinkButton href="/UnserePartner" variant="ghost">
                    Unsere Partner
                  </DynamicLinkButton>
                  {!userID && (
                    <Button
                      variant="outlined"
                      aria-label="Log in"
                      onClick={() => {
                        toggleMobileMenu();
                        handleLogin();
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
  );
}
