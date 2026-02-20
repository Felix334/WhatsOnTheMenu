"use client";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import profileImage from "./img/account_profile_user_avatar_icon_219236.jpg";
import { useState, useRef, useEffect } from "react";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const ExplainCards = () => {
  return (
    <section id="features" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Alles was du brauchst</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">Von der Erstellung bis zur Veröffentlichung - alle Tools für professionelle digitale Speisekarten</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <Card className="card-hover">
            <CardHeader>
              <div className="feature-icon text-4xl mb-4">🎨</div>
              <CardTitle>Einfach gehaltene Editoren</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>Intuitives Erstellen ohne technische Kenntnisse. Einfaches Erstellen und Bearbeiten von Speisekarten.</CardDescription>
            </CardContent>
          </Card>

          <Card className="card-hover">
            <CardHeader>
              <div className="feature-icon text-4xl mb-4">📱</div>
              <CardTitle>QR-Code Integration</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>Automatische QR-Code Generierung für einfache Integration und Verwendung.</CardDescription>
            </CardContent>
          </Card>

          <Card className="card-hover">
            <CardHeader>
              <div className="feature-icon text-4xl mb-4">🌍</div>
              <CardTitle>Premium-Features</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>Für ein noch intensiveres und ansprechenderes Erlebniss für ihre Kunden</CardDescription>
            </CardContent>
          </Card>

          <Card className="card-hover">
            <CardHeader>
              <div className="feature-icon text-4xl mb-4">⚡</div>
              <CardTitle>Echtzeit Updates</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>Daten und Bilder sofort aktualisieren - ohne neue QR-Codes drucken zu müssen.</CardDescription>
            </CardContent>
          </Card>

          <Card className="card-hover">
            <CardHeader>
              <div className="feature-icon text-4xl mb-4">📊</div>
              <CardTitle>Analytics Dashboard</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>Detaillierte Einblicke in beliebte Gerichte und Kundenverhalten.</CardDescription>
            </CardContent>
          </Card>

          <Card className="card-hover">
            <CardHeader>
              <div className="feature-icon text-4xl mb-4">🎯</div>
              <CardTitle>Anpassbare Designs</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>Professionelle Vorlagen die zu ihrem Restaurant-Branding passen.</CardDescription>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default ExplainCards;
