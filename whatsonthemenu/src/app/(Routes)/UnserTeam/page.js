"use client"
import Head from 'next/head';

export default function Page() {
  return (
    <div className="min-h-screen bg-gradient-to-r from-red-900 via-red-600 to-red-400 flex flex-col items-center justify-center text-white font-sans p-8">
      <Head>
        <title>Unser Team</title>
        <link
          href="https://fonts.googleapis.com/icon?family=Material+Icons"
          rel="stylesheet"
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      
      <main>
        <header>
          <h1>Unser Team</h1>
        </header>
        <section className="company-info">
          <h2>Company Information</h2>
          <p><strong>Company Name:</strong> Example GmbH</p>
          <p><strong>Legal Form:</strong> Gesellschaft mit beschränkter Haftung (GmbH)</p>
          <p><strong>Address:</strong> Musterstraße 123, 12345 Musterstadt, Germany</p>
          <p><strong>Phone:</strong> +49 123 4567890</p>
          <p><strong>Email:</strong> info@example.com</p>
          <p><strong>Website:</strong> www.example.com</p>
        </section>

        <section className="legal-representative">
          <h2>Legal Representative</h2>
          <p>Max Mustermann</p>
          <p>Managing Director</p>
        </section>

        <section className="register-info">
          <h2>Register Information</h2>
          <p><strong>Commercial Register:</strong> Amtsgericht Musterstadt</p>
          <p><strong>Registration Number:</strong> HRB 123456</p>
          <p><strong>VAT ID:</strong> DE123456789</p>
        </section>

        <section className="disclaimer">
          <h2>Disclaimer</h2>
          <p>
            Despite careful control, we assume no liability for the content of external links. The operators of the linked pages are solely responsible for their content.
          </p>
        </section>

        <section className="privacy-note">
          <h2>Privacy Policy</h2>
          <p>
            For information about data protection on this website, please refer to our <a href="/privacy-policy">Privacy Policy</a>.
          </p>
        </section>

        <style jsx>{`
          main {
            max-width: 720px;
            margin: 48px auto;
            padding: 0 24px;
            font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen,
              Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
            color: #111;
            background: #f9f9f9;
            border-radius: 12px;
            box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
          }
          header {
            text-align: center;
            padding-bottom: 24px;
            border-bottom: 1px solid #ddd;
          }
          h1 {
            font-size: 2.8rem;
            font-weight: 900;
            color: #313131;
          }
          section {
            margin-top: 32px;
          }
          h2 {
            font-size: 1.6rem;
            color: #4b4b4b;
            margin-bottom: 12px;
            border-left: 4px solid #2563eb;
            padding-left: 12px;
          }
          p {
            line-height: 1.7;
            font-size: 1rem;
            margin-bottom: 12px;
          }
          a {
            color: #2563eb;
            text-decoration: none;
            border-bottom: 1px solid transparent;
            transition: border-color 0.25s ease;
          }
          a:hover,
          a:focus {
            border-color: #2563eb;
            outline: none;
          }

          @media (max-width: 640px) {
            main {
              margin: 24px 16px;
              padding: 0 16px;
            }
            h1 {
              font-size: 2rem;
            }
            h2 {
              font-size: 1.3rem;
            }
          }
        `}</style>
      </main>
    </div>
  );
}

