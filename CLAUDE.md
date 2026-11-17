# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Projekt

WhatsOnTheMenu — SaaS-Plattform für Restaurants: digitale Speisekarten per QR-Code, Bestellungen, Reservierungen, Personalverwaltung, Stripe-Abos. Öffentliche Seiten Englisch (präfixlos) + Deutsch (`/de`); Owner-Dashboard `/dashboard` und `/staff` zweisprachig über `User.language`; `/settings`, Admin und Rechtsseiten noch Deutsch. Routen-Namen größtenteils englisch (`/dashboard`, `/staff`, `/orders`), einige noch deutsch (`/Reservierung`, `/beanspruchen`, `/UnserePartner/...`).

## Befehle

```bash
npm run dev          # Dev-Server (next dev)
NEXT_DIST_DIR=.next-verify npx next build   # Build, waehrend dev laeuft (sonst zerschiessen sich beide .next)
npm run build        # prisma generate && next build
npm run lint         # next lint
npm run prismaseed   # DB seeden (node prisma/seedPrisma)
npx prisma generate  # Client neu generieren (läuft auch als postinstall)
```

Keine Test-Suite vorhanden. Docker: `npm run docker:build` / `docker:run` / `docker:prod`.

## Architektur

Next.js 15 App Router (React 19), überwiegend JavaScript mit einzelnen TS-Dateien. Pfad-Alias: `@/*` → `./src/*` (jsconfig.json). Achtung: Einige Dateien importieren stattdessen relativ oder mit `src/lib/...`-Prefix — bestehenden Stil der jeweiligen Datei beibehalten (Hintergrund: shadcn hat die Aliase früher zerschossen, siehe info.txt).

### Schichten

- `src/app/(de)/(Routes)/` — deutsche Seiten. Owner-Bereich unter `dashboard/` (inkl. `qr-codes`, `orders`, `print`; bis Nov 2026 `Profil/`), Personal unter `staff/` (`orders`, `availability`, `calendar`), Kunden-Bestellstatus unter `orders/[orderID]`, außerdem `Admin`, `Reservierung`, `pricing/success`+`cancel`, `settings` und die deutschen Rechtsseiten. Alles hier läuft ohne Präfix auf Deutsch.
- `src/app/(intl)/[locale]/` — übersetzte öffentliche Seiten in **allen** Sprachen, auch Englisch (intern `/en/...`, ausgeliefert ohne Präfix) und Deutsch (`/de/...`).
- `src/app/api/` — Route-Handler. Gliederung: `auth/[...nextauth]`, `restaurant/` (Menü lesen, Registrierung, Staff-Einladungen), `orders/` (create, status, Liste je Restaurant), `payment/` (checkout, webhook, portal, cancel, reactivate, subscription), `user/profil/` (viele kleine Endpoints zum Bearbeiten von Menü/Design/Allergenen/Verfügbarkeit), `Admin/`, `deleteAccount/[id]`.
- `src/app/components/` — geteilte Client-Komponenten (Anmelden, Registrieren, QR-Scanner, Nav …); `src/components/ui/` — shadcn-Komponenten.
- `src/lib/` — Kernlogik: `auth.ts` (NextAuth-Optionen), `staffAuth.js`, `prisma.ts`, `stripe.ts`, `supabase.js` (Storage), `nodemailer.ts`, `schemas/` (Zod), `allergens.js`.
- `prisma/schema.prisma` — ~23 Modelle. Kernkette: User → Restaurant → Menu → CategoryGroup/Category → Dish; Allergene, Zusatzstoffe und Merkmale liegen als Enum-Arrays (`allergens`, `additives`, `tags`) direkt auf Dish, Listen in `src/lib/allergens.js` / `src/lib/dishInfo.js`. Größen/Preisvarianten im Model `DishVariant`; hat ein Gericht welche, ist `Dish.price` der kleinste Variantenpreis („ab“-Preis) — wer Variantenpreise ändert, muss `Dish.price` nachziehen (siehe `updateDish`, `bulkPrice`). Gericht-Validierung für Editor und API gemeinsam in `src/lib/schemas/dish.js`. Daneben Order, Reservation, RestaurantStaff, Payment, StripeEvent.

