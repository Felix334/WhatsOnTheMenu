"use client";

import React, { useState, useRef, useEffect, Suspense, useCallback } from "react";
import Image from "next/image";
import QRCode from "qrcode";
import { useSearchParams } from "next/navigation";

function QRContent() {
  const searchParams = useSearchParams();

  const [qrCode, setQrCode] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [qrSize, setQrSize] = useState(256);

  // Canvas Ref für JavaScript
  const canvasRef = useRef(null);
  const [restaurantURL, setRestaurantURL] = useState("");

  useEffect(() => {
    const id = searchParams.get("restaurantID");

    if (!id) return;

    const url = new URL(
      "/UnserePartner/Restaurants/Menu",
      window.location.origin
    );

    url.searchParams.set("restaurantID", id);

    setRestaurantURL(url.toString());
  }, [searchParams]);

  const calculateQRSize = (urlLength) => {
    if (urlLength < 50) return 256;
    if (urlLength < 100) return 320;
    if (urlLength < 200) return 384;
    if (urlLength < 500) return 448;
    return 512;
  };

  const generateQRCode = useCallback(async () => {
    if (!restaurantURL) return;

    setIsGenerating(true);

    try {
      const urlLength = restaurantURL.length;
      const dynamicSize = calculateQRSize(urlLength);
      setQrSize(dynamicSize);

      const qrOptions = {
        width: dynamicSize,
        margin: 3,
        errorCorrectionLevel: 'H',
        color: {
          dark: "#000000",
          light: "#FFFFFF",
        },
      };

      const qrDataURL = await QRCode.toDataURL(restaurantURL, qrOptions);
      setQrCode(qrDataURL);

      // Canvas nur wenn verfügbar
      const canvas = canvasRef.current;
      if (canvas) {
        canvas.width = dynamicSize;
        canvas.height = dynamicSize;
        await QRCode.toCanvas(canvas, restaurantURL, qrOptions);
      }
    } catch (error) {
      console.error("QR Fehler:", error);
      alert("Fehler bei der QR-Code Generierung");
    } finally {
      setIsGenerating(false);
    }
  }, [restaurantURL]);

  const downloadQRCode = () => {
    if (!qrCode) return;

    const link = document.createElement("a");
    link.href = qrCode;
    link.download = `qrcode-${restaurantURL.slice(-8)}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const clearQRCode = () => {
    setQrCode("");
    setQrSize(256);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4">
      <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-2xl p-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            QR Code Generator
          </h1>
          <p className="text-gray-600">
            Automatische Anpassung an Ihre URL-Länge — immer scannbar!
          </p>
        </div>

        <div className="mb-6 p-4 bg-blue-50 rounded-lg">
          <h2 className="font-semibold mb-2 text-blue-800">Ihre Profil-URL:</h2>
          <p className={`break-all text-sm ${restaurantURL.length > 100 ? 'text-red-600 font-medium' : 'text-blue-700'}`}>
            {restaurantURL || "Keine Restaurant-ID gefunden"}
          </p>
          {restaurantURL && (
            <p className="text-xs mt-1 text-gray-500">
              Länge: {restaurantURL.length} Zeichen
            </p>
          )}
        </div>

        <button
          onClick={generateQRCode}
          disabled={!restaurantURL || isGenerating}
          className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white py-3 px-6 rounded-lg font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed mb-6"
        >
          {isGenerating ? "Erstelle optimalen QR-Code…" : "QR-Code erstellen"}
        </button>

        {qrCode && (
          <div className="text-center mb-6">


            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={downloadQRCode}
                className="flex-1 bg-gradient-to-r from-green-500 to-green-600 text-white py-3 px-6 rounded-lg font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200"
              >
                💾 QR-Code downloaden
              </button>

              <button
                onClick={clearQRCode}
                className="flex-1 bg-gradient-to-r from-gray-500 to-gray-600 text-white py-3 px-6 rounded-lg font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200"
              >
                🗑️ Neu generieren
              </button>
            </div>

            {restaurantURL.length > 150 && (
              <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                <p className="text-sm text-yellow-800">
                  💡 <strong>Tipp:</strong> Bei langen URLs wurde die Größe automatisch auf {qrSize}px erhöht für beste Scan-Ergebnisse. Drucken Sie in hoher Qualität!
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default function Page() {
  return (
    <Suspense fallback={<div className="p-6 text-center">Loading...</div>}>
      <QRContent />
    </Suspense>
  );
}