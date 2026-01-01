"use client";

import React, { useState, useRef, useEffect } from "react";
import Image from "next/image";
import QRCode from "qrcode";
import { useSearchParams } from "next/navigation";

export default function Page() {
  const searchParams = useSearchParams();

  const [qrCode, setQrCode] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const canvasRef = useRef(null);
  const [restaurantURL, setRestaurantURL] = useState("");

  useEffect(() => {
    const id = searchParams.get("restaurantID");

    if (!id) return;

    const url = new URL(
      "/UnserePartner/Restaurants/Menu",
      window.location.origin
    );

    url.search = new URLSearchParams({
      restaurantID: id,
    });

    const full = url.toString();
    setRestaurantURL(full);
  }, [searchParams]);

  const generateQRCode = async () => {
    if (!restaurantURL) return;

    setIsGenerating(true);

    try {
      const url = await QRCode.toDataURL(restaurantURL, {
        width: 256,
        margin: 2,
        color: {
          dark: "#000000",
          light: "#FFFFFF",
        },
      });

      setQrCode(url);

      if (canvasRef.current) {
        await QRCode.toCanvas(canvasRef.current, restaurantURL, {
          width: 256,
          margin: 2,
          color: {
            dark: "#000000",
            light: "#FFFFFF",
          },
        });
      }
    } catch (error) {
      console.error("QR Fehler:", error);
      alert("Fehler bei der QR-Code Generierung");
    } finally {
      setIsGenerating(false);
    }
  };

  const downloadQRCode = () => {
    if (!qrCode) return;

    const link = document.createElement("a");
    link.href = qrCode;
    link.download = "qrcode.png";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const clearQRCode = () => {
    setQrCode("");
    if (canvasRef.current) {
      const ctx = canvasRef.current.getContext("2d");
      ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4">
      <div className="max-w-md mx-auto bg-white rounded-2xl shadow-2xl p-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            QR Code Generator
          </h1>
          <p className="text-gray-600">
            Ihr Link wird automatisch generiert — keine Eingabe nötig
          </p>
        </div>

        <div className="mb-6">
          <h1 className="font-semibold mb-1">Ihre URL</h1>
          <p className="break-all text-sm text-blue-700">
            {restaurantURL || "Keine Restaurant-ID gefunden"}
          </p>
        </div>

        <button
          onClick={generateQRCode}
          disabled={!restaurantURL || isGenerating}
          className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white py-3 px-6 rounded-lg font-semibold disabled:opacity-50 mb-6"
        >
          {isGenerating ? "Erstellen…" : "QR-Code erstellen"}
        </button>

        {qrCode && (
          <div className="text-center mb-6">
            <div className="bg-gray-50 p-6 rounded-lg border border-gray-200 mb-4">
              <Image
                src={qrCode}
                alt="Generated QR Code"
                className="mx-auto"
                width={256}
                height={256}
              />
            </div>

            <div className="flex gap-3">
              <button
                onClick={downloadQRCode}
                className="flex-1 bg-green-500 text-white py-2 px-4 rounded-lg"
              >
                Download
              </button>
              <button
                onClick={clearQRCode}
                className="flex-1 bg-gray-500 text-white py-2 px-4 rounded-lg"
              >
                Löschen
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
