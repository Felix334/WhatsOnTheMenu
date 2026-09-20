// Deutsche Texte der oeffentlichen Seiten.
//
// Struktur bewusst flach nach Seite/Abschnitt — damit beim Uebersetzen
// sofort sichtbar ist, welcher Block in en.js noch fehlt.

const de = {
  meta: {
    home: {
      title: "Online Speisekarte erstellen | QR Menü Generator",
      description: "Erstelle digitale und kostenlose Speisekarten für dein Restaurant. Einfach, schnell und mobil per QR-Code nutzbar. Direkt im Browser ohne Extra Software",
      ogTitle: "Online Speisekarte erstellen",
      ogDescription: "Erstelle digitale Speisekarten für dein Restaurant.",
    },
    pricing: {
      title: "Preise & Tarife | WhatIsOnMyMenu",
      description: "Alle Tarife im Überblick: kostenlose Standardversion, Business für 7,99 €/Monat. Digitale Speisekarten per QR-Code, monatlich kündbar.",
    },
    howItWorks: {
      title: "Wie funktioniert's? | Digitale Speisekarte in Minuten",
      description: "In wenigen Schritten zur digitalen Speisekarte: Konto anlegen, Gerichte eintragen, QR-Code drucken. Ohne Software-Installation.",
    },
    team: {
      title: "Unser Team | WhatIsOnMyMenu",
      description: "Die Menschen hinter WhatIsOnMyMenu — digitale Speisekarten für Restaurants.",
    },
  },

  // Sprachhinweis-Banner. Diese Texte werden in der ZIELsprache angezeigt —
  // ein Besucher, der die aktuelle Sprache nicht liest, soll den Hinweis
  // verstehen. "banner" aus de.js erscheint also auf der englischen Seite.
  banner: {
    message: "Diese Seite gibt es auch auf Deutsch.",
    action: "Auf Deutsch ansehen",
    dismiss: "Hinweis schließen",
  },

  // Beschriftungen der geteilten Link-Komponenten (renderDynamicLinks.js).
  links: {
    alreadyActive: "Bereits aktiv",
    subscribe: "Abo abschließen",
    howItWorks: "Wie Funktionierts",
    adminConsole: "Admin Konsole",
    checkNow: "Jetzt prüfen",
    bookDemo: "Demo buchen",
    registerFree: "Kostenlos registrieren",
    home: "Home",
    profile: "Profil",
    logout: "Logout",
  },

  auth: {
    accountNotLinked: "Diese E-Mail ist bereits mit einer anderen Anmeldemethode verknüpft.",
    signInFailed: "Anmeldung abgebrochen oder fehlgeschlagen. Bitte versuche es erneut.",
  },

  nav: {
    features: "Features",
    howItWorks: "Wie funktioniert's",
    pricing: "Angebote",
    login: "Anmelden",
    profile: "Profil",
    adminConsole: "Admin Konsole",
    openMenu: "Menü öffnen",
    language: "Sprache",
  },

  home: {
    hero: {
      titleBefore: "Digitale Speisekarten in ",
      titleHighlight: "wenigen Minuten",
      titleAfter: " erstellen- ganz ohne KI",
      subtitle: "Erstellen Sie professionelle, interaktive Speisekarten für Ihr Restaurant. Mit QR-Codes, mehrsprachiger Unterstützung und einfacher Bearbeitung - Ganz ohne KI-Slop.",
      ctaPrimary: "Jetzt kostenlos starten",
      ctaSecondary: "Anmelden",
      bullet1: "Kostenlose Standardversion verfügbar",
      bullet2: "Übersichtliche Gestaltung für Ihre Kunden",
      phoneAlt: "Digitale Speisekarte auf dem Smartphone",
    },
    responsive: {
      title: "Passt sich einfach Ihren Geräten an",
      subtitle: "Optimiert für Smartphone, Tablet und Desktop - ohne Kompromisse im Design.",
      laptopAlt: "Speisekarte Laptop",
      phoneAlt: "Speisekarte Handy",
    },
    features: {
      title: "Alles, was Sie brauchen",
      subtitle: "Von der Erstellung bis zur Veröffentlichung – alle Tools für professionelle digitale Speisekarten.",
      items: [
        {
          icon: "🎨",
          title: "Einfach gehaltene Editoren",
          description: "Mit unserem intuitiven Editor können Sie Speisekarten ohne technische Kenntnisse erstellen, bearbeiten und aktualisieren.",
        },
        {
          icon: "📱",
          title: "QR-Code Integration",
          description: "Automatische Generierung eines QR-Codes für Ihre digitale Speisekarte. Gäste scannen einfach den Code und sehen sofort Ihr Menü.",
        },
        {
          icon: "🌍",
          title: "Premium Features",
          description: "Erweiterte Funktionen für ein moderneres und interaktiveres Erlebnis für Ihre Gäste.",
        },
        {
          icon: "⚡",
          title: "Verfügbarkeits-Updates",
          description: "Zeigen sie Ihren Kunden ob ein Gericht verfügbar ist oder nicht, kein unnöties Fragen mehr nötig.",
        },
        {
          icon: "📊",
          title: "Management-System",
          description: "Verteilen Sie Ihre Aufgaben und Möglichkeiten zwischen den Mitarbeitern. \nJeder bekommt seine Aufgaben und Rechte",
        },
        {
          icon: "🎯",
          title: "Anpassbare Designs",
          description: "Professionelle Design-Vorlagen, die perfekt zu Ihrem Restaurant-Branding passen.",
        },
      ],
    },
    cta: {
      title: "Bereit für Ihre erste digitale Speisekarte?",
      subtitle: "Erstellen Sie noch heute Ihre eigene digitale Speisekarte – schnell, einfach und ohne Verpflichtungen",
      primary: "Kostenlos loslegen",
      secondary: "Preise ansehen",
    },
    pricing: {
      title: "Transparente Preise",
      subtitle: "Wähle den Plan, der zu Ihrem Restaurant passt",
      perMonth: "/Monat",
      free: "Kostenlos",
      comingSoon: "Coming Soon",
      starter: {
        name: "Starter",
        features: ["Bis zu 10 Kategorien", "Bis zu 80 Gerichte", "Basis Templates", "QR-Code"],
      },
      business: {
        name: "Business",
        features: ["Bis zu 25 Kategorien", "Bis zu 150 Gerichte", "Basis Templates", "QR-Code", "Event-Kalender (30 Tage)"],
      },
      professional: {
        name: "Professional",
        features: ["Bis zu 50 Kategorien", "Bis zu 300 Gerichte", "Premium Templates", "QR-Code", "Management-System", "Gerichtverfügbarkeitsanzeige", "Event-Kalender (365 Tage)", "Inventar & Lieferanten-Übersicht"],
      },
    },
  },

  // Wird auf den deutschen Seiten nicht verwendet — /pricing hat dort die
  // vollstaendige Checkout-Strecke. Steht hier nur, damit beide Woerterbuecher
  // dieselbe Form haben.
  pricingOverview: {
    title: "Preise",
    subtitle: "Kostenlos starten und upgraden, wenn die Karte wächst. Monatlich kündbar.",
    checkoutNote: "Checkout und Vertragsbedingungen laufen auf Deutsch.",
    cta: "Weiter zum Checkout",
    freeCta: "Kostenlos starten",
  },

  howItWorks: {
    hero: {
      badge: "So funktioniert's",
      titleLine1: "Ihre digitale Speisekarte –",
      titleLine2: "in wenigen Minuten startklar",
      subtitle: "Mit WhatIsOnMyMenu erstellen Sie eine digitale Speisekarte, die Ihre Gäste per QR-Code direkt am Tisch öffnen – ohne App, ohne Papier, jederzeit aktuell.",
      ctaPrimary: "Kostenlos starten",
      ctaSecondary: "Alle Tarife ansehen",
    },
    steps: {
      eyebrow: "Für Restaurants",
      title: "In 4 Schritten zur eigenen Karte",
      subtitle: "Vom Konto bis zum QR-Code auf dem Tisch – schneller, als Sie denken.",
      items: [
        { number: "1", icon: "👤", title: "Kostenlos anmelden", text: "Melden Sie sich in Sekunden mit Ihrem Google-Konto an – keine Kreditkarte nötig. Sie starten direkt im Free-Tarif." },
        { number: "2", icon: "🍽️", title: "Restaurant & Menü anlegen", text: "Tragen Sie die Eckdaten Ihres Restaurants ein und bauen Sie Ihre Speisekarte: Kategorien, Gerichte, Preise, Beschreibungen und Allergene." },
        { number: "3", icon: "🎨", title: "Design anpassen", text: "Wählen Sie Farben, Schriftarten und ein Hero-Design, das zu Ihrem Restaurant passt – Ihre digitale Karte sieht aus wie Ihre Marke." },
        { number: "4", icon: "📲", title: "QR-Code teilen", text: "Generieren Sie Ihren QR-Code, drucken Sie ihn und platzieren Sie ihn auf den Tischen. Gäste scannen ihn und Ihre Karte öffnet sich sofort." },
      ],
    },
    features: {
      eyebrow: "Funktionen",
      title: "Alles, was Ihre Speisekarte braucht",
      subtitle: "Von der Gestaltung über Allergene bis zur Team-Verwaltung – alles an einem Ort.",
      items: [
        { icon: "📋", title: "Digitale Speisekarte", text: "Strukturieren Sie Ihr Angebot in Gruppen, Kategorien und Gerichten – mit Preisen und Beschreibungen." },
        { icon: "🔳", title: "QR-Code Generator", text: "Jedes Restaurant bekommt einen eigenen QR-Code. Einmal drucken, immer aktuell – Änderungen sind sofort live." },
        { icon: "🎨", title: "Eigenes Design", text: "Hintergrundfarben, Schriftarten und Farbakzente pro Kategorie. Im Professional-Tarif zusätzlich Premium-Farben & -Fonts." },
        { icon: "⚠️", title: "Allergene & Zutaten", text: "Hinterlegen Sie Allergene pro Gericht. Ihre Gäste sehen auf einen Blick, was drin ist – rechtssicher und transparent." },
        { icon: "🟢", title: "Echtzeit-Verfügbarkeit", text: "Markieren Sie Gerichte mit einem Klick als „ausverkauft“. Gäste sehen sofort, was gerade verfügbar ist." },
        { icon: "⭐", title: "Bewertungen", text: "Gäste können Gerichte bewerten. Durchschnittsbewertung und Anzahl werden direkt an der Speisekarte angezeigt." },
        { icon: "👥", title: "Team-Verwaltung", text: "Laden Sie Mitarbeiter ein und vergeben Sie Rollen (Manager, Service, Küche) mit passenden Berechtigungen – im Professional-Tarif." },
        { icon: "🧾", title: "Tisch-Bestellungen", text: "Nehmen Sie Bestellungen pro Tisch auf und verwalten Sie ihren Status von „offen“ über „bestätigt“ bis „erledigt“." },
        { icon: "📍", title: "Mehrere Standorte", text: "Verwalten Sie Adressen, Öffnungszeiten und Reservierungs-Kontakt – auch für Restaurants mit mehreren Filialen." },
      ],
    },
    guests: {
      eyebrow: "Für Ihre Gäste",
      title: "Scannen, sehen, genießen",
      subtitle: "Ihre Gäste brauchen nur ihr Smartphone – keine App, kein Konto.",
      items: [
        { icon: "📷", title: "Einfach scannen", text: "QR-Code mit der Handykamera scannen – kein Download, keine App, kein Konto nötig." },
        { icon: "🔎", title: "Alles auf einen Blick", text: "Gerichte, Preise, Beschreibungen und Allergene – übersichtlich und auf jedem Smartphone optimiert." },
        { icon: "🥜", title: "Allergene sehen", text: "Mit einem Tippen erkennen, welche Allergene ein Gericht enthält – ideal für Gäste mit Unverträglichkeiten." },
        { icon: "🆕", title: "Immer aktuell", text: "Preisänderungen oder ausverkaufte Gerichte erscheinen sofort – nie wieder eine veraltete Karte." },
      ],
    },
    plans: {
      eyebrow: "Tarife",
      title: "Starten Sie kostenlos – wachsen Sie, wenn Sie bereit sind",
      subtitle: "Im Free-Tarif bauen Sie Ihre digitale Karte mit QR-Code völlig kostenlos. Mehr Kategorien, Gerichte und Funktionen schalten Sie jederzeit mit einem Upgrade frei.",
      cta: "Tarife vergleichen",
    },
    cta: {
      title: "Bereit für Ihre digitale Speisekarte?",
      subtitle: "Erstellen Sie Ihr Restaurant kostenlos und teilen Sie Ihre Karte noch heute per QR-Code mit Ihren Gästen.",
      button: "Jetzt kostenlos starten",
    },
  },

  tierChooser: {
    eyebrow: "Tarife",
    title: "Wähle deinen Tarif",
    subtitle: "Starte kostenlos und wechsle jederzeit. Keine versteckten Kosten.",
    recommended: "⭐ Empfohlen",
    activePlan: "Aktiver Plan",
    currentPlan: "Aktueller Tarif:",
    loading: "Lade...",
    signInFirst: "Bitte anmelden",
    perMonth: "/Monat",
    tiers: {
      free: {
        name: "Free",
        label: "Kostenlos",
        price: "€0",
        description: "Perfekt zum Ausprobieren",
        features: ["Bis zu 7 Kategorien", "Digitale Speisekarte", "30 Gerichte Limit", "QR-Code Generator"],
        cta: "Kostenlos starten",
      },
      professional: {
        name: "Professional",
        label: "Beliebteste Wahl",
        price: "",
        description: "Unbegrenzte Möglichkeiten",
        features: ["Bis zu 50 Kategorien", "Bis zu 300 Gerichte", "QR-Code", "Premium Farben & Fonts", "Management-System", "Gerichtverfügbarkeitsanzeige", "Event-Kalender", "Inventar & Lieferanten-Übersicht"],
        cta: "Pro abonnieren",
      },
      business: {
        name: "Business",
        label: "Business",
        price: "€7.99",
        description: "Maximale Features & Support",
        features: ["Bis zu 20 Kategorien", "Bis zu 150 Gerichte", "Basis Templates", "QR-Code"],
        cta: "Business abonnieren",
      },
    },
  },

  signup: {
    badge: "Free · €0/Monat",
    title: "Dein Restaurant registrieren",
    subtitle: "Fülle alle relevanten Informationen aus, damit wir dein Restaurant anzeigen können.",
    loading: "Seite wird geladen",
    signInFirst: "Bitte Anmelden",
    submit: "FreeTier registrieren",
    // Preis unveraendert aus der alten Seite uebernommen — siehe Hinweis an Felix:
    // widerspricht der pricing-Seite, wo Professional "Coming Soon" ohne Preis ist.
    proUpgrade: "💳 Zu Pro upgrade (€14.99/Monat)",
    successAlert: "Restaurant erfolgreich registriert! \nHerzlichen Glückwunsch!",
    successInline: "Restaurant erfolgreich registriert!",
    saveError: "Fehler beim Speichern",
    alreadySubscribed: {
      title: "Du hast bereits ein Abo",
      text: "Du bist bereits registriert und hast ein gültiges Abo. Verwalte dein Restaurant im Profil.",
    },
    fields: {
      ownerName: "Name des Besitzers",
      restaurantName: "Restaurantname",
      email: "Email",
      postalCode: "Postleitzahl",
      city: "Stadt",
      street: "Straße",
      houseNumber: "Hausnummer",
      country: "Land",
      phone: "Telefonnummer",
      website: "Website",
      category: "Kategorie",
      description: "Beschreibung",
      categoryPlaceholder: "Bitte wählen",
      countryHint: "Bestimmt, unter welchem Land dein Restaurant geführt wird.",
      phoneHint: "Mit Ländervorwahl, z. B. +49…",
    },
    consent: {
      business: "Ich bestätige, dass ich als Unternehmer / Gewerbetreibender handle und diese Plattform ausschließlich im geschäftlichen Rahmen nutze.",
      businessStrong: "Unternehmer / Gewerbetreibender",
      withdrawalPrefix: "Nur für das Pro-Upgrade: Ich verlange ausdrücklich, dass die Leistung sofort beginnt, und nehme zur Kenntnis, dass ein etwaiges Widerrufsrecht mit vollständiger Vertragserfüllung erlischt. Es gelten die",
      terms: "AGB",
      and: "und die",
      withdrawal: "Widerrufsbelehrung",
      // Auf den deutschen Seiten leer — der Text IST hier das Original.
      bindingNote: "",
    },
    // Validierungsmeldungen — werden in das Zod-Schema gereicht.
    validation: {
      ownerName: "Ein Name ist erforderlich",
      restaurantName: "Ein Restaurantname ist erforderlich",
      email: "Ungültige Email",
      postalCode: "Postleitzahl erforderlich",
      city: "Stadt erforderlich",
      street: "Straße erforderlich",
      houseNumber: "Hausnummer erforderlich",
      country: "Land auswählen",
      phoneShort: "Die Telefonnummer ist zu kurz",
      phoneLong: "Die Telefonnummer ist zu lang",
      phoneInvalid: "Die Telefonnummer ist ungültig",
      website: "Die Website muss eine gültige URL sein",
      category: "Kategorie auswählen",
      description: "Maximal 2-3 Sätze (höchstens 300 Zeichen)",
    },
  },

  // Business-Registrierung (kostenpflichtig, fuehrt direkt in den Stripe-Checkout).
  signupCheckout: {
    badge: "Business · €7.99/Monat",
    title: "Dein Restaurant registrieren",
    subtitle: "Fülle alle relevanten Informationen aus, damit wir dein Restaurant auf unserer Plattform anzeigen können.",
    ownerName: "Name (Voller legaler Name)",
    restaurantName: "Name des Restaurants",
    shortDescription: "Kurze Beschreibung",
    // Im Original stand hier "Buisness" — Tippfehler auf einem Bezahl-Button.
    submit: "💳 Business-Abo aktivieren (€7.99/Monat)",
    checkoutError: "Fehler beim Checkout",
    checkoutStartError: "Fehler beim Starten des Checkout.",
    businessConsent: "Ich bestätige, dass ich als Unternehmer / Gewerbetreibender handle und diese Plattform ausschließlich im geschäftlichen Rahmen nutze.",
    withdrawalPrefix: "Ich verlange ausdrücklich, dass die Leistung sofort beginnt, und nehme zur Kenntnis, dass ein etwaiges Widerrufsrecht mit vollständiger Vertragserfüllung erlischt. Es gelten die",
    bindingNote: "",
  },

  about: {
    eyebrow: "Über uns",
    title: "Wer hinter WhatIsOnMyMenu steckt",
    intro: "WhatIsOnMyMenu ist kein Konzern und kein Startup mit Investorengeld. Die Plattform wird von einer Person entwickelt und betrieben — das heißt kurze Wege, direkte Antworten und keine Hotline-Warteschleife.",
    personTitle: "Felix Mayer",
    personRole: "Gründer & Entwickler",
    personText: "Ich entwickle WhatIsOnMyMenu von der Datenbank bis zur Speisekarte, die Ihre Gäste am Tisch sehen. Wenn Ihnen etwas fehlt oder etwas nicht funktioniert, landet Ihre Nachricht direkt bei mir.",
    contactTitle: "Kontakt",
    contactText: "Fragen zur Plattform, zu einem Tarif oder ein Problem mit Ihrer Speisekarte? Schreiben Sie einfach.",
    email: "support@whatisonmymenu.com",
    phone: "+49 1577 0426034",
    legalTitle: "Rechtliches",
    legalText: "Anbieterkennzeichnung, Anschrift und Verantwortlicher nach § 18 Abs. 2 MStV stehen im Impressum.",
    imprintLink: "Zum Impressum",
    privacyLink: "Zur Datenschutzerklärung",
  },

  // Eingeloggter Personal-Bereich (/staff). Sprache kommt aus User.language,
  // nicht aus der URL — siehe useUiLanguage.js.
  staff: {
    common: {
      loading: "Laden...",
      signInRequired: "Bitte einloggen",
      noAccess: "Kein Zugriff",
      noRestaurantId: "Keine Restaurant-ID",
      noRestaurantGiven: "Kein Restaurant angegeben.",
      proRequired: "Professional-Abo erforderlich",
      loadError: "Fehler beim Laden",
      saveError: "Fehler beim Speichern",
      deleteError: "Fehler beim Löschen",
      updateError: "Fehler beim Aktualisieren",
      back: "Zurück",
      save: "Speichern",
      saving: "Speichert...",
      backToDashboard: "Zurück zum Dashboard",
      upgradeNow: "Jetzt upgraden",
      refresh: "Aktualisieren",
      cancel: "Abbrechen",
      edit: "Bearbeiten",
      delete: "Löschen",
    },
    roles: {
      manager: "Manager",
      waiter: "Kellner",
      kitchen: "Küchenleitung",
      owner: "Owner",
    },
    dashboard: {
      welcome: "Willkommen zurück",
      noRestaurantAssigned: "Kein Restaurant zugewiesen",
      noRestaurantAssignedHint: "Dein Restaurant-Inhaber muss dich zuerst hinzufügen und genehmigen.",
      orders: "Bestellungen",
      availability: "Verfügbarkeit",
      calendar: "Aktionen & Events",
    },
    orders: {
      title: "Bestellungen",
      empty: "Keine offenen Bestellungen",
      autoRefresh: "Aktualisiert automatisch alle 15 Sekunden",
      total: "Gesamt",
      statusUpdated: "Status aktualisiert",
      completed: "Bestellung abgeschlossen",
      inProgress: "In Bearbeitung",
      done: "Erledigt",
      new: "Neu",
      accept: "Annehmen",
      markDone: "Erledigt ✓",
      note: "Anmerkung",
    },
    availability: {
      title: "Verfügbarkeit verwalten",
      available: "Verfügbar",
      soldOut: "Ausverkauft",
      proHint: "Die Verfügbarkeitsverwaltung ist ausschließlich für Professional-Abonnenten verfügbar.",
      allAvailable: "Alle verfügbar",
      allSoldOut: "Alle ausverkauft",
      noDishes: "Keine Gerichte im Menü gefunden.",
    },
    calendar: {
      title: "Aktionen & Events",
      empty: "Noch keine Einträge.",
      titleField: "Titel",
      description: "Beschreibung",
      from: "Von",
      to: "Bis",
      allDay: "Ganztägig",
      multiDay: "Mehrtägig (Zeitraum über mehrere Tage)",
      pickDish: "Gericht auswählen",
      typeAktion: "Aktion",
      typeEvent: "Event",
      typeTagesgericht: "Tagesgericht",
    },
  },

  footer: {
    tagline: "Die einfachste Art, professionelle digitale Speisekarten zu erstellen.",
    product: "Produkt",
    support: "Support",
    company: "Unternehmen",
    rights: "Alle Rechte vorbehalten.",
    privacy: "Datenschutz",
    terms: "AGB",
    withdrawal: "Widerruf",
    imprint: "Impressum",
  },
};

export default de;
