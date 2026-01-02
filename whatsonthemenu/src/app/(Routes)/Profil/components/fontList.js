"use client"

import * as React from "react"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

const fonts = [
  { label: "Roboto", className: "font-roboto" },
  { label: "Open Sans", className: "font-opensans" },
  { label: "Lato", className: "font-lato" },
  { label: "Montserrat", className: "font-montserrat" },
  { label: "Poppins", className: "font-poppins" },
  { label: "Inter", className: "font-inter" },
  { label: "Merriweather", className: "font-merriweather" },
  { label: "Playfair Display", className: "font-playfair" },
  { label: "Roboto Slab", className: "font-robotoslab" },
  { label: "JetBrains Mono", className: "font-jetbrains" },
]

export default function FontSelector({ onFontChange }) {
  const [selectedFont, setSelectedFont] = React.useState(fonts[0].className)

  return (
    <div className="space-y-4 max-w-md">
      {/* Font Select Dropdown */}
      <Select
        value={selectedFont}
        onValueChange={(value) => {
          setSelectedFont(value);
          if (onFontChange) onFontChange(value);
        }}
      >
        <SelectTrigger>
          <SelectValue placeholder="Select a font" />
        </SelectTrigger>

        <SelectContent>
          <SelectGroup>
            <SelectLabel>Fonts</SelectLabel>
            {fonts.map((font) => (
              <SelectItem key={font.className} value={font.className}>
                <span className={font.className}>{font.label}</span>
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>

      {/* Preview Text */}
      <div className="mt-4 p-4 border rounded bg-gray-50">
        <p className={`${selectedFont} text-lg`}>The quick brown fox jumps over the lazy dog</p>
      </div>
    </div>
  )
}
