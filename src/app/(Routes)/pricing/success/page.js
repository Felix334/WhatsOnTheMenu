"use client";
export const dynamic = "force-dynamic";
import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export default function SuccessPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { data: session } = useSession();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const sessionId = searchParams.get("session_id");

    /*const approveRequest = async () => {
      if (!sessionId || !session?.user?.id) return;

      try {
        const req = await fetch("/api/payment/webhook", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            userID: session.user.id,
            stripeID: sessionId,
          }),
        });
        if (!req.ok) {
          console.error("Approve request failed");
        }
      } catch (err) {
        console.error("Approve error:", err);
      }
    };*/
    if (sessionId) {
      console.log("Stripe session ID:", sessionId);
      //approveRequest();
    }
    setLoading(false);
  }, [searchParams]);

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
            <div className="w-24 h-24 bg-green-100 rounded-full mx-auto mb-6 flex items-center justify-center">
              <svg className="w-12 h-12 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Zahlung erfolgreich!</h1>
            <p className="text-lg text-gray-600 mb-8">Dein {tier} Abonnement ist aktiviert. Dein Restaurant wurde automatisch erstellt und ist sofort verfügbar!</p>
            <Button onClick={() => router.push("/")} size="lg" className="w-full bg-green-600 hover:bg-green-700">
              Zurück
            </Button>
            <Button variant="link" onClick={() => router.push("/(Routes)/pricing")} className="mt-4">
              Tarife ansehen
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
}
