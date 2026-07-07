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

// ─── Druckvorlage (Tischaufsteller) ────────────────────────────────────────────
function escapeHtml(str) {
  return String(str).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
}

// Eine A4-Seite pro Tisch: klassischer Aufsteller — obere Hälfte um 180° gedreht,
// in der Mitte falten, an der Außenlinie ausschneiden.
function buildPrintHTML(items, restaurantName) {
  const name = escapeHtml(restaurantName?.trim() || "Speisekarte");

  const half = (label, dataURL) => `
    <div class="half">
      <p class="name">${name}</p>
      <p class="sub">Digitale Speisekarte</p>
      <img class="qr" src="${dataURL}" alt="QR Tisch ${escapeHtml(label)}" />
      <p class="table">Tisch ${escapeHtml(label)}</p>
      <p class="steps">📱 Code scannen&nbsp;&nbsp;·&nbsp;&nbsp;🍽️ Karte ansehen&nbsp;&nbsp;·&nbsp;&nbsp;✅ Bestellen</p>
    </div>`;

  const sheets = items
    .map(
      ({ label, dataURL }) => `
    <div class="sheet">
      <div class="card">
        <div class="flip">${half(label, dataURL)}</div>
        <div class="fold"><span>hier falten</span></div>
        ${half(label, dataURL)}
      </div>
      <p class="cut-hint">An der gestrichelten Außenlinie ausschneiden, in der Mitte falten und aufstellen.</p>
    </div>`
    )
    .join("");

  return `<!DOCTYPE html>
<html lang="de">
<head>
<meta charset="utf-8" />
<title>QR-Tischaufsteller</title>
<style>
  @page { size: A4 portrait; margin: 0; }
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body { font-family: Arial, Helvetica, sans-serif; color: #111827; }
  .sheet { width: 210mm; height: 296mm; page-break-after: always; padding: 15mm; display: flex; flex-direction: column; align-items: center; }
  .card { width: 120mm; border: 1.5px dashed #9ca3af; border-radius: 4mm; overflow: hidden; }
  .flip { transform: rotate(180deg); }
  .half { height: 118mm; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 4mm; padding: 8mm; }
  .name { font-size: 22pt; font-weight: bold; text-align: center; }
  .sub { font-size: 10pt; color: #6b7280; letter-spacing: 2px; text-transform: uppercase; }
  .qr { width: 52mm; height: 52mm; }
  .table { font-size: 16pt; font-weight: bold; }
  .steps { font-size: 9pt; color: #4b5563; text-align: center; }
  .fold { border-top: 1px dashed #d1d5db; text-align: center; position: relative; }
  .fold span { font-size: 7pt; color: #d1d5db; background: #ffffff; position: relative; top: -1.5mm; padding: 0 2mm; letter-spacing: 1px; }
  .cut-hint { margin-top: 6mm; font-size: 8pt; color: #9ca3af; }
  @media print { .cut-hint { display: none; } }
</style>
</head>
<body>${sheets}</body>
</html>`;
}

// Aufsteller als PNG (A4 bei 300 dpi) — gleiche Vorlage wie der Druck, nur als Bilddatei
const PX_PER_MM = 2480 / 210;
const mm = (v) => Math.round(v * PX_PER_MM);

function loadImage(src) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
}

async function buildTentCanvas(item, restaurantName) {
  const name = restaurantName?.trim() || "Speisekarte";
  const canvas = document.createElement("canvas");
  canvas.width = mm(210);
  canvas.height = mm(297);
  const ctx = canvas.getContext("2d");
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  const qrImg = await loadImage(item.dataURL);

  const cardW = mm(120);
  const halfH = mm(118);
  const cardX = (canvas.width - cardW) / 2;
  const cardY = mm(15);

  // Zeichnet eine Aufsteller-Hälfte mit Ursprung oben links (cardW × halfH)
  const drawHalf = () => {
    const cx = cardW / 2;
    ctx.textAlign = "center";
    ctx.fillStyle = "#111827";
    ctx.font = `bold ${mm(8)}px Arial`;
    ctx.fillText(name, cx, mm(30), cardW - mm(16));
    ctx.fillStyle = "#6b7280";
    ctx.font = `${mm(3.5)}px Arial`;
    ctx.fillText("DIGITALE SPEISEKARTE", cx, mm(38));
    const qrSize = mm(52);
    ctx.drawImage(qrImg, cx - qrSize / 2, mm(44), qrSize, qrSize);
    ctx.fillStyle = "#111827";
    ctx.font = `bold ${mm(6)}px Arial`;
    ctx.fillText(`Tisch ${item.label}`, cx, mm(106));
    ctx.fillStyle = "#4b5563";
    ctx.font = `${mm(3.2)}px Arial`;
    ctx.fillText("📱 Code scannen  ·  🍽️ Karte ansehen  ·  ✅ Bestellen", cx, mm(113), cardW - mm(10));
  };

  // Obere Hälfte um 180° gedreht — nach dem Falten sind beide Seiten lesbar
  ctx.save();
  ctx.translate(cardX + cardW, cardY + halfH);
  ctx.rotate(Math.PI);
  drawHalf();
  ctx.restore();

  ctx.save();
  ctx.translate(cardX, cardY + halfH);
  drawHalf();
  ctx.restore();

  // Falzlinie (Mitte) und gestrichelte Schnittkante außen
  ctx.strokeStyle = "#d1d5db";
  ctx.lineWidth = mm(0.2);
  ctx.setLineDash([mm(2), mm(2)]);
  ctx.beginPath();
  ctx.moveTo(cardX, cardY + halfH);
  ctx.lineTo(cardX + cardW, cardY + halfH);
  ctx.stroke();
  ctx.strokeStyle = "#9ca3af";
  ctx.lineWidth = mm(0.4);
  ctx.strokeRect(cardX, cardY, cardW, halfH * 2);
  ctx.setLineDash([]);

  return canvas;
}

