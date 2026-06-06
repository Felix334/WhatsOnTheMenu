import { sendEmail } from "../../../lib/nodemailer"
import { NextRequest } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    await sendEmail('felixmayer02@gmx.de', 'Test Subject', '<p>Hello from Nodemailer!</p>');
    return new Response(JSON.stringify({ message: 'Email sent' }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    if (error instanceof Error) {
      console.error(error);
      return new Response(JSON.stringify({ error: error.message }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      });
    } else {
      return new Response(JSON.stringify({ error: 'Unknown error occurred' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      });
    }
  }
}
// Code funktioniert aber Email-Provider ist noch nicht vorhanden