### Mehrsprachigkeit & SEO

- **Englisch ist Standardsprache** und läuft **ohne** Präfix (`/pricing`, `/how-it-works`); jede weitere Sprache bekommt ein Präfix (`/de/pricing`). Seit Nov 2026 — vorher war Deutsch präfixlos und Englisch unter `/en`. Die Middleware übernimmt das komplett über `resolveLocaleRoute` in `src/i18n/config.js`: `/pricing` → intern `/en/pricing` (Rewrite), alte URLs `/en/...` → 308 auf präfixlos, alte deutsche `/WieFunktionierts` & Co. → 308 auf `/de/...`. Betrifft nur Pfade in `TRANSLATED_PATHS`. `(de)` und `(intl)` sind Route-Gruppen — kein URL-Segment, nur je ein eigenes Root-Layout mit korrektem `<html lang>`. Deshalb gibt es **kein** `src/app/layout.js`.
- Neue Sprache: Eintrag in `src/i18n/config.js` (`locales`) + `src/i18n/<code>.js`. Keine Seite duplizieren — der Baum unter `(intl)/[locale]/` wird geteilt. Neue übersetzte Seite: Ordner dort + Pfad in `TRANSLATED_PATHS` (config.js), sonst greift das Routing nicht.
- Englische Pfad-Namen (`/how-it-works`, `/about-us`, `/legal-notice`, `/sign-up/...`) stehen in `src/i18n/slugs.mjs`; die Ordner behalten die deutschen Namen (= sprachneutraler Pfad). Im Code immer den sprachneutralen Pfad an `localizedPath`/`buildAlternates` geben, nie `/de/...` oder englische Slugs hart verdrahten. Ausnahme: Links aus deutschen Dashboards auf die Tarifseite zeigen bewusst auf `/de/pricing`.
- Jede öffentliche Seite braucht `alternates: buildAlternates("<pfad>", locale)` aus `src/i18n` — ohne hreflang konkurrieren die Sprachfassungen gegeneinander. Neue übersetzte Seiten zusätzlich in `TRANSLATED_PAGES` in `src/app/sitemap.js` eintragen.
- **Falle:** `useSearchParams()` in einer Client-Komponente lässt die umschließende Suspense-Grenze beim Prerendering auf den Fallback zurückfallen. Umschließt diese Grenze die ganze Seite, liefert Next nur eine leere Hülle aus und Google sieht keinen Text. Solche Hooks gehören in eine eigene, kleine Suspense-Grenze (siehe `AuthErrorToast` in `src/app/components/HomePage.js`). Nach Änderungen an öffentlichen Seiten mit `grep -c "<h1" .next/server/app/<seite>.html` gegenprüfen.
- Übersetzt: Startseite, `/pricing` (inkl. Checkout, Komponente `PricingPlans`; Zustimmungstext Satz für Satz am deutschen Original, AGB/Widerruf verlinkt auf die deutschen Seiten mit Hinweis „German wording is legally binding“), `/how-it-works`, `/about-us`, `/legal-notice` (mit Hinweis „deutsche Fassung maßgeblich“), Tarif-Auswahl, die Registrierungsformulare FreeTier + Business (`noindex`) und die Kontoseite (`/account` bzw. `/de/Konto`, `noindex`; Sprache aus der URL, nicht aus `User.language` — das Profil-Menü verlinkt in der Sprache der aktuellen Seite).
- Eingeloggte Bereiche (`/dashboard` samt qr-codes/print/orders, `/staff`) nehmen die Sprache aus `User.language` über `useUiLanguage()` — **nicht** aus der URL, sonst bräuchte jede geschützte Route eine `/de/...`-Variante in der Middleware. Umschalter: `UiLanguageSwitcher`. Texte des Owner-Dashboards in `src/i18n/dashboard.de.js` / `dashboard.en.js` (als `t.dashboard`, beide Dateien mit identischen Schlüsseln), Platzhalter über `fmt`/`plural` aus `src/i18n/format.js`. Listen in `src/lib` (Allergene, Zusatzstoffe, Merkmale, Schärfe, Farb-Presets, Themes) tragen die englische Fassung direkt am Eintrag (`nameEn`/`labelEn`/`descriptionEn`), wie `categories.js`. Zod-Meldungen aus geteilten Server-Schemas (`schemas/dish.js`) übersetzt der Gericht-Dialog per Zuordnungstabelle (`dashboard.dish.schemaErrors`), das Schema selbst bleibt deutsch.
- Umbenannte Dashboard-Pfade (`/Profil` → `/dashboard`, `/Profil/QRBuilder` → `/dashboard/qr-codes`, `/Profil/Bestellungen` → `/dashboard/orders`, `/Profil/Drucken` → `/dashboard/print`, `/staff/bestellungen` → `/staff/orders`) leiten per 308 aus `redirects()` in `next.config.mjs` weiter. Neue Umbenennungen dort eintragen; das Ziel muss unter demselben geschützten Präfix bleiben, sonst greift die Rollenprüfung der Middleware nicht.
- Nicht übersetzt (bewusst): übrige Rechtsseiten — Datenschutz, AGB, Widerruf (deutsches Recht), `/settings` und Admin, Gerichtnamen in den Speisekarten (Restaurant-Daten aus der DB), sowie `ErstelleRestaurantAccount/Professional` (in Produktion per Middleware gesperrt) und `.../Individuell` (verwaist, nichts verlinkt darauf).
- **Anbieterkennzeichnung steht ausschließlich in `/Impressum`** — Name/Anschrift/E-Mail einmalig in `PROVIDER` in `src/app/components/ImprintPage.js`, beide Sprachfassungen rendern daraus. `/UnserTeam` ist eine reine Über-uns-Seite und verlinkt nur dorthin — sie hatte früher eine zweite, widersprüchliche Fassung mit erfundener Rechtsform und Handelsregisternummer. Pflichtangaben nie an zwei Stellen pflegen.
- Formular-Bausteine: `RestaurantSignupForm` (FreeTier, legt Konto an) und `RestaurantCheckoutForm` (Business, geht in den Stripe-Checkout) sind absichtlich getrennt, obwohl die Felder gleich sind — am Bezahlpfad soll keine Änderung am kostenlosen Pfad mitwirken. Kategorien liegen als Wert-plus-Label-Paare in `src/i18n/categories.js`, Länder als Whitelist (`SUPPORTED_COUNTRIES`) in `src/lib/schemas/restaurant.js`.

