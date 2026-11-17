import * as z from "zod";

// Schema des "Hinzufügen"-Editors. Als Funktion, damit die Meldungen in der
// Oberflächensprache erscheinen — m = dashboard.menuSchema aus dem Wörterbuch.
const createMenuSchema = (m) =>
  z.object({
    menu_col: z.string().min(1, m.groupRequired),
    menu_name: z.string().min(1, m.nameRequired),
    items: z.array(
      z.object({
        name: z.string().min(2, m.dishNameShort),
        price: z.string().regex(/^\d+(\.\d{1,2})?$/, m.priceInvalid),

        description: z.string().optional(),
      })
    ),
  });

// Das Schema für "Gericht bearbeiten" liegt in src/lib/schemas/dish.js
// (gemeinsam mit der API-Route updateDish).
export { createMenuSchema };
