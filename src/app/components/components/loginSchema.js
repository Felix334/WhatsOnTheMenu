import * as z from "zod";

const loginSchema = z.object({
  email: z.string().email({
    message: "Bitte geben sie eine gültige Emailadresse ein",
  }),
  password: z
    .string()
    .min(6, {
      message: "Bitte geben sie ein Passwort mit mindestens 6 Zeichen ein",
    })
    .max(16, {
      message: "Ihr Passwort ist zu lang!\nEs sollte maximal 16 zeichen lang sein",
    }),
});

export default loginSchema;
