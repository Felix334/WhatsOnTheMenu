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

const fonts = [
  { label: "Poppins", className: "font-poppins", style: { fontFamily: "Poppins" } },
  { label: "Roboto", className: "font-roboto", style: { fontFamily: "Roboto" } },
  { label: "Open Sans", className: "font-opensans", style: { fontFamily: "Open Sans" } },
  { label: "Lato", className: "font-lato", style: { fontFamily: "Lato" } },
  { label: "Montserrat", className: "font-montserrat", style: { fontFamily: "Montserrat" } },
  { label: "Inter", className: "font-inter", style: { fontFamily: "Inter" } },
  { label: "Merriweather", className: "font-merriweather", style: { fontFamily: "Merriweather" } },
  { label: "Playfair Display", className: "font-playfair", style: { fontFamily: "Playfair Display" } },
  { label: "Roboto Slab", className: "font-robotoslab", style: { fontFamily: "Roboto Slab" } },
  { label: "JetBrains Mono", className: "font-jetbrains", style: { fontFamily: "JetBrains Mono" } },
  { label: "Oxanium", className: "font-oxanium", style: { fontFamily: "Oxanium" } },
];

export default function FontSelector({ onFontChange }) {
  const [selectedFont, setSelectedFont] = React.useState(fonts[0].className);

  return (
    <div className="space-y-4 max-w-md">
      {/* Prefer moving these to app/layout.tsx */}
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      <link
        href="https://fonts.googleapis.com/css2?family=Roboto:wght@400;500;700&family=Open+Sans:wght@400;600;700&family=Lato:wght@400;700&family=Montserrat:wght@400;700&family=Poppins:wght@400;500;700&family=Inter:wght@400;500;700&family=Merriweather:wght@400;700&family=Playfair+Display:wght@400;700&family=Roboto+Slab:wght@400;700&family=JetBrains+Mono:wght@400;700&family=Oxanium:wght@400;700&display=swap"
        rel="stylesheet"
      />

      <Select
        value={selectedFont}
        onValueChange={(value) => {
          setSelectedFont(value);
          onFontChange?.(value);
        }}
      >
        <SelectTrigger>
          <SelectValue placeholder="Select a font" />
        </SelectTrigger>

        <SelectContent>
          <SelectGroup>
            <SelectLabel>Fonts</SelectLabel>

            {fonts.map((font) => (
              <SelectItem key={font.label} value={font.className}>
                <span className={font.className} style={font.style}>
                  {font.label}
                </span>
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>

      <div className="mt-4 p-4 border rounded bg-gray-50">
        <p className={`${selectedFont} text-lg`}>
          The quick brown fox jumps over the lazy dog
        </p>

        <h1 style={{ fontFamily: "Oxanium" }}>Oxanium</h1>
      </div>
    </div>
  );
}
