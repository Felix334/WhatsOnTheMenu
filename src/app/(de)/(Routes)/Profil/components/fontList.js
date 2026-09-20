"use client";

import * as React from "react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export const FONTS = [
  { label: "Poppins", family: "Poppins" },
  { label: "Roboto", family: "Roboto" },
  { label: "Open Sans", family: "Open Sans" },
  { label: "Lato", family: "Lato" },
  { label: "Montserrat", family: "Montserrat" },
  { label: "Inter", family: "Inter" },
  { label: "Merriweather", family: "Merriweather" },
  { label: "Playfair Display", family: "Playfair Display" },
  { label: "Roboto Slab", family: "Roboto Slab" },
  { label: "JetBrains Mono", family: "JetBrains Mono" },
  { label: "Oxanium", family: "Oxanium" },
];

export const GOOGLE_FONTS_URL =
  "https://fonts.googleapis.com/css2?family=Roboto:wght@400;500;700&family=Open+Sans:wght@400;600;700&family=Lato:wght@400;700&family=Montserrat:wght@400;700&family=Poppins:wght@400;500;700&family=Inter:wght@400;500;700&family=Merriweather:wght@400;700&family=Playfair+Display:wght@400;700&family=Roboto+Slab:wght@400;700&family=JetBrains+Mono:wght@400;700&family=Oxanium:wght@400;700&display=swap";

export default function FontSelector({ onFontChange, value }) {
  const resolved = FONTS.find((f) => f.family === value)?.family ?? FONTS[0].family;
  const [selectedFont, setSelectedFont] = React.useState(resolved);

  React.useEffect(() => {
    const match = FONTS.find((f) => f.family === value);
    if (match) setSelectedFont(match.family);
  }, [value]);

  return (
    <div className="space-y-4 max-w-md">
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      <link href={GOOGLE_FONTS_URL} rel="stylesheet" />

      <Select
        value={selectedFont}
        onValueChange={(family) => {
          setSelectedFont(family);
          onFontChange?.(family);
        }}
      >
        <SelectTrigger>
          <SelectValue placeholder="Schriftart wählen" />
        </SelectTrigger>

        <SelectContent>
          <SelectGroup>
            <SelectLabel>Schriftarten</SelectLabel>
            {FONTS.map((font) => (
              <SelectItem key={font.family} value={font.family}>
                <span style={{ fontFamily: font.family }}>{font.label}</span>
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>

      <div className="mt-4 p-4 border rounded bg-gray-50">
        <p style={{ fontFamily: selectedFont }} className="text-lg">
          The quick brown fox jumps over the lazy dog
        </p>
        <p style={{ fontFamily: selectedFont }} className="text-sm text-gray-500 mt-1">
          Vorspeisen · Hauptgerichte · Desserts
        </p>
      </div>
    </div>
  );
}
