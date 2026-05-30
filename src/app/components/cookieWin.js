"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

export default function CookieBanner() {
  const [show, setShow] = useState(false);
  const router = useRouter();
  const { data: session } = useSession();

  const userID = session?.user?.id || "";

  useEffect(() => {
    // Cookie prüfen
    const consent = document.cookie.split("; ").find((row) => row.startsWith("cookieConsent="));

    if (!consent) {
      setShow(true);
    }
  }, []);

  const acceptCookies = () => {
    // 1 Jahr Cookie setzen
    const expiry = new Date();
    expiry.setFullYear(expiry.getFullYear() + 1);
    document.cookie = `cookieConsent=accepted; expires=${expiry.toUTCString()}; path=/; SameSite=Strict`;
    setShow(false);
  };

  if (!show) return null;

  return (
    <div
      style={{
        position: "fixed",
        bottom: "20px",
        left: "20px",
        right: "20px",
        maxWidth: "450px",
        margin: "0 auto",
        background: "rgba(255,255,255,0.95)",
        backdropFilter: "blur(10px)",
        padding: "24px",
        borderRadius: "16px",
        boxShadow: "0 20px 40px rgba(0,0,0,0.15)",
        border: "1px solid #e5e7eb",
        fontFamily: "-apple-system, BlinkMacSystemFont, sans-serif",
        zIndex: 9999,
      }}
    >
      <h3
        style={{
          margin: "0 0 12px 0",
          fontSize: "18px",
          fontWeight: "600",
          color: "#111827",
        }}
      >
        🍪 Cookies
      </h3>

      <p
        style={{
          margin: "0 0 16px 0",
          fontSize: "14px",
          color: "#6b7280",
          lineHeight: "1.5",
        }}
      >
        Wir nutzen <strong>technische Cookies</strong> für Sicherheit (Cloudflare) und Zahlungen (Stripe).
      </p>

      <p
        style={{
          margin: "0 0 20px 0",
          fontSize: "13px",
          color: "#9ca3af",
        }}
      >
        <Link
          href={{
            pathname: "/AGBs",
            query: { ...router.query, ...(userID ? { userID } : {}) },
          }}
        >
          Datenschutzerklärung →
        </Link>
      </p>

      <button
        onClick={acceptCookies}
        style={{
          padding: "12px 24px",
          background: "#3b82f6",
          color: "white",
          border: "none",
          borderRadius: "10px",
          cursor: "pointer",
          fontSize: "14px",
          fontWeight: "500",
          boxShadow: "0 4px 12px rgba(59,130,246,0.4)",
        }}
      >
        Akzeptieren
      </button>
    </div>
  );
}
