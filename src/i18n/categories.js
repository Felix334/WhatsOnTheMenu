// Restaurant-Kategorien.
//
// Bewusst NICHT nach de.js/en.js aufgeteilt wie der restliche Text: der `value`
// landet in der Datenbank und darf sich nie aendern, die Labels schon. Lagen
// Wert und Label in getrennten Dateien, waere bei 67 Eintraegen ein Verrutschen
// nur eine Frage der Zeit — und ein falsch zugeordneter Wert faellt niemandem
// auf, weil beide Listen fuer sich plausibel aussehen.
//
// Neue Sprache: einen weiteren Schluessel pro Zeile ergaenzen.
// Neue Kategorie: unten anhaengen, `value` klein und stabil halten.

export const RESTAURANT_CATEGORIES = [
  { value: "italienisch", de: "Italienisch", en: "Italian" },
  { value: "deutsch", de: "Deutsch", en: "German" },
  { value: "franzoesisch", de: "Französisch", en: "French" },
  { value: "spanisch", de: "Spanisch / Tapas", en: "Spanish / Tapas" },
  { value: "griechisch", de: "Griechisch", en: "Greek" },
  { value: "tuerkisch", de: "Türkisch", en: "Turkish" },
  { value: "arabisch", de: "Arabisch", en: "Arabic" },
  { value: "libanesisch", de: "Libanesisch", en: "Lebanese" },
  { value: "chinesisch", de: "Chinesisch", en: "Chinese" },
  { value: "japanisch", de: "Japanisch", en: "Japanese" },
  { value: "koreanisch", de: "Koreanisch", en: "Korean" },
  { value: "thailaendisch", de: "Thailändisch", en: "Thai" },
  { value: "vietnamesisch", de: "Vietnamesisch", en: "Vietnamese" },
  { value: "indisch", de: "Indisch", en: "Indian" },
  { value: "pakistanisch", de: "Pakistanisch", en: "Pakistani" },
  { value: "mexikanisch", de: "Mexikanisch", en: "Mexican" },
  { value: "brasilianisch", de: "Brasilianisch", en: "Brazilian" },
  { value: "argentinisch", de: "Argentinisch", en: "Argentinian" },
  { value: "peruanisch", de: "Peruanisch", en: "Peruvian" },
  { value: "aethiopisch", de: "Äthiopisch", en: "Ethiopian" },
  { value: "burger", de: "Burger", en: "Burgers" },
  { value: "hotdog", de: "Hot Dogs", en: "Hot Dogs" },
  { value: "doener", de: "Döner / Kebab", en: "Döner / Kebab" },
  { value: "shawarma", de: "Shawarma", en: "Shawarma" },
  { value: "fastfood", de: "Fast Food", en: "Fast Food" },
  { value: "foodtruck", de: "Food Truck", en: "Food Truck" },
  { value: "streetfood", de: "Street Food", en: "Street Food" },
  { value: "pizza", de: "Pizza", en: "Pizza" },
  { value: "pasta", de: "Pasta", en: "Pasta" },
  { value: "steakhouse", de: "Steakhouse", en: "Steakhouse" },
  { value: "bbq", de: "BBQ / Grill", en: "BBQ / Grill" },
  { value: "fisch", de: "Fisch / Seafood", en: "Fish / Seafood" },
  { value: "ramen", de: "Ramen", en: "Ramen" },
  { value: "sushi", de: "Sushi", en: "Sushi" },
  { value: "tapas", de: "Tapas", en: "Tapas" },
  { value: "fondue", de: "Fondue / Raclette", en: "Fondue / Raclette" },
  { value: "hotpot", de: "Hot Pot", en: "Hot Pot" },
  { value: "cafe", de: "Café", en: "Café" },
  { value: "baeckerei", de: "Bäckerei", en: "Bakery" },
  { value: "konditorei", de: "Konditorei", en: "Patisserie" },
  { value: "eiscafe", de: "Eiscafé", en: "Ice Cream Parlour" },
  { value: "bubbletea", de: "Bubble Tea", en: "Bubble Tea" },
  { value: "dessertbar", de: "Dessert Bar", en: "Dessert Bar" },
  { value: "waffeln", de: "Waffeln / Crêpes", en: "Waffles / Crêpes" },
  { value: "vegan", de: "Vegan", en: "Vegan" },
  { value: "vegetarisch", de: "Vegetarisch", en: "Vegetarian" },
  { value: "bio", de: "Bio / Organic", en: "Organic" },
  { value: "glutenfrei", de: "Glutenfrei", en: "Gluten-free" },
  { value: "lowcarb", de: "Low Carb", en: "Low Carb" },
  { value: "halal", de: "Halal", en: "Halal" },
  { value: "koscher", de: "Koscher", en: "Kosher" },
  { value: "bar", de: "Bar", en: "Bar" },
  { value: "cocktailbar", de: "Cocktailbar", en: "Cocktail Bar" },
  { value: "pub", de: "Pub", en: "Pub" },
  { value: "biergarten", de: "Biergarten", en: "Beer Garden" },
  { value: "weinstube", de: "Weinstube", en: "Wine Bar" },
  { value: "shishabar", de: "Shisha Bar", en: "Shisha Bar" },
  { value: "fine_dining", de: "Fine Dining", en: "Fine Dining" },
  { value: "all_you_can_eat", de: "All You Can Eat", en: "All You Can Eat" },
  { value: "buffet", de: "Buffet", en: "Buffet" },
  { value: "familienrestaurant", de: "Familienrestaurant", en: "Family Restaurant" },
  // Wert historisch bedingt "im_angebot" — nicht aendern, steht so in der DB.
  { value: "im_angebot", de: "Imbiss", en: "Snack Bar" },
  { value: "lieferservice", de: "Lieferservice", en: "Delivery" },
  { value: "takeaway", de: "Take Away", en: "Take Away" },
  { value: "ghostkitchen", de: "Ghost Kitchen", en: "Ghost Kitchen" },
  { value: "pop_up", de: "Pop-Up Restaurant", en: "Pop-Up Restaurant" },
  { value: "Sonstiges", de: "Sonstiges", en: "Other" },
];

/** Kategorien als {value, label} in der gewuenschten Sprache, alphabetisch. */
export function getCategoryOptions(locale = "de") {
  return RESTAURANT_CATEGORIES.map((c) => ({
    value: c.value,
    label: c[locale] || c.de,
  })).sort((a, b) => a.label.localeCompare(b.label, locale));
}
