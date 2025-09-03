/*
import { useState, useEffect, useRef, useCallback } from "react";
import dynamic from "next/dynamic";

// Dynamically import jsQR to avoid SSR issues
const JsQR = dynamic(() => import("jsqr").then((mod) => mod.default), {
  ssr: false,
  loading: () => null,
});

export default function QRCodeScanner() {
  const [hasPermission, setHasPermission] = useState(null);
  const [scannedData, setScannedData] = useState("");
  const [isScanning, setIsScanning] = useState(false);
  const [error, setError] = useState("");
  const [devices, setDevices] = useState([]);
  const [selectedDevice, setSelectedDevice] = useState("");
  const [scanStatus, setScanStatus] = useState("Ready to scan");
  const [scanCount, setScanCount] = useState(0);

  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const streamRef = useRef(null);
  const animationRef = useRef(null);

  // Request camera permission and get available devices
  useEffect(() => {
    async function getCameraPermission() {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        stream.getTracks().forEach((track) => track.stop());
        setHasPermission(true);
        getAvailableDevices();
      } catch (err) {
        setHasPermission(false);
        setError("Camera access denied. Please enable camera permissions.");
      }
    }

    async function getAvailableDevices() {
      try {
        const devices = await navigator.mediaDevices.enumerateDevices();
        const videoDevices = devices.filter((device) => device.kind === "videoinput");
        setDevices(videoDevices);
        if (videoDevices.length > 0) {
          setSelectedDevice(videoDevices[0].deviceId);
        }
      } catch (err) {
        console.error("Error getting devices:", err);
      }
    }

    if (navigator.mediaDevices) {
      getCameraPermission();
    } else {
      setError("Camera API not supported in this browser");
      setHasPermission(false);
    }

    return () => {
      stopScanning();
    };
  }, []);

  // Start scanning with optimized settings
  const startScanning = async () => {
    try {
      setIsScanning(true);
      setError("");
      setScannedData("");
      setScanStatus("Scanning...");
      setScanCount(0);

      const constraints = {
        video: {
          deviceId: selectedDevice ? { exact: selectedDevice } : undefined,
          width: {min: 640, ideal: 1280 },
          height: {min: 480, ideal: 720 },
          facingMode: "environment",
        },
      };

      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      streamRef.current = stream;

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
        // Wait for video to be ready
        await new Promise((resolve) => {
          videoRef.current.onloadedmetadata = resolve;
        });
      }

      // Start scanning loop
      scanQRCode();
    } catch (err) {
      setError("Failed to access camera: " + err.message);
      setIsScanning(false);
      setScanStatus("Camera error");
    }
  };

  // Stop scanning
  const stopScanning = useCallback(() => {
    setIsScanning(false);
    setScanStatus("Scan stopped");
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
      animationRef.current = null;
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
  }, []);

  // Optimized QR code scanning function
  const scanQRCode = useCallback(async () => {
    if (!isScanning || !videoRef.current || !canvasRef.current) {
      return;
    }

    const video = videoRef.current;
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d", { willReadFrequently: true });

    // Only scan when video is ready and playing
    if (video.readyState === video.HAVE_ENOUGH_DATA && video.videoWidth > 0) {
      // Resize canvas to match video dimensions
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;

      // Draw video frame to canvas
      context.drawImage(video, 0, 0, canvas.width, canvas.height);

      try {
        // Get image data for QR code detection
        const imageData = context.getImageData(0, 0, canvas.width, canvas.height);

        if (JsQR) {
          const code = JsQR(imageData.data, imageData.width, imageData.height, {
            inversionAttempts: "dontInvert",
          });
          console.log("Scan attempt:", scanCount, "Result:", code);
          setScanCount((prev) => prev + 1);

          if (code) {
            alert(code.data)
            setScannedData(code.data);
            setScanStatus("QR Code Found!");
            stopScanning();
            await postData(code);
            //alert("Daten erfasst:__",code.data, scannedData);
            return;
          } else if (scanCount > 30) {
            // Give feedback on scan progress
            setScanStatus(`Scanning... (${scanCount} attempts)`);
          }
        }
      } catch (err) {
        console.error("QR scanning error:", err);
      }
    }

    // Continue scanning if still active
    if (isScanning) {
      animationRef.current = requestAnimationFrame(scanQRCode);
    }
  }, [isScanning, scanCount, stopScanning]);

  // Update scan function when dependencies change
  useEffect(() => {
    if (isScanning) {
      animationRef.current = requestAnimationFrame(scanQRCode);
    }
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isScanning, scanQRCode]);

  // Copy scanned data to clipboard
  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(scannedData);
      alert("Copied to clipboard!");
    } catch (err) {
      setError("Failed to copy to clipboard");
    }
  };

  // Reset scanner
  const resetScanner = () => {
    stopScanning();
    setScannedData("");
    setError("");
    setScanStatus("Ready to scan");
    setScanCount(0);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8 px-4">
      <div className="max-w-4xl mx-auto">
       
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">QR Code Scanner</h1>
          <p className="text-gray-600">Scan QR codes directly from your camera</p>
        </div>

        
        <div className="bg-white rounded-2xl shadow-xl p-6 mb-8">

          <div className="mb-4 p-3 bg-blue-50 rounded-lg">
            <div className="flex items-center justify-center">
              <div className={`w-3 h-3 rounded-full mr-2 ${isScanning ? "bg-green-500 animate-pulse" : scannedData ? "bg-green-500" : "bg-gray-400"}`}></div>
              <span className="text-sm font-medium text-gray-700">{scanStatus}</span>
            </div>
          </div>

         
          <div className="mb-6">
            <div className="relative bg-gray-100 rounded-lg overflow-hidden aspect-video mb-4 border-2 border-dashed border-gray-300">
              {hasPermission === false ? (
                <div className="flex items-center justify-center h-full bg-red-50">
                  <div className="text-center p-8">
                    <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </div>
                    <p className="text-red-600 font-medium">Camera access denied</p>
                    <p className="text-gray-600 text-sm mt-2">Please allow camera permissions to use the scanner</p>
                  </div>
                </div>
              ) : (
                <>
                  <video ref={videoRef} className="w-full h-full object-cover" playsInline muted autoPlay />
                  
                  {isScanning && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="relative">
                        <div className="w-48 h-48 border-4 border-green-400 rounded-lg animate-pulse" />
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="w-40 h-1 bg-green-400 animate-[scan_2s_ease-in-out_infinite]" style={{ animation: "scan 2s ease-in-out infinite" }} />
                        </div>
                      </div>
                    </div>
                  )}
                </>
              )}
              <canvas ref={canvasRef} className="hidden" />
            </div>

            
            {devices.length > 1 && (
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">Select Camera:</label>
                <select value={selectedDevice} onChange={(e) => setSelectedDevice(e.target.value)} className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" disabled={isScanning}>
                  {devices.map((device) => (
                    <option key={device.deviceId} value={device.deviceId}>
                      {device.label || `Camera ${device.deviceId.slice(0, 8)}`}
                    </option>
                  ))}
                </select>
              </div>
            )}

            
            <div className="flex gap-4 flex-wrap">
              {!isScanning ? (
                <button onClick={startScanning} disabled={hasPermission === false} className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed min-w-[120px]">
                  Start Scanning
                </button>
              ) : (
                <button onClick={stopScanning} className="flex-1 bg-red-600 hover:bg-red-700 text-white font-medium py-3 px-6 rounded-lg transition-colors min-w-[120px]">
                  Stop Scanning
                </button>
              )}

              {scannedData && (
                <button onClick={resetScanner} className="bg-gray-600 hover:bg-gray-700 text-white font-medium py-3 px-6 rounded-lg transition-colors min-w-[120px]">
                  Scan Another
                </button>
              )}
            </div>
          </div>

          
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
              <div className="flex items-center">
                <svg className="w-5 h-5 text-red-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="text-red-700">{error}</span>
              </div>
            </div>
          )}

        
          {isScanning && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
              <h4 className="font-semibold text-yellow-800 mb-2 flex items-center">
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Scanning Tips
              </h4>
              <ul className="text-yellow-700 text-sm list-disc list-inside space-y-1">
                <li>Ensure good lighting on the QR code</li>
                <li>Hold the camera steady</li>
                <li>Position the QR code within the scanning area</li>
                <li>Move closer if the code is too small</li>
              </ul>
            </div>
          )}

         
          {scannedData && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-green-800 mb-4 flex items-center">
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                QR Code Scanned Successfully!
              </h3>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">Scanned Content:</label>
                <div className="bg-white border border-gray-300 rounded-lg p-4 font-mono text-sm">
                  <pre className="whitespace-pre-wrap break-words">{scannedData}</pre>
                </div>
              </div>

              <div className="flex gap-3 flex-wrap">
                <button onClick={copyToClipboard} className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors flex items-center">
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                  Copy
                </button>

                {scannedData.startsWith("http") && (
                  <a href={scannedData} target="_blank" rel="noopener noreferrer" className="bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-lg transition-colors flex items-center">
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                    Open Link
                  </a>
                )}
                {scannedData.startsWith("https") && (
                  <a href={scannedData} target="_blank" rel="noopener noreferrer" className="bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-lg transition-colors flex items-center">
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                    Open Link
                  </a>
                )}
              </div>
            </div>
          )}
        </div>

        
        {process.env.NODE_ENV === "development" && (
          <div className="bg-gray-100 rounded-lg p-4 mt-6">
            <h4 className="font-semibold text-gray-800 mb-2">Debug Info</h4>
            <div className="text-sm text-gray-600 space-y-1">
              <div>Scan attempts: {scanCount}</div>
              <div>Camera permission: {hasPermission?.toString()}</div>
              <div>Devices found: {devices.length}</div>
              <div>Video ready: {videoRef.current?.readyState === 4 ? "Yes" : "No"}</div>
            </div>
          </div>
        )}
      </div>

      
      <style jsx>{`
        @keyframes scan {
          0%,
          100% {
            transform: translateY(-20px);
            opacity: 0;
          }
          50% {
            transform: translateY(20px);
            opacity: 1;
          }
        }
      `}</style>
    </div>
  );
}

async function postData(scannedData) {
  const {data} = scannedData
  if(data != null){
    window.alert("Daten nicht null:",data)
  }
  window.alert("Schicke Daten__", data)
  if(scannedData){
  const resp = await fetch("./api/code", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      data: scannedData,
    }),
  });
  if (resp.ok) {
    console.log(resp.status);
  }}
}

/*import { useState } from "react"
import { BarcodeScanner } from "../../components/QR-CodeScanner.mjs"

export default function Page(){
  return (
    <div>
      <input type="file" name="image" accept="image/*" capture="environment"></input>
    </div>
  )
}
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
      }, /* verbose=  false)

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
import { Scanner } from "@yudiel/react-qr-scanner";

export default function Page() {
  return <Scanner onScan={(result) => {window.alert(result)}}/>
}*/
"use client";
import { useState, useRef, useEffect } from "react";
import Head from "next/head";
import Image from "next/image";
import jsQR from "jsqr";

