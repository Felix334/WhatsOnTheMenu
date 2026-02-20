'use client';

import { useEffect, useState } from 'react';
import { Html5QrcodeScanner } from 'html5-qrcode';

export default function QRCodeScanner({ onScanSuccess, onScanError }) {
  const [scanResult, setScanResult] = useState(null);

  useEffect(() => {
    const scanner = new Html5QrcodeScanner('reader', {
      qrbox: {
        width: 250,
        height: 250,
      },
      fps: 5,
    });

    scanner.render(success, error);

    function success(result) {
      scanner.clear();
      setScanResult(result);
      if (onScanSuccess) {
        onScanSuccess(result);
      }
    }

    function error(err) {
      console.warn(err);
      if (onScanError) {
        onScanError(err);
      }
    }

    return () => {
      scanner.clear();
    };
  }, [onScanSuccess, onScanError]);

  return (
    <div>
      {scanResult
        ? <div>Scanned: <a href={scanResult} target="_blank" rel="noopener noreferrer">{scanResult}</a></div>
        : <div id="reader"></div>
      }
    </div>
  );
}
