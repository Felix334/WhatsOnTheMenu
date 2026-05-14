"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";

import { Button } from "@/components/ui/button";

export default function Home({ renderLogin, userID, role }) {
  const [isLoading, setIsLoading] = useState(false);
  const [loginSuccess, setLoginSuccess] = useState(false);
  const [error, setError] = useState("");
  const [userIP, setUserIP] = useState("");
  const router = useRouter();

  // 🟢 IP Fetching
  useEffect(() => {
    const getIP = async () => {
      try {
        const response = await fetch("https://api.ipify.org?format=json");
        const data = await response.json();
        setUserIP(data.ip);
      } catch (error) {
        console.error("Error fetching IP:", error);
      }
    };
    getIP();
  }, []);

  // 🟢 Google Login Handler
  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    setError("");

    try {
      const result = await signIn("google", { redirect: false });
      if (result?.url) {
        window.location.replace(result.url);
      }
    } catch (err) {
      console.error("Google SignIn error:", err);
      setError("Google Login fehlgeschlagen.");
    } finally {
      setIsLoading(false);
    }
  };

  // 🟢 Loading Screen
  if (isLoading) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-gradient-to-br from-rose-900 via-amber-900 to-orange-900">
        <div className="animate-spin rounded-full h-16 w-16 border-4 border-orange-400 border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="min-h-screen w-screen relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0" onClick={() => {renderLogin(false)}}>
        <div className="absolute inset-0 bg-gradient-to-r from-rose-500/30 via-orange-500/40 to-amber-500/60 " />
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-rose-500/10 rounded-full blur-3xl animate-pulse delay-1000" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-orange-500/10 rounded-full blur-3xl animate-pulse delay-2000" />
      </div>

      {/* Success Popup */}
      {loginSuccess && (
        <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
          <div className="bg-gradient-to-br from-emerald-600 to-emerald-700 text-white p-8 rounded-2xl shadow-2xl text-center max-w-md mx-4 transform scale-105 animate-pulse">
            <div className="text-5xl mb-4">✅</div>
            <h2 className="text-2xl font-bold mb-2">Login erfolgreich!</h2>
            <p className="text-lg opacity-90">Willkommen zurück!</p>
          </div>
        </div>
      )}

      {/* Main Login Card */}
      <div className="relative z-10 max-w-sm mx-auto p-8 bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl shadow-2xl mt-24">
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-gradient-to-r from-rose-500 via-orange-500 to-amber-500 rounded-2xl mx-auto mb-4 flex items-center justify-center shadow-xl">
            <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={20} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-orange-100 via-amber-100 to-rose-100 bg-clip-text text-transparent mb-2">Google Login</h1>
          <p className="text-orange-200/80 text-sm">Mit Google anmelden</p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-rose-500/15 border border-rose-500/30 text-rose-100 rounded-2xl backdrop-blur-sm">
            <div className="flex items-center">
              <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
              {error}
            </div>
          </div>
        )}

        {/* Google Login Button */}
        <Button type="button" onClick={handleGoogleSignIn} className="w-full h-14 bg-gradient-to-r from-rose-600 via-orange-500 to-amber-500 hover:from-rose-700 hover:via-orange-600 hover:to-amber-600 text-white font-semibold rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 border-0 text-lg" disabled={isLoading}>
          <svg className="w-6 h-6 mr-3" viewBox="0 0 24 24">
            <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
            <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
            <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
            <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
          </svg>
          Mit Google anmelden
        </Button>

        {/* Footer */}
        <div className="mt-8 pt-6 border-t border-white/10 text-center"></div>
      </div>
    </div>
  );
}