### Auth & Rollen (sicherheitskritisch)

Regel für dieses Projekt: **Sicherheit vor Effizienz** — jede rollen- oder abo-abhängige Entscheidung serverseitig prüfen, nie nur im Client.

- NextAuth 4 mit JWT-Strategie und PrismaAdapter (`src/lib/auth.ts`); Provider: E-Mail (nur wenn `EMAIL_SERVER_HOST` gesetzt), Google, Facebook, Credentials.
- Globale Rollen (`User.role`): `User`, `Staff`, `Admin`, `Owner`, `Manager`, `Executive`. Abo-Stufen (`User.subscription`): `NoSubscription`, `FreeTier`, `Professional`, `Business`. **Angezeigt** werden sie als Free / Plus (`Business`, mittlerer Tarif) / Premium (`Professional`, höchster Tarif) — Anzeigenamen nur über `tierLabel()`/`TIER_LABELS` aus `src/lib/tierLabels.js`, nie den Enum-Wert ausgeben. Enum, Stripe-Metadaten und Routen-Namen bleiben bewusst bei den alten Werten. Die Leistungen je Tarif stehen nur in `PLAN_FEATURES` oben in `src/i18n/de.js`/`en.js` (Startseite, `/pricing`, Tarif-Wähler lesen alle daraus); nur eintragen, was der Server wirklich freigibt. Farb-Presets und die Regel „freie Farbwahl ab Plus“ liegen in `src/lib/schemas/colorPresets.js` (Editor + Speicher-Routen).
- `src/middleware.js` schützt Routen-Präfixe per Token-Rolle: `/Admin` + `/api/Admin` + `/api/restaurant/Admin` → Admin, `/dashboard` (und das alte `/Profil`) → Owner, `/staff` + `/settings` → Owner/Staff. Der `matcher` deckt alle Pfade außer statischen Dateien ab; neue geschützte Präfixe brauchen nur eine Prüfung im Code. Punkte im `matcher`-String immer als `\\.` schreiben, `\.` wird im JS-String zu `.`.
- Übernahme-Links (`RestaurantClaim`, Regeln in `src/lib/schemas/claim.js`): Bau-Accounts aus der Env-Variable `CLAIM_BUILDER_EMAILS` (FreeTier-Owner ohne Stripe-Abo) erzeugen im Profil einen Link; der Kunde löst ihn unter `/beanspruchen/[token]` mit Google ein (`api/claim/[token]`), bekommt `ownerId` + Owner/FreeTier, der Bau-Account fällt auf `User`/`NoSubscription` zurück. Nur der Token-Hash liegt in der DB, Einlösen ist einmalig.
- Restaurant-Personal hat zusätzlich eine eigene Ebene: `RestaurantStaff` mit `StaffRole` (`manager`/`waiter`/`kitchen`) und `approved`-Flag; Berechtigungs-Mapping in `src/lib/staffAuth.js` (`getStaffAccess`) — API-Routen für Staff-Funktionen prüfen darüber, nicht nur über die globale Rolle.

