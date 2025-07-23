/*"use client"
import { useState } from "react"
import { BarcodeScanner } from "../../components/QR-CodeScanner.mjs"

export default function Page(){
  return (
    <div>
      <input type="file" name="image" accept="image/*" capture="environment"></input>
    </div>
  )
}*/
// components/QRScanner.js
'use client'

import { useEffect, useRef, useState } from 'react'
import { Html5QrcodeScanner } from 'html5-qrcode'

export default function QRScanner() {
  const scannerRef = useRef<Html5QrcodeScanner | null>(null)
  const [scanResult, setScanResult] = useState<string | null>(null)

  useEffect(() => {
    if (!scannerRef.current) {
      const scanner = new Html5QrcodeScanner('reader', {
        qrbox: {
          width: 250,
          height: 250
        },
        fps: 10
      }, /* verbose= */ false)

     scanner.render(
  (decodedText) => {
    setScanResult(decodedText);
    // Optionally stop scanner after successful scan
    // scanner.clear().catch(err => console.error('Clear error:', err));
  },
  (error) => {
    if (error && error.includes && error.includes('NotFoundException')) {
      // No QR code found in this frame, ignore or show subtle UI feedback
      console.warn('No QR code detected in this frame.');
    } else {
      // Log other errors
      console.warn('QR scan error:', error);
    }
  }
);

      scannerRef.current = scanner
    }

    return () => {
      if (scannerRef.current) {
        scannerRef.current.clear()
          .then(() => {
            scannerRef.current = null
          })
          .catch(e => console.error('Failed to clear scanner', e))
      }
    }
  }, [])

  return (
    <div className="qr-container">
      <div id="reader" className="reader" />
      {scanResult && <div className="result">Scanned: {scanResult}</div>}
      <style jsx>{`
        .qr-container {
          display: flex;
          flex-direction: column;
          align-items: center;
          padding: 1rem;
        }
        .reader {
          width: 300px;
          height: 300px;
        }
        .result {
          margin-top: 1rem;
          font-weight: bold;
        }
      `}</style>
    </div>
  )
}
