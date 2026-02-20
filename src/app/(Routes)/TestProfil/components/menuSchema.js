import * as z from "zod";

const menuSchema = z.object({
  menu_col: z.string().min(1, "Menü-Kategorie erforderlich"),
  menu_name: z.string().min(1, "Menü-Name erforderlich"),
  items: z.array(
    z.object({
      name: z.string().min(2),
      price: z
        .string()
        .min(1)
        .regex(/^\d+([.,]\d{1,2})?$/, "Bitte eine gültige Zahl mit max. 2 Nachkommastellen eingeben"),
      description: z.string().optional(),
      image: z.string().optional(), // base64 oder URL
    })
  ),
});

export default menuSchema;