async function downloadTentImages(items, restaurantName) {
  try {
    for (const item of items) {
      const canvas = await buildTentCanvas(item, restaurantName);
      const link = document.createElement("a");
      link.href = canvas.toDataURL("image/png");
      link.download = `aufsteller-tisch-${item.label}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  } catch (e) {
    console.error(e);
    alert("Fehler beim Erstellen der Aufsteller-Bilder");
  }
}

function openPrintTemplate(items, restaurantName) {
  const blob = new Blob([buildPrintHTML(items, restaurantName)], { type: "text/html" });
  const url = URL.createObjectURL(blob);
  const win = window.open(url, "_blank");
  if (!win) {
    URL.revokeObjectURL(url);
    alert("Bitte Pop-ups für diese Seite erlauben, um die Druckvorlage zu öffnen.");
    return;
  }
  win.addEventListener("load", () => {
    win.focus();
    win.print();
    URL.revokeObjectURL(url);
  });
}

// ─── Single QR Card ────────────────────────────────────────────────────────────
function QRCard({ label, url, dataURL, onPrint, onDownloadTent }) {
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
      <button
        onClick={onPrint}
        className="w-full border border-gray-200 hover:bg-gray-50 text-gray-700 text-sm font-semibold py-2 rounded-xl transition-colors"
      >
        🖨️ Aufsteller drucken
      </button>
      <button
        onClick={onDownloadTent}
        className="w-full border border-gray-200 hover:bg-gray-50 text-gray-700 text-sm font-semibold py-2 rounded-xl transition-colors"
      >
        🖼️ Aufsteller downloaden
      </button>
    </div>
  );
}

// ─── Main ──────────────────────────────────────────────────────────────────────
function QRContent() {
  const searchParams = useSearchParams();
  const restaurantID = searchParams.get("restaurantID");

  const [mode, setMode] = useState("single"); // "single" | "batch"
  const [restaurantName, setRestaurantName] = useState("");
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

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Restaurantname für die Druckvorlage (optional)</label>
            <input
              type="text"
              value={restaurantName}
              onChange={(e) => setRestaurantName(e.target.value)}
              placeholder="z.B. Trattoria Bella"
              className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-gray-400"
            />
            <p className="text-xs text-gray-400 mt-1">Erscheint auf den druckfertigen Tischaufstellern über dem QR-Code</p>
          </div>

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
              <div className="flex flex-wrap justify-between items-center gap-2">
                <p className="text-sm text-gray-500">{results.length} QR-Codes generiert</p>
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => openPrintTemplate(results, restaurantName)}
                    className="text-sm font-semibold text-gray-900 border border-gray-200 bg-white rounded-xl px-4 py-2 hover:bg-gray-50 transition-colors"
                  >
                    🖨️ Alle Aufsteller drucken
                  </button>
                  <button
                    onClick={() => downloadTentImages(results, restaurantName)}
                    className="text-sm font-semibold text-gray-900 border border-gray-200 bg-white rounded-xl px-4 py-2 hover:bg-gray-50 transition-colors"
                  >
                    🖼️ Alle Aufsteller downloaden
                  </button>
                  <button
                    onClick={downloadAll}
                    className="text-sm font-semibold text-gray-900 border border-gray-200 bg-white rounded-xl px-4 py-2 hover:bg-gray-50 transition-colors"
                  >
                    Alle downloaden
                  </button>
                </div>
              </div>
            )}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {results.map((r) => (
                <QRCard key={r.label} {...r} onPrint={() => openPrintTemplate([r], restaurantName)} onDownloadTent={() => downloadTentImages([r], restaurantName)} />
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
