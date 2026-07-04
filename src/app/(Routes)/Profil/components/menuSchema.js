import * as z from "zod";

const menuSchema = z.object({
  menu_col: z.string().min(1, "Menü-Kategorie erforderlich"),
  menu_name: z.string().min(1, "Menü-Name erforderlich"),
  items: z.array(
    z.object({
      name: z.string().min(2),
      price: z.string().regex(/^\d+(\.\d{1,2})?$/, "Preis muss eine gültige Dezimalzahl mit bis zu 2 Nachkommastellen sein"),

      description: z.string().optional(),
    })
  ),
});

const itemSchema = z.object({
  name: z.string().min(1, "Name erforderlich"),
  description: z.string().min(5, "Beschreibung erforderlich"),
  price: z.string().regex(/^\d+(\.\d{1,2})?$/, "Preis muss eine gültige Dezimalzahl mit bis zu 2 Nachkommastellen sein"),
});

export { menuSchema, itemSchema };
