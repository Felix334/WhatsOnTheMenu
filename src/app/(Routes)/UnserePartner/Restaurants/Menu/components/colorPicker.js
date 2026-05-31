"use client";

import { Input } from "@/components/ui/input";
import { colors } from "./colorPalet";

/**
 * Dual color picker:
 * - allowPremiumColor=true  → <input type="color"> (Professional)
 * - allowPremiumColor=false → Tailwind-class palette (andere Tiers)
 *
 * Stored value:
 *   - hex string (e.g. "#ff6347") when color picker used
 *   - Tailwind class (e.g. "bg-red-500") when palette used
 *
 * Use bgColorStyle() + bgColorClass() helpers when rendering the stored value.
 */
export function ColorPicker({ value, onChange, allowPremiumColor }) {
  if (allowPremiumColor) {
    const safeHex = value?.startsWith("#") ? value : "#ffffff";
    return (
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-3">
          <Input
            type="color"
            value={safeHex}
            onChange={(e) => onChange(e.target.value)}
            className="h-10 w-16 cursor-pointer rounded-md border p-1"
          />
          <div
            className="flex-1 h-9 rounded-lg border border-gray-200 text-xs text-gray-400 flex items-center px-3"
            style={{ backgroundColor: value?.startsWith("#") ? value : undefined }}
          >
            {value?.startsWith("#") ? value : "Farbe wählen"}
          </div>
          {value && (
            <button
              type="button"
              onClick={() => onChange("")}
              className="text-xs text-gray-400 hover:text-gray-700 whitespace-nowrap"
            >
              ✕ Zurücksetzen
            </button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-2">
      {/* Vorschau aktuelle Farbe */}
      {value && (
        <div
          className={`h-8 rounded-lg border border-gray-200 ${value.startsWith("#") ? "" : value}`}
          style={value.startsWith("#") ? { backgroundColor: value } : {}}
        />
      )}

      <div className="flex flex-wrap gap-2 max-h-44 overflow-y-auto pr-1">
        {/* Keine Farbe */}
        <button
          type="button"
          title="Keine Farbe"
          onClick={() => onChange("")}
          className={`w-7 h-7 rounded-full border-2 bg-white flex items-center justify-center text-[10px] text-gray-400 transition-transform hover:scale-110 ${
            !value ? "border-gray-800 scale-110" : "border-gray-300"
          }`}
        >
          ✕
        </button>

        {colors.map((color) => (
          <button
            key={color.value}
            type="button"
            title={color.label}
            onClick={() => onChange(color.value)}
            className={`w-7 h-7 rounded-full transition-transform hover:scale-110 focus:outline-none ${color.value} ${
              value === color.value ? "ring-2 ring-offset-1 ring-gray-800 scale-110" : ""
            }`}
          />
        ))}
      </div>
    </div>
  );
}

/** Gibt className-Anteil zurück (nur für Tailwind-Klassen) */
export function bgColorClass(color) {
  if (!color || color.startsWith("#")) return "";
  return color;
}

/** Gibt style-Objekt zurück (nur für Hex-Werte) */
export function bgColorStyle(color) {
  if (!color || !color.startsWith("#")) return {};
  return { backgroundColor: color };
}
