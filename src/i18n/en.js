// English copy for the public pages.
//
// Deliberately NOT a literal translation of de.js. The German wording is built
// around terms Germans type into Google ("Speisekarte erstellen"); the English
// wording is built around what English speakers actually search for:
// "QR code menu", "digital menu for restaurants", "restaurant menu maker".
// Translating word for word would miss those phrases entirely.

const en = {
  meta: {
    home: {
      title: "QR Code Menu Maker | Free Digital Menus for Restaurants",
      description: "Create a free digital menu for your restaurant and share it with a QR code. No app, no software to install — build and update your menu right in the browser.",
      ogTitle: "Create a QR Code Menu for Your Restaurant",
      ogDescription: "Build a digital menu your guests open by scanning a QR code.",
    },
    pricing: {
      title: "Pricing & Plans | WhatIsOnMyMenu",
      description: "Every plan at a glance: a free tier, Business at €7.99/month. QR code menus for restaurants, cancel any month.",
    },
    howItWorks: {
      title: "How It Works | Build a QR Code Menu in Minutes",
      description: "Three steps to a digital menu: create an account, add your dishes, print the QR code. Nothing to install.",
    },
    team: {
      title: "Our Team | WhatIsOnMyMenu",
      description: "The people behind WhatIsOnMyMenu — digital menus for restaurants.",
    },
  },

  // Language suggestion banner. These strings are shown in the TARGET language
  // — a visitor who can't read the current one still needs to understand the
  // offer. So "banner" from en.js is what appears on the German page.
  banner: {
    message: "This page is also available in English.",
    action: "View in English",
    dismiss: "Dismiss",
  },

  // Labels for the shared link components (renderDynamicLinks.js).
  links: {
    alreadyActive: "Already active",
    subscribe: "Choose this plan",
    howItWorks: "How it works",
    adminConsole: "Admin console",
    checkNow: "Enquire now",
    bookDemo: "Book a demo",
    registerFree: "Sign up free",
    home: "Home",
    profile: "Profile",
    logout: "Log out",
  },

  auth: {
    accountNotLinked: "This email is already linked to a different sign-in method.",
    signInFailed: "Sign-in was cancelled or failed. Please try again.",
  },

  nav: {
    features: "Features",
    howItWorks: "How it works",
    pricing: "Pricing",
    login: "Sign in",
    profile: "Profile",
    adminConsole: "Admin console",
    openMenu: "Open menu",
    language: "Language",
  },

  home: {
    hero: {
      titleBefore: "Build a QR code menu in ",
      titleHighlight: "just a few minutes",
      titleAfter: " — no AI required",
      subtitle: "Create a professional digital menu for your restaurant. Guests scan a QR code at the table and see your dishes instantly — update prices any time, no reprinting.",
      ctaPrimary: "Start for free",
      ctaSecondary: "Sign in",
      bullet1: "Free plan available",
      bullet2: "Clean, readable layout for your guests",
      phoneAlt: "Digital restaurant menu on a smartphone",
    },
    responsive: {
      title: "Looks right on every device",
      subtitle: "Built for phone, tablet and desktop — no compromises on design.",
      laptopAlt: "Digital menu on a laptop",
      phoneAlt: "Digital menu on a phone",
    },
    features: {
      title: "Everything you need",
      subtitle: "From building your first menu to putting it on the table — every tool in one place.",
      items: [
        {
          icon: "🎨",
          title: "A genuinely simple editor",
          description: "Create, edit and update your menu without any technical knowledge. If you can fill in a form, you can run your menu.",
        },
        {
          icon: "📱",
          title: "QR code included",
          description: "Every menu gets its own QR code automatically. Print it, put it on the table, and guests see your menu the moment they scan.",
        },
        {
          icon: "🌍",
          title: "Premium features",
          description: "Extra tools for a more modern, more interactive experience at the table.",
        },
        {
          icon: "⚡",
          title: "Sold-out updates",
          description: "Mark a dish unavailable and guests see it straight away — no more asking the waiter what's still on.",
        },
        {
          icon: "📊",
          title: "Staff management",
          description: "Split work across your team. Every member gets their own role and only the permissions that role needs.",
        },
        {
          icon: "🎯",
          title: "Designs you can adapt",
          description: "Professional templates that you can match to your restaurant's own branding.",
        },
      ],
    },
    cta: {
      title: "Ready to put your menu on a QR code?",
      subtitle: "Build your digital menu today — quick, straightforward, and no strings attached.",
      primary: "Get started free",
      secondary: "See pricing",
    },
    pricing: {
      title: "Straightforward pricing",
      subtitle: "Pick the plan that fits your restaurant",
      perMonth: "/month",
      free: "Free",
      comingSoon: "Coming soon",
      starter: {
        name: "Starter",
        features: ["Up to 10 categories", "Up to 80 dishes", "Basic templates", "QR code"],
      },
      business: {
        name: "Business",
        features: ["Up to 25 categories", "Up to 150 dishes", "Basic templates", "QR code", "Event calendar (30 days)"],
      },
      professional: {
        name: "Professional",
        features: ["Up to 50 categories", "Up to 300 dishes", "Premium templates", "QR code", "Staff management", "Sold-out indicators", "Event calendar (365 days)", "Inventory & supplier overview"],
      },
    },
  },

  // Pricing overview for the translated pages.
  //
  // The German /pricing page carries the actual checkout, including a consent
  // statement written under German law (Widerrufsbelehrung, AGB). That text is
  // deliberately NOT translated — an English rendering of it would carry a
  // different legal meaning. The translated page therefore presents the plans
  // and hands over to the German checkout for the contract itself.
  pricingOverview: {
    title: "Pricing",
    subtitle: "Start free and upgrade when your menu grows. Cancel any month.",
    checkoutNote: "Checkout and the subscription terms are handled in German — WhatIsOnMyMenu is operated from Germany and the contract is governed by German law.",
    cta: "Continue to checkout",
    freeCta: "Start for free",
  },

  howItWorks: {
    hero: {
      badge: "How it works",
      titleLine1: "Your digital menu —",
      titleLine2: "ready in a few minutes",
      subtitle: "WhatIsOnMyMenu gives your restaurant a digital menu that guests open by scanning a QR code at the table. No app to download, no reprinting, always up to date.",
      ctaPrimary: "Start for free",
      ctaSecondary: "See all plans",
    },
    steps: {
      eyebrow: "For restaurants",
      title: "Four steps to your own menu",
      subtitle: "From signing up to a QR code on the table — quicker than you'd expect.",
      items: [
        { number: "1", icon: "👤", title: "Sign up free", text: "Sign in with your Google account in seconds — no credit card needed. You start on the free plan straight away." },
        { number: "2", icon: "🍽️", title: "Add your restaurant & menu", text: "Enter your restaurant details and build your menu: categories, dishes, prices, descriptions and allergens." },
        { number: "3", icon: "🎨", title: "Make it yours", text: "Pick colours, fonts and a hero design that suit your restaurant, so the menu looks like your brand rather than a template." },
        { number: "4", icon: "📲", title: "Share the QR code", text: "Generate your QR code, print it and put it on the tables. Guests scan it and your menu opens instantly." },
      ],
    },
    features: {
      eyebrow: "Features",
      title: "Everything your menu needs",
      subtitle: "Design, allergens, staff roles and orders — all in one place.",
      items: [
        { icon: "📋", title: "Digital menu", text: "Organise what you serve into groups, categories and dishes, each with prices and descriptions." },
        { icon: "🔳", title: "QR code generator", text: "Every restaurant gets its own QR code. Print it once — edits go live immediately, so it never goes stale." },
        { icon: "🎨", title: "Your own design", text: "Background colours, fonts and per-category accents. The Professional plan adds premium colours and fonts." },
        { icon: "⚠️", title: "Allergens & ingredients", text: "Record allergens per dish so guests can see what's in their food at a glance — clear and compliant." },
        { icon: "🟢", title: "Live availability", text: "Mark a dish sold out with one click and guests see it right away." },
        { icon: "⭐", title: "Ratings", text: "Guests can rate dishes. The average score and number of ratings show up on the menu itself." },
        { icon: "👥", title: "Staff management", text: "Invite your team and assign roles (manager, front of house, kitchen) with the permissions each role needs — on the Professional plan." },
        { icon: "🧾", title: "Table orders", text: "Take orders per table and track them from open to confirmed to done." },
        { icon: "📍", title: "Multiple locations", text: "Manage addresses, opening hours and booking contacts — including restaurants with several sites." },
      ],
    },
    guests: {
      eyebrow: "For your guests",
      title: "Scan, browse, enjoy",
      subtitle: "All your guests need is their phone — no app, no account.",
      items: [
        { icon: "📷", title: "Just scan", text: "Point the phone camera at the QR code — no download, no app, no account required." },
        { icon: "🔎", title: "Everything at a glance", text: "Dishes, prices, descriptions and allergens, laid out to read easily on any phone." },
        { icon: "🥜", title: "See allergens", text: "One tap shows which allergens a dish contains — useful for guests with intolerances." },
        { icon: "🆕", title: "Always current", text: "Price changes and sold-out dishes appear straight away. No more out-of-date menus." },
      ],
    },
    plans: {
      eyebrow: "Plans",
      title: "Start free, upgrade when you're ready",
      subtitle: "The free plan gives you a full digital menu with a QR code at no cost. Unlock more categories, dishes and features whenever you need them.",
      cta: "Compare plans",
    },
    cta: {
      title: "Ready to put your menu on a QR code?",
      subtitle: "Set up your restaurant for free and share your menu with guests today.",
      button: "Start for free",
    },
  },

  tierChooser: {
    eyebrow: "Plans",
    title: "Choose your plan",
    subtitle: "Start free and switch whenever you like. No hidden costs.",
    recommended: "⭐ Recommended",
    activePlan: "Current plan",
    currentPlan: "Your plan:",
    loading: "Loading…",
    signInFirst: "Please sign in first",
    perMonth: "/month",
    tiers: {
      free: {
        name: "Free",
        label: "Free",
        price: "€0",
        description: "Ideal for trying things out",
        features: ["Up to 7 categories", "Digital menu", "30 dish limit", "QR code generator"],
        cta: "Start for free",
      },
      professional: {
        name: "Professional",
        label: "Most popular",
        price: "",
        description: "Everything, without limits",
        features: ["Up to 50 categories", "Up to 300 dishes", "QR code", "Premium colours & fonts", "Staff management", "Sold-out indicators", "Event calendar", "Inventory & supplier overview"],
        cta: "Subscribe to Pro",
      },
      business: {
        name: "Business",
        label: "Business",
        price: "€7.99",
        description: "Maximum features & support",
        features: ["Up to 20 categories", "Up to 150 dishes", "Basic templates", "QR code"],
        cta: "Subscribe to Business",
      },
    },
  },

  signup: {
    badge: "Free · €0/month",
    title: "Register your restaurant",
    subtitle: "Fill in the details below so we can display your restaurant.",
    loading: "Loading…",
    signInFirst: "Please sign in first",
    submit: "Create free account",
    proUpgrade: "💳 Upgrade to Pro (€14.99/month)",
    successAlert: "Restaurant registered successfully!",
    successInline: "Restaurant registered successfully!",
    saveError: "Could not save your restaurant",
    alreadySubscribed: {
      title: "You already have a plan",
      text: "You're registered and your subscription is active. Manage your restaurant from your profile.",
    },
    fields: {
      ownerName: "Owner's name",
      restaurantName: "Restaurant name",
      email: "Email",
      postalCode: "Postcode",
      city: "City",
      street: "Street",
      houseNumber: "House number",
      country: "Country",
      phone: "Phone number",
      website: "Website",
      category: "Category",
      description: "Description",
      categoryPlaceholder: "Please choose",
      countryHint: "Determines which country your restaurant is listed under.",
      phoneHint: "Include the country code, e.g. +33…",
    },
    consent: {
      business: "I confirm that I am acting as a business and will use this platform for commercial purposes only.",
      businessStrong: "acting as a business",
      withdrawalPrefix: "For the Pro upgrade only: I expressly request that the service begins immediately and acknowledge that any right of withdrawal expires once the contract has been fully performed. This is subject to the",
      terms: "Terms",
      and: "and the",
      withdrawal: "withdrawal policy",
      // Wichtig: die verlinkten Dokumente sind deutschsprachig und unterliegen
      // deutschem Recht. Die englische Fassung dient nur dem Verstaendnis.
      bindingNote: "The linked documents are in German and governed by German law; the German wording is legally binding.",
    },
    // Validation messages — passed into the Zod schema.
    validation: {
      ownerName: "Please enter a name",
      restaurantName: "Please enter a restaurant name",
      email: "Invalid email address",
      postalCode: "Postcode is required",
      city: "City is required",
      street: "Street is required",
      houseNumber: "House number is required",
      country: "Please choose a country",
      phoneShort: "Phone number is too short",
      phoneLong: "Phone number is too long",
      phoneInvalid: "Phone number is not valid",
      website: "Website must be a valid URL",
      category: "Please choose a category",
      description: "Two to three sentences at most (300 characters)",
    },
  },

  // Business registration (paid, goes straight into the Stripe checkout).
  signupCheckout: {
    badge: "Business · €7.99/month",
    title: "Register your restaurant",
    subtitle: "Fill in the details below so we can list your restaurant on the platform.",
    ownerName: "Name (full legal name)",
    restaurantName: "Restaurant name",
    shortDescription: "Short description",
    submit: "💳 Activate Business plan (€7.99/month)",
    checkoutError: "Checkout failed",
    checkoutStartError: "Could not start the checkout.",
    businessConsent: "I confirm that I am acting as a business and will use this platform for commercial purposes only.",
    withdrawalPrefix: "I expressly request that the service begins immediately and acknowledge that any right of withdrawal expires once the contract has been fully performed. This is subject to the",
    bindingNote: "The linked documents are in German and governed by German law; the German wording is legally binding.",
  },

  about: {
    eyebrow: "About us",
    title: "The people behind WhatIsOnMyMenu",
    intro: "WhatIsOnMyMenu isn't a corporation or a venture-funded startup. One person builds and runs it — which means short paths, direct answers and no support queue.",
    personTitle: "Felix Mayer",
    personRole: "Founder & developer",
    personText: "I build WhatIsOnMyMenu from the database all the way to the menu your guests see at the table. If something is missing or broken, your message reaches me directly.",
    contactTitle: "Contact",
    contactText: "Questions about the platform, a plan, or trouble with your menu? Just get in touch.",
    email: "support@whatisonmymenu.com",
    phone: "+49 1577 0426034",
    legalTitle: "Legal",
    legalText: "Provider details, postal address and the person responsible under § 18(2) MStV are listed in the imprint (in German).",
    imprintLink: "View imprint",
    privacyLink: "View privacy policy",
  },

  // Signed-in staff area (/staff). The language comes from User.language,
  // not from the URL — see useUiLanguage.js.
  //
  // Wording kept deliberately short and plain: this runs on a phone, in a
  // kitchen, often read by someone who is not a native speaker.
  staff: {
    common: {
      loading: "Loading…",
      signInRequired: "Please sign in",
      noAccess: "No access",
      noRestaurantId: "No restaurant ID",
      noRestaurantGiven: "No restaurant selected.",
      proRequired: "Professional plan required",
      loadError: "Could not load",
      saveError: "Could not save",
      deleteError: "Could not delete",
      updateError: "Could not update",
      back: "Back",
      save: "Save",
      saving: "Saving…",
      backToDashboard: "Back to dashboard",
      upgradeNow: "Upgrade now",
      refresh: "Refresh",
      cancel: "Cancel",
      edit: "Edit",
      delete: "Delete",
    },
    roles: {
      manager: "Manager",
      waiter: "Waiter",
      kitchen: "Kitchen",
      owner: "Owner",
    },
    dashboard: {
      welcome: "Welcome back",
      noRestaurantAssigned: "No restaurant assigned",
      noRestaurantAssignedHint: "The restaurant owner needs to add and approve you first.",
      orders: "Orders",
      availability: "Availability",
      calendar: "Offers & events",
    },
    orders: {
      title: "Orders",
      empty: "No open orders",
      autoRefresh: "Refreshes automatically every 15 seconds",
      total: "Total",
      statusUpdated: "Status updated",
      completed: "Order completed",
      inProgress: "In progress",
      done: "Done",
      new: "New",
      accept: "Accept",
      markDone: "Done ✓",
      note: "Note",
    },
    availability: {
      title: "Manage availability",
      available: "Available",
      soldOut: "Sold out",
      proHint: "Managing availability is available on the Professional plan only.",
      allAvailable: "All available",
      allSoldOut: "All sold out",
      noDishes: "No dishes found on the menu.",
    },
    calendar: {
      title: "Offers & events",
      empty: "Nothing here yet.",
      titleField: "Title",
      description: "Description",
      from: "From",
      to: "To",
      allDay: "All day",
      multiDay: "Multi-day (spanning several days)",
      pickDish: "Choose a dish",
      typeAktion: "Offer",
      typeEvent: "Event",
      typeTagesgericht: "Dish of the day",
    },
  },

  footer: {
    tagline: "The simplest way to build a professional digital menu.",
    product: "Product",
    support: "Support",
    company: "Company",
    rights: "All rights reserved.",
    // Die Rechtsseiten bleiben bewusst deutsch (deutsches Recht) — die Labels
    // werden uebersetzt, damit die Navigation lesbar bleibt, die Dokumente
    // dahinter nicht.
    privacy: "Privacy",
    terms: "Terms",
    withdrawal: "Right of withdrawal",
    imprint: "Legal notice",
  },
};

export default en;
