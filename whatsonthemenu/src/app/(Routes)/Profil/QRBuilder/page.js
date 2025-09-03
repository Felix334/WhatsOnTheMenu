"use client";

import React, { useState, useRef } from "react";
import Image from "next/image";
import QRCode from "qrcode";

export default function Page() {
  const [text, setText] = useState("");
  const [qrCode, setQrCode] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const canvasRef = useRef(null);

  const generateQRCode = async () => {
    if (!text.trim()) {
      alert("Bitte fügen sie die URL in das Eingabefeld ein");
      return;
    }

    setIsGenerating(true);

    try {
      // Generate QR code as data URL
      const url = await QRCode.toDataURL(text, {
        width: 256,
        margin: 2,
        color: {
          dark: "#000000",
          light: "#FFFFFF",
        },
      });

      setQrCode(url);

      // Also draw on canvas for better quality
      if (canvasRef.current) {
        await QRCode.toCanvas(canvasRef.current, text, {
          width: 256,
          margin: 2,
          color: {
            dark: "#000000",
            light: "#FFFFFF",
          },
        });
      }
    } catch (error) {
      console.error("Bei der Generierung des QR-Codes ist ein Fehler aufgetreten:", error);
      alert("Bei der Generierung des QR-Codes ist ein Fehler aufgetreten:", error);
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
    setText("");
    if (canvasRef.current) {
      const ctx = canvasRef.current.getContext("2d");
      ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4">
      <div className="max-w-md mx-auto bg-white rounded-2xl shadow-2xl p-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">QR Code Generator</h1>
          <p className="text-gray-600">Erstellen sie ihren persönlichen Link in Form eines QR-Codes</p>
        </div>

        {/* Input Section */}
        <div className="mb-6">
          <label htmlFor="qr-text" className="block text-sm font-medium text-gray-700 mb-2">
            Bitte URL eingeben
          </label>
          <input id="qr-text" type="text" value={text} onChange={(e) => setText(e.target.value)} placeholder="https://example.com or any text..." className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200" onKeyPress={(e) => e.key === "Enter" && generateQRCode()} />
        </div>

        {/* Generate Button */}
        <button onClick={generateQRCode} disabled={isGenerating} className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white py-3 px-6 rounded-lg font-semibold hover:from-blue-600 hover:to-purple-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed mb-6">
          {isGenerating ? (
            <span className="flex items-center justify-center">
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Erstellen...
            </span>
          ) : (
            "Generate QR Code"
          )}
        </button>

        {/* QR Code Display */}
        {qrCode && (
          <div className="text-center mb-6">
            <div className="bg-gray-50 p-6 rounded-lg border border-gray-200 mb-4">
             
              <Image src={qrCode} alt="Generated QR Code" className="mx-auto border border-gray-300 rounded mb-4" width={256} height={256} />
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3">
              <button onClick={downloadQRCode} className="flex-1 bg-green-500 text-white py-2 px-4 rounded-lg font-medium hover:bg-green-600 transition-colors duration-200">
                Download
              </button>
              <button onClick={clearQRCode} className="flex-1 bg-gray-500 text-white py-2 px-4 rounded-lg font-medium hover:bg-gray-600 transition-colors duration-200">
                Löschen
              </button>
            </div>
          </div>
        )}

        {/* Features List */}
        <div className="mt-8 pt-6 border-t border-gray-200">
          <h3 className="text-lg font-semibold text-gray-800 mb-3">Features</h3>
          <ul className="space-y-2 text-sm text-gray-600">
            <li className="flex items-center">
              <svg className="w-4 h-4 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              QR-Code Generierung
            </li>
            <li className="flex items-center">
              <svg className="w-4 h-4 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              Als PNG herrunterladen
            </li>
            <li className="flex items-center">
              <svg className="w-4 h-4 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              Anpassendes Desing
            </li>
          </ul>
        </div>
      </div>

      {/* Footer */}
      <div className="text-center mt-8">
        <p className="text-gray-600 text-sm">Built with Next.js, React, and QRCode.js</p>
      </div>
    </div>
  );
}
