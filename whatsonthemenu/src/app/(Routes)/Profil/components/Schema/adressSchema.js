import * as z from "zod"

const adressSchema = z.object({
    street: z.string().min(1, "Straßennamen erforderlich"),
    housNumber: z.string().min(1, "Hausnummer erforderlich"),
    city: z.string().min(2, "Stadtnamen erforderlich"),
    postalCode: z.string().min(1, "Bitte eine Postleitzahl angeben"),
    country: z.string("")
})

export default adressSchema