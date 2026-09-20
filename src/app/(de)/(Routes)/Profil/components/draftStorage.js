// Zwischenspeicher für ungespeicherte Editor-Änderungen (neue Kategorien/Gerichte
// und vorgemerkte Löschungen). Liegt bewusst nur im localStorage des Browsers:
// es ist ein Entwurf, kein Server-Zustand — erst "Speichern" schreibt in die DB.
//
// Hintergrund: der Editor hielt diese Änderungen ausschließlich im React-State,
// ein Tab-Wechsel oder versehentliches Neuladen hat sie also vernichtet.

const KEY_PREFIX = "wotm_menu_draft_";

// Ältere Entwürfe verwerfen — ein zwei Wochen alter Entwurf passt fast sicher
// nicht mehr zum inzwischen geänderten Menü und würde nur verwirren.
const MAX_AGE_MS = 7 * 24 * 60 * 60 * 1000;

const storageKey = (restaurantID) => `${KEY_PREFIX}${restaurantID}`;

/** Liest den Entwurf oder null. Wirft nie — jeder Zugriff kann blockiert sein. */
export function loadDraft(restaurantID) {
  if (typeof window === "undefined" || !restaurantID) return null;
  try {
    const raw = window.localStorage.getItem(storageKey(restaurantID));
    if (!raw) return null;

    const draft = JSON.parse(raw);
    if (!draft || typeof draft !== "object") return null;

    if (typeof draft.savedAt !== "number" || Date.now() - draft.savedAt > MAX_AGE_MS) {
      clearDraft(restaurantID);
      return null;
    }

    const asArray = (v) => (Array.isArray(v) ? v : []);
    const normalized = {
      components: asArray(draft.components),
      deletedDishes: asArray(draft.deletedDishes),
      deletedCategories: asArray(draft.deletedCategories),
      deletedCategoryGroups: asArray(draft.deletedCategoryGroups),
      savedAt: draft.savedAt,
    };

    const isEmpty =
      normalized.components.length === 0 &&
      normalized.deletedDishes.length === 0 &&
      normalized.deletedCategories.length === 0 &&
      normalized.deletedCategoryGroups.length === 0;

    return isEmpty ? null : normalized;
  } catch {
    return null;
  }
}

/** Schreibt den Entwurf; ein leerer Entwurf löscht den Eintrag. */
export function saveDraft(restaurantID, draft) {
  if (typeof window === "undefined" || !restaurantID) return;

  const isEmpty =
    (draft?.components?.length ?? 0) === 0 &&
    (draft?.deletedDishes?.length ?? 0) === 0 &&
    (draft?.deletedCategories?.length ?? 0) === 0 &&
    (draft?.deletedCategoryGroups?.length ?? 0) === 0;

  if (isEmpty) {
    clearDraft(restaurantID);
    return;
  }

  try {
    window.localStorage.setItem(
      storageKey(restaurantID),
      JSON.stringify({
        components: draft.components ?? [],
        deletedDishes: draft.deletedDishes ?? [],
        deletedCategories: draft.deletedCategories ?? [],
        deletedCategoryGroups: draft.deletedCategoryGroups ?? [],
        savedAt: Date.now(),
      }),
    );
  } catch {
    // Quota voll oder Speicherzugriff blockiert (privates Fenster) — der Editor
    // funktioniert ohne Entwurf weiter, deshalb hier bewusst still.
  }
}

export function clearDraft(restaurantID) {
  if (typeof window === "undefined" || !restaurantID) return;
  try {
    window.localStorage.removeItem(storageKey(restaurantID));
  } catch {
    /* siehe saveDraft */
  }
}

/** "vor 5 Minuten" o. ä. für den Wiederherstellungs-Hinweis. */
export function formatDraftAge(savedAt) {
  const diffMin = Math.round((Date.now() - savedAt) / 60000);
  if (diffMin < 1) return "gerade eben";
  if (diffMin < 60) return `vor ${diffMin} Minute${diffMin === 1 ? "" : "n"}`;
  const diffH = Math.round(diffMin / 60);
  if (diffH < 24) return `vor ${diffH} Stunde${diffH === 1 ? "" : "n"}`;
  const diffD = Math.round(diffH / 24);
  return `vor ${diffD} Tag${diffD === 1 ? "" : "en"}`;
}
