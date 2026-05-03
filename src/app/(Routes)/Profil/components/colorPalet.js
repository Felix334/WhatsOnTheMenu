const colors_german = [
  "weiß", // white
  "schwarz", // black
  "silber", // silver
  "grau", // gray
  "kastanienbraun", // maroon
  "rot", // red
  "lila", // purple
  "fuchsia", // fuchsia
  "grün", // green
  "limette", // lime
  "oliv", // olive
  "gelb", // yellow
  "marineblau", // navy
  "blau", // blue
  "türkis", // teal
  "aqua", // aqua
  "orange", // orange
  "aliceblau", // aliceblue
  "antikweiß", // antiquewhite
  "aquamarin", // aquamarine
  "azurblau", // azure
  "beige", // beige
  "bisquit", // bisque
  "braun", // brown
  "schokoladenbraun", // chocolate
  "koralle", // coral
  "kornblumenblau", // cornflowerblue
  "karmesinrot", // crimson
  "cyan", // cyan
  "dunkelblau", // darkblue
  "dunkelcyan", // darkcyan
  "dunkelgolden", // darkgoldenrod
  "dunkelgrau", // darkgray
  "dunkelgrün", // darkgreen
  "dunkelorange", // darkorange
  "dunkelrot", // darkred
  "tiefrosa", // deeppink
  "tiefhimmelblau", // deepskyblue
  "dodgerblau", // dodgerblue
  "ziegelrot", // firebrick
  "waldgrün", // forestgreen
  "gold", // gold
  "knallpink", // hotpink
  "indigo", // indigo
  "khaki", // khaki
  "lavendel", // lavender
  "rasengrün", // lawngreen
  "hellblau", // lightblue
  "hellgrün", // lightgreen
  "hellhimmelblau", // lightskyblue
  "limettengrün", // limegreen
  "mittelblau", // mediumblue
  "mittleres seegrün", // mediumseagreen
  "mittleres violettrot", // mediumvioletred
  "rotorange", // orangered
  "orchidee", // orchid
  "blassgrün", // palegreen
  "rosa", // pink
  "pflaume", // plum
  "puderblau", // powderblue
  "rebecca-lila", // rebeccapurple
  "königsblau", // royalblue
  "lachsfarben", // salmon
  "seegrün", // seagreen
  "himmelblau", // skyblue
  "schieferblau", // slateblue
  "frühlingsgrün", // springgreen
  "stahlblau", // steelblue
  "tomatenrot", // tomato
  "türkis", // turquoise
  "violett", // violet
];

const colors = [
  // ✅ Standard Tailwind-Farben (direkt nutzbar)
  { label: "Weiß", value: "bg-white" },
  { label: "Schwarz", value: "bg-black" },
  { label: "Silber", value: "bg-slate-300" },
  { label: "Grau", value: "bg-gray-500" },
  { label: "Kastanienbraun", value: "bg-maroon" },
  { label: "Rot", value: "bg-red-500" },
  { label: "Lila", value: "bg-purple-500" },
  { label: "Fuchsia", value: "bg-fuchsia-500" },
  { label: "Grün", value: "bg-green-500" },
  { label: "Limette", value: "bg-lime-500" },
  { label: "Olivengrün", value: "bg-olive-700" },
  { label: "Gelb", value: "bg-yellow-500" },
  { label: "Marineblau", value: "bg-[#001F3F]" },
  { label: "Blau", value: "bg-blue-500" },
  { label: "Türkis", value: "bg-teal-500" },
  { label: "Aqua", value: "bg-cyan-500" },
  { label: "Orange", value: "bg-orange-500" },

  // ✅ HTML-Farbnamen → Tailwind/Hex
  { label: "Alice-Blau", value: "bg-[#F0F8FF]" },
  { label: "Antikweiß", value: "bg-[#FAEBD7]" },
  { label: "Aquamarin", value: "bg-[#7FFFD4]" },
  { label: "Azurblau", value: "bg-[#F0FFFF]" },
  { label: "Beige", value: "bg-[#F5F5DC]" },
  { label: "Bisquit", value: "bg-[#FFE4C4]" },
  { label: "Braun", value: "bg-[#A52A2A]" },
  { label: "Schokoladenbraun", value: "bg-[#D2691E]" },
  { label: "Koralle", value: "bg-[#FF7F50]" },
  { label: "Kornblumenblau", value: "bg-[#6495ED]" },
  { label: "Karmesinrot", value: "bg-[#DC143C]" },
  { label: "Cyan", value: "bg-[#00FFFF]" },
  { label: "Dunkelblau", value: "bg-[#00008B]" },
  { label: "Dunkel-Cyan", value: "bg-[#008B8B]" },
  { label: "Dunkelgold", value: "bg-[#B8860B]" },
  { label: "Dunkelgrau", value: "bg-gray-700" },
  { label: "Dunkelgrün", value: "bg-[#006400]" },
  { label: "Dunkelorange", value: "bg-[#FF8C00]" },
  { label: "Dunkelrot", value: "bg-[#8B0000]" },
  { label: "Tiefrosa", value: "bg-[#FF1493]" },
  { label: "Tiefhimmelblau", value: "bg-[#00BFFF]" },
  { label: "Dodgerblau", value: "bg-[#1E90FF]" },
  { label: "Ziegelrot", value: "bg-[#B22222]" },
  { label: "Waldgrün", value: "bg-[#228B22]" },
  { label: "Gold", value: "bg-[#FFD700]" },
  { label: "Knallpink", value: "bg-[#FF69B4]" },
  { label: "Indigo", value: "bg-indigo-600" },
  { label: "Khaki", value: "bg-[#F0E68C]" },
  { label: "Lavendel", value: "bg-[#E6E6FA]" },
  { label: "Rasengrün", value: "bg-[#7CFC00]" },
  { label: "Hellblau", value: "bg-blue-300" },
  { label: "Hellgrün", value: "bg-green-300" },
  { label: "Hellhimmelblau", value: "bg-[#87CEFA]" },
  { label: "Limettengrün", value: "bg-[#32CD32]" },
  { label: "Mittelblau", value: "bg-[#0000CD]" },
  { label: "Mittleres Seegrün", value: "bg-[#3CB371]" },
  { label: "Mittleres Violettrot", value: "bg-[#C71585]" },
  { label: "Rotorange", value: "bg-[#FF4500]" },
  { label: "Orchidee", value: "bg-[#DA70D6]" },
  { label: "Blassgrün", value: "bg-[#98FB98]" },
  { label: "Rosa", value: "bg-pink-400" },
  { label: "Pflaume", value: "bg-[#DDA0DD]" },
  { label: "Puderblau", value: "bg-[#B0E0E6]" },
  { label: "Rebecca-Lila", value: "bg-rebeccapurple" },
  { label: "Königsblau", value: "bg-[#4169E1]" },
  { label: "Lachsfarben", value: "bg-[#FA8072]" },
  { label: "Seegrün", value: "bg-[#2E8B57]" },
  { label: "Himmelblau", value: "bg-[#87CEEB]" },
  { label: "Schieferblau", value: "bg-[#6A5ACD]" },
  { label: "Frühlingsgrün", value: "bg-[#00FF7F]" },
  { label: "Stahlblau", value: "bg-[#4682B4]" },
  { label: "Tomatenrot", value: "bg-[#FF6347]" },
  { label: "Türkis", value: "bg-[#40E0D0]" },
  { label: "Violett", value: "bg-violet-500" },
];

export { colors, colors_german };
