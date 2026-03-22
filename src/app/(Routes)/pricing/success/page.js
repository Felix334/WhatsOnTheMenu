"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function SuccessClient({ searchParams }) {
  const router = useRouter();
  const { data: session } = useSession();

  const [loading, setLoading] = useState(true);

  const sessionId = searchParams?.session_id

  useEffect(() => {
    if (sessionId) {
      console.log("Stripe session ID:", sessionId);
    }

    setLoading(false);
  }, [sessionId]);


  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Verifiziere Zahlung...</div>
      </div>
    );
  }

  const tier = session?.user?.subscription || "Premium";

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 py-20">
      <div className="max-w-md mx-auto px-4">
        <Card className="shadow-2xl border-green-200">
          <div className="p-8 text-center">
            <h1 className="text-3xl font-bold">Zahlung erfolgreich!</h1>

            <p className="mt-4 text-gray-600">
              Dein {tier} Abonnement ist aktiv
            </p>

            <Button
              className="mt-6 w-full"
              onClick={() => router.push("/")}
            >
              Zurück
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
}