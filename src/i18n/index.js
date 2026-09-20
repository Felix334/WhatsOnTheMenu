import de from "./de";
import en from "./en";
import { defaultLocale, isLocale } from "./config";

const dictionaries = { de, en };

/**
 * Woerterbuch einer Sprache. Faellt auf Deutsch zurueck, wenn die Sprache
 * nicht existiert — so rendert eine Seite im Zweifel deutschen Text statt
 * an undefined zu zerbrechen.
 *
 * Bewusst synchron: die Woerterbuecher sind klein und werden mitgebundlet,
 * damit die Seiten statisch vorgerendert werden koennen.
 */
export function getDictionary(locale) {
  return dictionaries[isLocale(locale) ? locale : defaultLocale];
}

export { defaultLocale, locales, prefixedLocales, localeNames, ogLocales, isLocale, localizedPath, buildAlternates } from "./config";