export default function QRScanner() {
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [scanResult, setScanResult] = useState(null);
  const [error, setError] = useState(null);
  const [isScanning, setIsScanning] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);

  const videoRef = useRef(null);
  const fileInputRef = useRef(null);
  const animationFrameRef = useRef(null);
  const streamRef = useRef(null);

  // Clean up on component unmount
  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, []);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment" },
      });
      streamRef.current = stream;
      videoRef.current.srcObject = stream;
      setIsCameraActive(true);
      startScanning();
    } catch (err) {
      setError("Camera access denied. Please allow camera permissions.");
      console.error("Error accessing camera:", err);
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }
    setIsCameraActive(false);
    setIsScanning(false);
  };

  const startScanning = () => {
    setIsScanning(true);
    scanQRCode();
  };

  const scanQRCode = () => {
    if (!isScanning || !videoRef.current) return;

    const video = videoRef.current;
    const canvas = document.createElement("canvas");
    const context = canvas.getContext("2d");
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    context.drawImage(video, 0, 0, canvas.width, canvas.height);

    const imageData = context.getImageData(0, 0, canvas.width, canvas.height);

    // Load jsQR dynamically to avoid SSR issues

    const code = jsQR(imageData.data, imageData.width, imageData.height);

    if (code) {
      handleScanResult(code.data);
    }

    animationFrameRef.current = requestAnimationFrame(scanQRCode);
  };

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file && file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target.result);
        scanUploadedImage(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const scanUploadedImage = (imageData) => {
    const img = new Image();
    img.onload = function () {
      const canvas = document.createElement("canvas");
      const context = canvas.getContext("2d");
      canvas.width = img.width;
      canvas.height = img.height;
      context.drawImage(img, 0, 0, canvas.width, canvas.height);

      const imageData = context.getImageData(0, 0, canvas.width, canvas.height);

      const code = jsQR(imageData.data, imageData.width, imageData.height);

      if (code) {
        handleScanResult(code.data);
      } else {
        setError("No QR code found in the image. Please try another image.");
      }
    };
    img.src = imageData;
  };

  const handleScanResult = (data) => {
    setScanResult(data);
    setError(null);
  };

  const copyToClipboard = (text) => {
    navigator.clipboard
      .writeText(text)
      .then(() => {
        alert("Text copied to clipboard!");
      })
      .catch((err) => {
        console.error("Failed to copy:", err);
      });
  };

  const openLink = (url) => {
    window.open(url, "_blank");
  };

  const isURL = (text) => {
    return /^https?:\/\//.test(text);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <Head>
        <title>QR Code Scanner - Online QR Code Reader</title>
      </Head>

      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <header className="text-center mb-12">
          <div className="flex justify-center mb-6">
            <div className="bg-blue-600 p-4 rounded-full shadow-lg">
              <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z"></path>
              </svg>
            </div>
          </div>
          <h1 className="text-4xl font-bold text-gray-800 mb-4">QR Code Scanner</h1>
          <p className="text-lg text-gray-600">Scan QR codes online using your camera or upload an image</p>
        </header>

        {/* Scanner Options */}
        <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-8 mb-12">
          {/* Camera Scanner */}
          <div id="camera-section" className={`bg-white rounded-xl shadow-lg p-6 ${isCameraActive ? "scanner-active" : ""}`}>
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Scan with Camera</h2>
            <div className="scanner-overlay mb-4">
              <video ref={videoRef} className="w-full h-64 bg-gray-200 rounded-lg object-cover" autoPlay playsInline></video>
              {isCameraActive && <div className="scanner-guide"></div>}
            </div>
            <div className="space-y-3">
              <button onClick={startCamera} disabled={isCameraActive} className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed">
                Start Camera
              </button>
              <button onClick={stopCamera} disabled={!isCameraActive} className="w-full bg-gray-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-gray-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed">
                Stop Camera
              </button>
            </div>
          </div>

          {/* Image Upload Scanner */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Upload QR Code Image</h2>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center mb-4">
              <input type="file" ref={fileInputRef} accept="image/*" className="" onChange={handleFileUpload} />
              <div className="mb-4"></div>
              <label htmlFor="file-input" className="cursor-pointer bg-blue-600 text-white py-2 px-6 rounded-lg font-medium hover:bg-blue-700 transition-colors inline-block">
                Choose Image
              </label>
              <p className="text-gray-500 mt-2">or drag & drop your file here</p>
            </div>
            {imagePreview && (
              <div className="mb-4">
                <Image src={imagePreview} className="w-full h-64 object-contain rounded-lg border" alt="QR code preview" />
              </div>
            )}
          </div>
        </div>

        {/* Results Section */}
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-semibold text-gray-800 mb-6">Scan Results</h2>
          <div className="space-y-4">
            {error ? (
              <div className="result-card bg-white rounded-xl shadow-lg p-6">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mr-4">
                    <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-800">Scan Failed</h3>
                </div>
                <p className="text-gray-600">{error}</p>
              </div>
            ) : scanResult ? (
              <div className="result-card bg-white rounded-xl shadow-lg p-6">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mr-4">
                    <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-800">QR Code Successfully Decoded</h3>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg mb-4">
                  <p className="text-gray-700 break-all">{scanResult}</p>
                </div>
                {isURL(scanResult) ? (
                  <div className="flex space-x-3">
                    <button onClick={() => openLink(scanResult)} className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                      Open Link
                    </button>
                    <button onClick={() => copyToClipboard(scanResult)} className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors">
                      Copy Text
                    </button>
                  </div>
                ) : (
                  <button onClick={() => copyToClipboard(scanResult)} className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                    Copy Text
                  </button>
                )}
              </div>
            ) : (
              <div className="bg-white rounded-xl shadow-lg p-6 text-center">
                <p className="text-gray-500">No QR code scanned yet. Use the camera or upload an image to get started.</p>
              </div>
            )}
          </div>
        </div>

        {/* How it works section */}
        <div className="max-w-4xl mx-auto mt-16">
          <h2 className="text-2xl font-semibold text-gray-800 mb-8 text-center">How It Works</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-white rounded-xl p-6 text-center shadow-lg">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"></path>
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"></path>
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">1. Choose Method</h3>
              <p className="text-gray-600">Select between camera scanning or image upload to read your QR code.</p>
            </div>
            <div className="bg-white rounded-xl p-6 text-center shadow-lg">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">2. Scan QR Code</h3>
              <p className="text-gray-600">Position your QR code clearly in view or upload a high-quality image.</p>
            </div>
            <div className="bg-white rounded-xl p-6 text-center shadow-lg">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">3. Get Results</h3>
              <p className="text-gray-600">Instantly view the decoded information from your QR code.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
