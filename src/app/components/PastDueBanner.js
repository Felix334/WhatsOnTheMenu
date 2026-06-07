"use client";

import { useSession } from "next-auth/react";
import { useState } from "react";

export default function PastDueBanner() {
  const { data: session } = useSession();
  const [loading, setLoading] = useState(false);

  if (session?.user?.subscriptionStatus !== "past_due") return null;

  const openPortal = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/payment/portal", { method: "POST" });
      const data = await res.json();
      if (data.url) window.location.href = data.url;
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full bg-amber-50 border-b border-amber-300 px-4 py-3 flex items-center justify-between gap-4 text-sm">
      <p className="text-amber-800 font-medium">
        ⚠️ Deine letzte Zahlung ist fehlgeschlagen. Bitte aktualisiere deine Zahlungsmethode um deinen Zugang zu behalten.
      </p>
      <button
        onClick={openPortal}
        disabled={loading}
        className="shrink-0 bg-amber-600 hover:bg-amber-700 text-white font-semibold rounded-lg px-4 py-1.5 transition-colors disabled:opacity-50"
      >
        {loading ? "Laden..." : "Jetzt bezahlen"}
      </button>
    </div>
  );
}
