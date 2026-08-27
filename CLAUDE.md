# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Projekt

WhatsOnTheMenu — SaaS-Plattform für Restaurants: digitale Speisekarten per QR-Code, Bestellungen, Reservierungen, Personalverwaltung, Stripe-Abos. UI-Sprache ist Deutsch, Routen-Namen gemischt deutsch/englisch (`/Profil`, `/Konto`, `/staff`, `/orders`).

## Befehle

```bash
npm run dev          # Dev-Server (next dev)
npm run build        # prisma generate && next build
npm run lint         # next lint
npm run prismaseed   # DB seeden (node prisma/seedPrisma)
npx prisma generate  # Client neu generieren (läuft auch als postinstall)
```

Keine Test-Suite vorhanden. Docker: `npm run docker:build` / `docker:run` / `docker:prod`.

## Architektur

Next.js 15 App Router (React 19), überwiegend JavaScript mit einzelnen TS-Dateien. Pfad-Alias: `@/*` → `./src/*` (jsconfig.json). Achtung: Einige Dateien importieren stattdessen relativ oder mit `src/lib/...`-Prefix — bestehenden Stil der jeweiligen Datei beibehalten (Hintergrund: shadcn hat die Aliase früher zerschossen, siehe info.txt).

### Schichten

- `src/app/(Routes)/` — Seiten. Owner-Bereich unter `Profil/` (inkl. `QRBuilder`, `Bestellungen`), Personal unter `staff/`, Kunden-Bestellstatus unter `orders/[orderID]`, außerdem `Admin`, `Konto`, `Reservierung`, `pricing`, `settings` und statische Rechtsseiten.
- `src/app/api/` — Route-Handler. Gliederung: `auth/[...nextauth]`, `restaurant/` (Menü lesen, Registrierung, Staff-Einladungen), `orders/` (create, status, Liste je Restaurant), `payment/` (checkout, webhook, portal, cancel, reactivate, subscription), `user/profil/` (viele kleine Endpoints zum Bearbeiten von Menü/Design/Allergenen/Verfügbarkeit), `Admin/`, `deleteAccount/[id]`.
- `src/app/components/` — geteilte Client-Komponenten (Anmelden, Registrieren, QR-Scanner, Nav …); `src/components/ui/` — shadcn-Komponenten.
- `src/lib/` — Kernlogik: `auth.ts` (NextAuth-Optionen), `staffAuth.js`, `prisma.ts`, `stripe.ts`, `supabase.js` (Storage), `nodemailer.ts`, `schemas/` (Zod), `allergens.js`.
- `prisma/schema.prisma` — ~23 Modelle. Kernkette: User → Restaurant → Menu → CategoryGroup/Category → Dish; Allergene liegen als `Allergen[]`-Enum-Array direkt auf Dish (kein eigenes Model); daneben Order, Reservation, RestaurantStaff, Payment, StripeEvent.

### Auth & Rollen (sicherheitskritisch)

Regel für dieses Projekt: **Sicherheit vor Effizienz** — jede rollen- oder abo-abhängige Entscheidung serverseitig prüfen, nie nur im Client.

- NextAuth 4 mit JWT-Strategie und PrismaAdapter (`src/lib/auth.ts`); Provider: E-Mail (nur wenn `EMAIL_SERVER_HOST` gesetzt), Google, Facebook, Credentials.
- Globale Rollen (`User.role`): `User`, `Staff`, `Admin`, `Owner`, `Manager`, `Executive`. Abo-Stufen (`User.subscription`): `NoSubscription`, `FreeTier`, `Professional`, `Business`.
- `src/middleware.js` schützt Routen-Präfixe per Token-Rolle: `/Admin` + `/api/Admin` → Admin, `/Profil` → Owner, `/staff` + `/settings` → Owner/Staff. Neue geschützte Präfixe müssen in den `matcher` eingetragen werden.
- Restaurant-Personal hat zusätzlich eine eigene Ebene: `RestaurantStaff` mit `StaffRole` (`manager`/`waiter`/`kitchen`) und `approved`-Flag; Berechtigungs-Mapping in `src/lib/staffAuth.js` (`getStaffAccess`) — API-Routen für Staff-Funktionen prüfen darüber, nicht nur über die globale Rolle.

### Datenbank & Stripe

- `src/lib/prisma.ts`: PrismaClient über `@prisma/adapter-pg` mit pg-Pool als Singleton (max 5 Connections — Supabase Free Tier); Pool-Konfiguration nicht ohne Grund ändern.
- Stripe-Webhooks unter `api/payment/webhook`; verarbeitete Events werden in `StripeEvent` dedupliziert. Abo-Status landet auf `User.subscription`.

### Sonstiges

- Bilder liegen in Supabase Storage (`src/lib/supabase.js`); `scripts/compress-images.js` zum Komprimieren.
- `TODO.todo` und `info.txt` im Root enthalten offene Punkte und bekannte Stolperfallen — vor größeren Umbauten kurz reinschauen.
