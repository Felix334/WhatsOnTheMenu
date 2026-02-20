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
  { label: "Weiß", value: "white" },
  { label: "Schwarz", value: "black" },
  { label: "Silber", value: "silver" },
  { label: "Grau", value: "gray" },
  { label: "Kastanienbraun", value: "maroon" },
  { label: "Rot", value: "red" },
  { label: "Lila", value: "purple" },
  { label: "Fuchsia", value: "fuchsia" },
  { label: "Grün", value: "green" },
  { label: "Limette", value: "lime" },
  { label: "Oliv", value: "olive" },
  { label: "Gelb", value: "yellow" },
  { label: "Marineblau", value: "navy" },
  { label: "Blau", value: "blue" },
  { label: "Türkis", value: "teal" },
  { label: "Aqua", value: "aqua" },
  { label: "Orange", value: "orange" },
  { label: "Alice-Blau", value: "aliceblue" },
  { label: "Antikweiß", value: "antiquewhite" },
  { label: "Aquamarin", value: "aquamarine" },
  { label: "Azurblau", value: "azure" },
  { label: "Beige", value: "beige" },
  { label: "Bisquit", value: "bisque" },
  { label: "Braun", value: "brown" },
  { label: "Schokoladenbraun", value: "chocolate" },
  { label: "Koralle", value: "coral" },
  { label: "Kornblumenblau", value: "cornflowerblue" },
  { label: "Karmesinrot", value: "crimson" },
  { label: "Cyan", value: "cyan" },
  { label: "Dunkelblau", value: "darkblue" },
  { label: "Dunkel-Cyan", value: "darkcyan" },
  { label: "Dunkelgold", value: "darkgoldenrod" },
  { label: "Dunkelgrau", value: "darkgray" },
  { label: "Dunkelgrün", value: "darkgreen" },
  { label: "Dunkelorange", value: "darkorange" },
  { label: "Dunkelrot", value: "darkred" },
  { label: "Tiefrosa", value: "deeppink" },
  { label: "Tiefhimmelblau", value: "deepskyblue" },
  { label: "Dodgerblau", value: "dodgerblue" },
  { label: "Ziegelrot", value: "firebrick" },
  { label: "Waldgrün", value: "forestgreen" },
  { label: "Gold", value: "gold" },
  { label: "Knallpink", value: "hotpink" },
  { label: "Indigo", value: "indigo" },
  { label: "Khaki", value: "khaki" },
  { label: "Lavendel", value: "lavender" },
  { label: "Rasengrün", value: "lawngreen" },
  { label: "Hellblau", value: "lightblue" },
  { label: "Hellgrün", value: "lightgreen" },
  { label: "Hellhimmelblau", value: "lightskyblue" },
  { label: "Limettengrün", value: "limegreen" },
  { label: "Mittelblau", value: "mediumblue" },
  { label: "Mittleres Seegrün", value: "mediumseagreen" },
  { label: "Mittleres Violettrot", value: "mediumvioletred" },
  { label: "Rotorange", value: "orangered" },
  { label: "Orchidee", value: "orchid" },
  { label: "Blassgrün", value: "palegreen" },
  { label: "Rosa", value: "pink" },
  { label: "Pflaume", value: "plum" },
  { label: "Puderblau", value: "powderblue" },
  { label: "Rebecca-Lila", value: "rebeccapurple" },
  { label: "Königsblau", value: "royalblue" },
  { label: "Lachsfarben", value: "salmon" },
  { label: "Seegrün", value: "seagreen" },
  { label: "Himmelblau", value: "skyblue" },
  { label: "Schieferblau", value: "slateblue" },
  { label: "Frühlingsgrün", value: "springgreen" },
  { label: "Stahlblau", value: "steelblue" },
  { label: "Tomatenrot", value: "tomato" },
  { label: "Türkis", value: "turquoise" },
  { label: "Violett", value: "violet" },
];

export { colors, colors_german };
