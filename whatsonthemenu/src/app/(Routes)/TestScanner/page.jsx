"use client"
import React, { useEffect, useState, useRef } from 'react';

export default function QRScanner() {
  const videoRef = useRef(null);
  const [qrData, setQrData] = useState('No QR code detected');

  useEffect(() => {
    async function startCameraAndDetect() {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.play();
        }

        if ('BarcodeDetector' in window) {
          const barcodeDetector = new BarcodeDetector({ formats: ['qr_code'] });

          const detectQR = async () => {
            if (videoRef.current) {
              const canvas = document.createElement('canvas');
              canvas.width = videoRef.current.videoWidth;
              canvas.height = videoRef.current.videoHeight;
              const context = canvas.getContext('2d');
              context?.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);

              const barcodes = await barcodeDetector.detect(canvas);
              if (barcodes.length > 0) {
                setQrData(barcodes[0].rawValue);  // Extract the QR code data
              } else {
                setQrData('No QR code detected');
              }
              requestAnimationFrame(detectQR);  // Keep checking frames
            }
          };
          detectQR();
        } else {
          console.error('Barcode Detector API not supported in this browser');
        }
      } catch (error) {
        console.error('Error accessing camera or detecting barcode:', error);
      }
    }
    startCameraAndDetect();
  }, []);

  return (
    <div>
      <video ref={videoRef} style={{ width: '100%' }} />
      <p>Detected QR Data: {qrData}</p>
    </div>
  );
}