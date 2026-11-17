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

// label = Deutsch, en = Englisch (Tooltip in der Farbauswahl, je nach Oberflächensprache)
const colors = [
  // ✅ Standard Tailwind-Farben (direkt nutzbar)
  { label: "Weiß", en: "White", value: "bg-white" },
  { label: "Schwarz", en: "Black", value: "bg-black" },
  { label: "Silber", en: "Silver", value: "bg-slate-300" },
  { label: "Grau", en: "Grey", value: "bg-gray-500" },
  { label: "Kastanienbraun", en: "Maroon", value: "bg-maroon" },
  { label: "Rot", en: "Red", value: "bg-red-500" },
  { label: "Lila", en: "Purple", value: "bg-purple-500" },
  { label: "Fuchsia", en: "Fuchsia", value: "bg-fuchsia-500" },
  { label: "Grün", en: "Green", value: "bg-green-500" },
  { label: "Limette", en: "Lime", value: "bg-lime-500" },
  { label: "Olivengrün", en: "Olive", value: "bg-olive-700" },
  { label: "Gelb", en: "Yellow", value: "bg-yellow-500" },
  { label: "Marineblau", en: "Navy", value: "bg-[#001F3F]" },
  { label: "Blau", en: "Blue", value: "bg-blue-500" },
  { label: "Türkis", en: "Teal", value: "bg-teal-500" },
  { label: "Aqua", en: "Aqua", value: "bg-cyan-500" },
  { label: "Orange", en: "Orange", value: "bg-orange-500" },

  // ✅ HTML-Farbnamen → Tailwind/Hex
  { label: "Alice-Blau", en: "Alice blue", value: "bg-[#F0F8FF]" },
  { label: "Antikweiß", en: "Antique white", value: "bg-[#FAEBD7]" },
  { label: "Aquamarin", en: "Aquamarine", value: "bg-[#7FFFD4]" },
  { label: "Azurblau", en: "Azure", value: "bg-[#F0FFFF]" },
  { label: "Beige", en: "Beige", value: "bg-[#F5F5DC]" },
  { label: "Bisquit", en: "Bisque", value: "bg-[#FFE4C4]" },
  { label: "Braun", en: "Brown", value: "bg-[#A52A2A]" },
  { label: "Schokoladenbraun", en: "Chocolate", value: "bg-[#D2691E]" },
  { label: "Koralle", en: "Coral", value: "bg-[#FF7F50]" },
  { label: "Kornblumenblau", en: "Cornflower blue", value: "bg-[#6495ED]" },
  { label: "Karmesinrot", en: "Crimson", value: "bg-[#DC143C]" },
  { label: "Cyan", en: "Cyan", value: "bg-[#00FFFF]" },
  { label: "Dunkelblau", en: "Dark blue", value: "bg-[#00008B]" },
  { label: "Dunkel-Cyan", en: "Dark cyan", value: "bg-[#008B8B]" },
  { label: "Dunkelgold", en: "Dark goldenrod", value: "bg-[#B8860B]" },
  { label: "Dunkelgrau", en: "Dark grey", value: "bg-gray-700" },
  { label: "Dunkelgrün", en: "Dark green", value: "bg-[#006400]" },
  { label: "Dunkelorange", en: "Dark orange", value: "bg-[#FF8C00]" },
  { label: "Dunkelrot", en: "Dark red", value: "bg-[#8B0000]" },
  { label: "Tiefrosa", en: "Deep pink", value: "bg-[#FF1493]" },
  { label: "Tiefhimmelblau", en: "Deep sky blue", value: "bg-[#00BFFF]" },
  { label: "Dodgerblau", en: "Dodger blue", value: "bg-[#1E90FF]" },
  { label: "Ziegelrot", en: "Firebrick", value: "bg-[#B22222]" },
  { label: "Waldgrün", en: "Forest green", value: "bg-[#228B22]" },
  { label: "Gold", en: "Gold", value: "bg-[#FFD700]" },
  { label: "Knallpink", en: "Hot pink", value: "bg-[#FF69B4]" },
  { label: "Indigo", en: "Indigo", value: "bg-indigo-600" },
  { label: "Khaki", en: "Khaki", value: "bg-[#F0E68C]" },
  { label: "Lavendel", en: "Lavender", value: "bg-[#E6E6FA]" },
  { label: "Rasengrün", en: "Lawn green", value: "bg-[#7CFC00]" },
  { label: "Hellblau", en: "Light blue", value: "bg-blue-300" },
  { label: "Hellgrün", en: "Light green", value: "bg-green-300" },
  { label: "Hellhimmelblau", en: "Light sky blue", value: "bg-[#87CEFA]" },
  { label: "Limettengrün", en: "Lime green", value: "bg-[#32CD32]" },
  { label: "Mittelblau", en: "Medium blue", value: "bg-[#0000CD]" },
  { label: "Mittleres Seegrün", en: "Medium sea green", value: "bg-[#3CB371]" },
  { label: "Mittleres Violettrot", en: "Medium violet red", value: "bg-[#C71585]" },
  { label: "Rotorange", en: "Orange red", value: "bg-[#FF4500]" },
  { label: "Orchidee", en: "Orchid", value: "bg-[#DA70D6]" },
  { label: "Blassgrün", en: "Pale green", value: "bg-[#98FB98]" },
  { label: "Rosa", en: "Pink", value: "bg-pink-400" },
  { label: "Pflaume", en: "Plum", value: "bg-[#DDA0DD]" },
  { label: "Puderblau", en: "Powder blue", value: "bg-[#B0E0E6]" },
  { label: "Rebecca-Lila", en: "Rebecca purple", value: "bg-rebeccapurple" },
  { label: "Königsblau", en: "Royal blue", value: "bg-[#4169E1]" },
  { label: "Lachsfarben", en: "Salmon", value: "bg-[#FA8072]" },
  { label: "Seegrün", en: "Sea green", value: "bg-[#2E8B57]" },
  { label: "Himmelblau", en: "Sky blue", value: "bg-[#87CEEB]" },
  { label: "Schieferblau", en: "Slate blue", value: "bg-[#6A5ACD]" },
  { label: "Frühlingsgrün", en: "Spring green", value: "bg-[#00FF7F]" },
  { label: "Stahlblau", en: "Steel blue", value: "bg-[#4682B4]" },
  { label: "Tomatenrot", en: "Tomato", value: "bg-[#FF6347]" },
  { label: "Türkis", en: "Turquoise", value: "bg-[#40E0D0]" },
  { label: "Violett", en: "Violet", value: "bg-violet-500" },
];

export { colors, colors_german };
