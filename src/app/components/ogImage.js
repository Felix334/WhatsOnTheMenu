import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";

// Gemeinsames Vorschaubild (og:image) fuer alle Sprachen — wird von
// src/app/(de)/opengraph-image.js und src/app/(intl)/[locale]/opengraph-image.js
// genutzt. Die Dateien selbst muessen size/contentType/alt direkt exportieren
// (Next liest diese Werte statisch aus), deshalb steht hier nur das Rendern.
//
// Entsteht beim Build einmal pro Sprache als statisches PNG — kostet zur
// Laufzeit nichts.

export const OG_SIZE = { width: 1200, height: 630 };

export async function renderOgImage({ title, subtitle }) {
  const icon = await readFile(join(process.cwd(), "public/icon-512.png"));
  const iconSrc = `data:image/png;base64,${icon.toString("base64")}`;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "72px 80px",
          background: "linear-gradient(135deg, #7f1d1d 0%, #030712 100%)",
          color: "white",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 24 }}>
          {/* eslint-disable-next-line @next/next/no-img-element -- ImageResponse kennt kein next/image */}
          <img src={iconSrc} width={88} height={88} alt="" style={{ borderRadius: 20 }} />
          <div style={{ fontSize: 40, fontWeight: 700, letterSpacing: 1 }}>WhatIsOnMyMenu</div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          <div style={{ fontSize: 68, fontWeight: 700, lineHeight: 1.1, maxWidth: 1000 }}>{title}</div>
          <div style={{ fontSize: 32, color: "rgba(255,255,255,0.75)", maxWidth: 960 }}>{subtitle}</div>
        </div>

        <div style={{ fontSize: 28, color: "rgba(255,255,255,0.6)" }}>www.whatisonmymenu.com</div>
      </div>
    ),
    OG_SIZE
  );
}
