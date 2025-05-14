"use client"
import { useState } from "react"
import { BarcodeScanner } from "../../components/QR-CodeScanner.mjs"

export default function Page(){
  return (
    <div>
      <BarcodeScanner />
    </div>
  )
}