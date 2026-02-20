'use client'; // Nur für App Router nötig

import { useEffect, useState } from 'react';

export default function CookieBanner() {
  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    const consent = document.cookie
      .split('; ')
      .find(row => row.startsWith('cookieConsent='));
    if (!consent) {
      setShowBanner(true);
    }
  }, []);

  const acceptCookies = () => {
    const expiry = new Date();
    expiry.setFullYear(expiry.getFullYear() + 1); // 1 Jahr gültig
    document.cookie = `cookieConsent=accepted; expires=${expiry.toUTCString()}; path=/`;
    setShowBanner(false);
  };

  const declineCookies = () => {
    const expiry = new Date();
    expiry.setFullYear(expiry.getFullYear() + 1);
    document.cookie = `cookieConsent=declined; expires=${expiry.toUTCString()}; path=/`;
    setShowBanner(false);
  };

  if (!showBanner) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 md:left-auto md:right-4 bg-white shadow-xl border rounded-xl p-4 max-w-md z-50">
      <p className="text-sm text-gray-800 mb-2">
        Diese Website verwendet Cookies, um dein Erlebnis zu verbessern. Mit deiner Zustimmung speichern wir Cookies auf deinem Gerät.
      </p>
      <div className="flex justify-end space-x-2">
        <button
          onClick={declineCookies}
          className="text-sm px-4 py-1 border border-gray-400 rounded hover:bg-gray-100"
        >
          Ablehnen
        </button>
        <button
          onClick={acceptCookies}
          className="text-sm px-4 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Akzeptieren
        </button>
      </div>
    </div>
  );
}
