import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Script from "next/script";
import CookieBanner from "./components/cookieWin";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import Providers from "./components/Providers.js";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "What's On The Menu",
  description: "Discover and explore restaurant menus easily",
  manifest: "/manifest.json",
  icons: {
    icon: "/favicon.ico",
  },
  viewport: {
    width: "device-width",
    initialScale: 1,
  },
  robots: {
    index: true,
    follow: true,
  },
  fonts: {
    google: [
      {
        family: "Poppins",
        weights: ["400", "600", "700"],
      },
    ],
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <Providers>
          {children}
          <Analytics />
          <Script async strategy="afterInteractive" src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-4153577229204032" crossOrigin="anonymous" />
          <SpeedInsights />
          <CookieBanner />
        </Providers>
      </body>
    </html>
  );
}
