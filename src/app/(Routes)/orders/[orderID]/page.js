"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useParams } from "next/navigation";

export default function OrderView() {
  const { data: session, status } = useSession();
  const { orderID } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    if (status !== "authenticated") return;
    fetch(`/api/orders/${orderID}`)
      .then((r) => r.json())
      .then((d) => setOrder(d.order))
      .finally(() => setLoading(false));
  }, [orderID, status]);

  const markDone = async () => {
    setUpdating(true);
    await fetch(`/api/orders/${orderID}/status`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: "done" }),
    });
    setOrder((o) => ({ ...o, status: "done" }));
    setUpdating(false);
  };

  if (status === "loading" || loading) {
    return <div className="min-h-screen flex items-center justify-center text-gray-500">Laden...</div>;
  }

  if (!session || !["Owner", "Staff"].includes(session.user?.role)) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="text-center space-y-2">
          <p className="text-2xl">🔒</p>
          <p className="font-semibold text-gray-800">Nur für Mitarbeiter</p>
          <p className="text-sm text-gray-500">Bitte mit dem Restaurant-Account einloggen</p>
        </div>
      </div>
    );
  }

  if (!order) {
    return <div className="min-h-screen flex items-center justify-center text-gray-500">Bestellung nicht gefunden</div>;
  }

  const items = Array.isArray(order.items) ? order.items : [];
  const total = items.reduce((s, i) => s + i.price * i.quantity, 0);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm p-6 space-y-4">
        <div className="text-center">
          <p className="text-sm text-gray-500 uppercase tracking-widest">Bestellung</p>
          <h1 className="text-3xl font-bold mt-1">Tisch {order.tableNumber}</h1>
        </div>

        <ul className="space-y-2 text-sm border rounded-xl p-4 bg-gray-50">
          {items.map((item, i) => (
            <li key={i} className="flex justify-between">
              <span>{item.quantity}× {item.name}</span>
              <span className="font-mono text-gray-600">{(item.price * item.quantity).toFixed(2)} €</span>
            </li>
          ))}
          <li className="flex justify-between font-semibold border-t pt-2 mt-2">
            <span>Gesamt</span>
            <span className="font-mono">{total.toFixed(2)} €</span>
          </li>
        </ul>

        {order.note && (
          <p className="text-sm text-gray-500 italic bg-gray-50 rounded-xl px-3 py-2">📝 {order.note}</p>
        )}

        {order.status === "done" ? (
          <div className="text-center py-3 text-green-600 font-semibold">✓ Erledigt</div>
        ) : (
          <button
            onClick={markDone}
            disabled={updating}
            className="w-full bg-gray-900 hover:bg-gray-700 text-white font-semibold rounded-xl py-3 transition-colors disabled:opacity-50"
          >
            {updating ? "..." : "Als erledigt markieren ✓"}
          </button>
        )}
      </div>
    </div>
  );
}