### Datenbank & Stripe

- `src/lib/prisma.ts`: PrismaClient über `@prisma/adapter-pg` mit pg-Pool als Singleton (max 5 Connections — Supabase Free Tier); Pool-Konfiguration nicht ohne Grund ändern.
- Stripe-Webhooks unter `api/payment/webhook`; verarbeitete Events werden in `StripeEvent` dedupliziert. Abo-Status landet auf `User.subscription`.

### Restaurant-Subdomains

- `<subdomain>.whatisonmymenu.com` (lokal `<subdomain>.localhost:3000`) zeigt die Speisekarte, nur für Professional/Business. Die Middleware macht **keinen** DB-Zugriff (Edge-Runtime), sondern schreibt `/` auf `src/app/(de)/(Routes)/sub/[subdomain]` um; andere Seitenpfade gehen per Redirect auf www, `/api` läuft durch die normalen Rollenprüfungen.
- Regeln (Format, reservierte Namen, erlaubte Abos) liegen in `src/lib/schemas/subdomain.js` und werden von Middleware, API (`api/user/profil/subdomain`) und Profil-Dialog gemeinsam genutzt. Abo wird beim Setzen **und** beim Auflösen aus der DB geprüft.

### Sonstiges

- Bilder liegen in Supabase Storage, Bucket `menu-images` (öffentlich lesbar). Da Login über NextAuth läuft, kennt Supabase keine Nutzer: **keine** Schreibregeln für anon im Bucket, geschrieben wird nur serverseitig mit dem Service-Role-Key (`supabaseAdmin` in `src/lib/supabase.js`, `server-only`). In der DB steht nur der Speicherpfad, die URL baut `storagePublicUrl()`. Uploads werden im Browser vorkomprimiert und auf dem Server mit sharp neu kodiert (WebP q75, EXIF weg) — in zwei Fassungen: `<uuid>.webp` (1920 px, Desktop) und `<uuid>-sm.webp` (1280 px, Handy; Pfad über `smallVariantPath()`, nicht in der DB). Regeln/Limits in `src/lib/schemas/menuImage.js`. Bisher: Hintergrundbild (`Menu.bgImage`, Route `api/user/profil/bgImage`). Kontolöschung räumt den Ordner des Restaurants mit ab. `scripts/compress-images.js` zum Komprimieren.
- `TODO.todo` und `info.txt` im Root enthalten offene Punkte und bekannte Stolperfallen — vor größeren Umbauten kurz reinschauen.
