import * as z from "zod";

const registerSchema = z.object({
  name: z.string().min(1, {
    message: "Bitte geben sie ihren vollständigen Namen an",
  }),
  email: z.string().email({
    message: "Bitte geben sie eine gültige Emailadresse ein",
  }),
  password: z
    .string()
    .lowercase()/////////////////////////////////////////////////////??
    .min(6, {
      message: "Bitte geben sie ein Passwort mit mindestens 6 Zeichen ein",
    })
    .max(16, {
      message: "Ihr Passwort ist zu lang!\nEs sollte maximal 16 zeichen lang sein",
    }),
});

export default registerSchema;
