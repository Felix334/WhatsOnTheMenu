import * as z from "zod";

// Standort-Prüfung im Profil (optionMenu.js). Als Funktion, damit die Meldungen
// in der Oberflächensprache erscheinen — m = dashboard.restaurant.addressErrors.
const createAddressSchema = (m) =>
  z.object({
    street: z.string().min(1, m.street),
    houseNumber: z.number().min(1, m.houseNumber),
    city: z.string().min(2, m.city),
    postalCode: z.string().min(1, m.postalCode),
    country: z.string("").min(1, m.country),
  });

export default createAddressSchema;
