import { sendEmail } from "./nodemailer";
import { devLog } from "./logger";

/**
 * Bestätigungsmail nach erfolgreicher Restaurant-Registrierung bzw. Abo-Abschluss.
 * Wird SMTP nicht konfiguriert (kein SMTP_HOST), passiert nichts — die
 * Registrierung selbst darf nie an der Mail scheitern.
 */
export async function sendRegistrationConfirmation({
  to,
  restaurantName,
  tier,
}: {
  to: string;
  restaurantName: string;
  tier: string;
}) {
  if (!process.env.SMTP_HOST) {
    devLog("SMTP nicht konfiguriert — Registrierungs-Mail übersprungen");
    return;
  }
  if (!to) return;

  const html = `
    <div style="font-family: Arial, Helvetica, sans-serif; max-width: 560px; margin: 0 auto; color: #1f2937;">
      <div style="background: #7f1d1d; color: #ffffff; padding: 24px 32px; border-radius: 12px 12px 0 0;">
        <h1 style="margin: 0; font-size: 20px;">WhatIsOnMyMenu.com</h1>
      </div>
      <div style="border: 1px solid #e5e7eb; border-top: 0; padding: 32px; border-radius: 0 0 12px 12px;">
        <h2 style="margin-top: 0; font-size: 18px;">Registrierung erfolgreich 🎉</h2>
        <p>dein Restaurant <strong>${restaurantName}</strong> wurde erfolgreich im Tarif <strong>${tier}</strong> registriert.</p>
        <p>Du kannst deine digitale Speisekarte jetzt in deinem Profil bearbeiten und per QR-Code veröffentlichen.</p>
        <p style="margin: 24px 0;">
          <a href="https://www.whatisonmymenu.com/Profil" style="background: #7f1d1d; color: #ffffff; padding: 10px 20px; border-radius: 8px; text-decoration: none;">Zum Profil</a>
        </p>
        <p style="color: #6b7280; font-size: 12px;">Diese E-Mail wurde automatisch versendet. Wenn du diese Registrierung nicht veranlasst hast, antworte bitte auf diese E-Mail.</p>
      </div>
    </div>`;

  await sendEmail(to, `Registrierung bestätigt — ${restaurantName}`, html);
}
