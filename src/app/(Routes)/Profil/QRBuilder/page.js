"use client";

import React, { useState, Suspense, useCallback } from "react";
import QRCode from "qrcode";
import { useSearchParams } from "next/navigation";

function buildMenuUrl(origin, restaurantID, tableNumber) {
  const url = new URL("/UnserePartner/Restaurants/Menu", origin);
  url.searchParams.set("restaurantID", restaurantID);
  if (tableNumber) url.searchParams.set("tableNumber", tableNumber);
  return url.toString();
}

function calculateQRSize(urlLength) {
  if (urlLength < 50) return 256;
  if (urlLength < 100) return 320;
  if (urlLength < 200) return 384;
  return 448;
}

async function generateQRDataURL(url) {
  return QRCode.toDataURL(url, {
    width: calculateQRSize(url.length),
    margin: 3,
    errorCorrectionLevel: "H",
    color: { dark: "#000000", light: "#FFFFFF" },
  });
}

// ─── Single QR Card ────────────────────────────────────────────────────────────
function QRCard({ label, url, dataURL }) {
  const download = () => {
    const link = document.createElement("a");
    link.href = dataURL;
    link.download = `tisch-${label}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="bg-white border border-gray-200 rounded-2xl p-4 flex flex-col items-center gap-3 shadow-sm">
      <p className="font-semibold text-gray-800">Tisch {label}</p>
      <img src={dataURL} alt={`QR Tisch ${label}`} className="w-40 h-40" />
      <p className="text-xs text-gray-400 break-all text-center max-w-[160px]">{url}</p>
      <button
        onClick={download}
        className="w-full bg-gray-900 hover:bg-gray-700 text-white text-sm font-semibold py-2 rounded-xl transition-colors"
      >
        💾 Download
      </button>
    </div>
  );
}

// ─── Main ──────────────────────────────────────────────────────────────────────
function QRContent() {
  const searchParams = useSearchParams();
  const restaurantID = searchParams.get("restaurantID");

  const [mode, setMode] = useState("single"); // "single" | "batch"
  const [tableNumber, setTableNumber] = useState("");
  const [tableFrom, setTableFrom] = useState("1");
  const [tableTo, setTableTo] = useState("10");
  const [results, setResults] = useState([]); // [{ label, url, dataURL }]
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState("");

  const origin = typeof window !== "undefined" ? window.location.origin : "";

  const handleGenerate = useCallback(async () => {
    if (!restaurantID) { setError("Keine Restaurant-ID gefunden"); return; }
    setError("");
    setGenerating(true);
    setResults([]);

    try {
      if (mode === "single") {
        if (!tableNumber.trim()) { setError("Bitte eine Tischnummer eingeben"); setGenerating(false); return; }
        const url = buildMenuUrl(origin, restaurantID, tableNumber.trim());
        const dataURL = await generateQRDataURL(url);
        setResults([{ label: tableNumber.trim(), url, dataURL }]);
      } else {
        const from = parseInt(tableFrom, 10);
        const to = parseInt(tableTo, 10);
        if (isNaN(from) || isNaN(to) || from < 1 || to < from || to - from > 49) {
          setError("Bitte gültige Tische eingeben (max. 50 auf einmal)");
          setGenerating(false);
          return;
        }
        const items = [];
        for (let i = from; i <= to; i++) {
          const url = buildMenuUrl(origin, restaurantID, String(i));
          const dataURL = await generateQRDataURL(url);
          items.push({ label: String(i), url, dataURL });
        }
        setResults(items);
      }
    } catch (e) {
      setError("Fehler beim Generieren");
      console.error(e);
    } finally {
      setGenerating(false);
    }
  }, [restaurantID, mode, tableNumber, tableFrom, tableTo, origin]);

  const downloadAll = () => {
    results.forEach(({ label, dataURL }) => {
      const link = document.createElement("a");
      link.href = dataURL;
      link.download = `tisch-${label}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="max-w-2xl mx-auto space-y-6">

        {/* Header */}
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900">Tisch QR-Codes</h1>
          <p className="text-gray-500 mt-1 text-sm">Jeder QR-Code öffnet die Speisekarte mit aktiviertem Bestellmodus für den jeweiligen Tisch</p>
        </div>

        {/* Config card */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 space-y-5">

          {/* Mode toggle */}
          <div className="flex gap-2">
            <button
              onClick={() => setMode("single")}
              className={`flex-1 py-2 rounded-xl text-sm font-semibold border transition-colors ${mode === "single" ? "bg-gray-900 text-white border-gray-900" : "bg-white text-gray-600 border-gray-200 hover:border-gray-400"}`}
            >
              Einzelner Tisch
            </button>
            <button
              onClick={() => setMode("batch")}
              className={`flex-1 py-2 rounded-xl text-sm font-semibold border transition-colors ${mode === "batch" ? "bg-gray-900 text-white border-gray-900" : "bg-white text-gray-600 border-gray-200 hover:border-gray-400"}`}
            >
              Mehrere Tische
            </button>
          </div>

          {/* Inputs */}
          {mode === "single" ? (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Tischnummer</label>
              <input
                type="text"
                value={tableNumber}
                onChange={(e) => setTableNumber(e.target.value)}
                placeholder="z.B. 1, A3, Terrasse 2..."
                className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-gray-400"
              />
              <p className="text-xs text-gray-400 mt-1">Buchstaben und Sonderzeichen erlaubt</p>
            </div>
          ) : (
            <div className="flex gap-3 items-end">
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">Von Tisch</label>
                <input
                  type="number"
                  value={tableFrom}
                  min="1"
                  onChange={(e) => setTableFrom(e.target.value)}
                  className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-gray-400"
                />
              </div>
              <div className="pb-2.5 text-gray-400">bis</div>
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">Bis Tisch</label>
                <input
                  type="number"
                  value={tableTo}
                  min="1"
                  onChange={(e) => setTableTo(e.target.value)}
                  className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-gray-400"
                />
              </div>
            </div>
          )}

          {error && <p className="text-sm text-red-600">{error}</p>}

          <button
            onClick={handleGenerate}
            disabled={generating || !restaurantID}
            className="w-full bg-gray-900 hover:bg-gray-700 disabled:opacity-50 text-white font-semibold py-3 rounded-xl transition-colors"
          >
            {generating ? "Wird generiert…" : "QR-Codes erstellen"}
          </button>
        </div>

        {/* Results */}
        {results.length > 0 && (
          <div className="space-y-4">
            {results.length > 1 && (
              <div className="flex justify-between items-center">
                <p className="text-sm text-gray-500">{results.length} QR-Codes generiert</p>
                <button
                  onClick={downloadAll}
                  className="text-sm font-semibold text-gray-900 border border-gray-200 bg-white rounded-xl px-4 py-2 hover:bg-gray-50 transition-colors"
                >
                  Alle downloaden
                </button>
              </div>
            )}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {results.map((r) => (
                <QRCard key={r.label} {...r} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function Page() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center text-gray-500">Laden...</div>}>
      <QRContent />
    </Suspense>
  );
}
