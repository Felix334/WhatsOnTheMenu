import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import CookieBanner from "./components/cookieWin";
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
    width: 'device-width',
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
  }
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Providers>
          {children}
          <CookieBanner />
        </Providers>
      </body>
    </html>
  );
}