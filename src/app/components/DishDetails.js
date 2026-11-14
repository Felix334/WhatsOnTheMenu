import { ADDITIVES, additiveNumbers, getDishTagByKey } from "@/lib/dishInfo";

// Anzeige der Gericht-Details (Merkmale, Schärfe, Zusatzstoffe, Größen) —
// geteilt von Editor (Profil), Druckansicht und Gästeansicht (MenuClient),
// damit alle drei dieselbe Kennzeichnung zeigen.

const formatPrice = (value) => `${Number(value ?? 0).toFixed(2)}€`;

/** Merkmal-Chips + Schärfe, z. B. "🌱 Vegan  🌶️🌶️" */
export const DishTagBadges = ({ tags, spiceLevel, className = "" }) => {
  const known = (tags ?? []).map(getDishTagByKey).filter(Boolean);
  if (known.length === 0 && !(spiceLevel > 0)) return null;
  return (
    <div className={`flex flex-wrap items-center gap-1 mt-1 ${className}`}>
      {known.map((t) => (
        <span key={t.key} className="inline-flex items-center gap-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-[11px] font-medium px-2 py-0.5">
          <span aria-hidden>{t.icon}</span>
          {t.name}
        </span>
      ))}
      {spiceLevel > 0 && (
        <span className="text-xs" title={`Schärfe ${spiceLevel} von 3`} aria-label={`Schärfe ${spiceLevel} von 3`}>
          {"🌶️".repeat(spiceLevel)}
        </span>
      )}
    </div>
  );
};

/** Hochgestellte Zusatzstoff-Nummern hinter dem Gerichtnamen, z. B. "Cola ¹ ¹¹" */
export const AdditiveMarks = ({ additives }) => {
  const numbers = additiveNumbers(additives);
  if (numbers.length === 0) return null;
  return (
    <sup className="ml-0.5 text-[10px] font-medium opacity-70" title={numbers.map((n) => ADDITIVES.find((a) => a.id === n)?.name).join(", ")}>
      {numbers.join(",")}
    </sup>
  );
};

/** "ab 2.50€" bei Varianten, sonst der normale Preis */
export const dishPriceLabel = (dish) => {
  if (dish?.variants?.length) {
    const min = Math.min(...dish.variants.map((v) => Number(v.price)));
    return `ab ${formatPrice(min)}`;
  }
  return formatPrice(dish?.price);
};

/**
 * Liste der Größen mit Preis. `renderAction(variant)` hängt optional rechts
 * etwas an (Warenkorb-Knöpfe in der Gästeansicht).
 */
export const VariantPriceList = ({ variants, style, className = "", renderAction }) => {
  if (!variants?.length) return null;
  return (
    <ul className={`mt-1.5 space-y-1 ${className}`} style={style}>
      {variants.map((v) => (
        <li key={v.id ?? v.label} className="flex items-center justify-between gap-3 text-sm">
          <span className="opacity-80">{v.label}</span>
          <span className="flex items-center gap-2">
            <span className="font-mono whitespace-nowrap">{formatPrice(v.price)}</span>
            {renderAction?.(v)}
          </span>
        </li>
      ))}
    </ul>
  );
};

/** Legende nur der Zusatzstoffe, die in `dishes` vorkommen. null, wenn keine. */
export const AdditiveLegend = ({ dishes, className = "" }) => {
  const used = new Set((dishes ?? []).flatMap((d) => d.additives ?? []));
  const entries = ADDITIVES.filter((a) => used.has(a.key));
  if (entries.length === 0) return null;
  return (
    <div className={className}>
      <p className="font-semibold mb-1">Zusatzstoffe</p>
      <p>{entries.map((a) => `${a.id} = ${a.name}`).join(" · ")}</p>
    </div>
  );
};
