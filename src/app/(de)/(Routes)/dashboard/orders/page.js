"use client";

import { useEffect, useState, useCallback } from "react";
import { useSession } from "next-auth/react";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { toast } from "sonner";
import { useUiLanguage } from "@/app/components/useUiLanguage";
import { localizedPath } from "@/i18n/config";
import { fmt } from "@/i18n/format";

// Status-Beschriftungen aus dashboard.orders.status
const STATUS_COLOR = {
  pending: "bg-amber-100 text-amber-800 border-amber-200",
  confirmed: "bg-blue-100 text-blue-800 border-blue-200",
};

function OrderCard({ order, onStatusChange }) {
  const to = useUiLanguage().t.dashboard.orders;
  const items = Array.isArray(order.items) ? order.items : [];
  const total = items.reduce((s, i) => s + i.price * i.quantity, 0);
  const age = Math.floor((Date.now() - new Date(order.createdAt)) / 60000);

  return (
    <div className={`bg-white rounded-2xl border shadow-sm p-5 space-y-3 ${order.status === "pending" ? "border-amber-300" : "border-gray-200"}`}>
      <div className="flex items-start justify-between gap-3">
        <div>
          <span className="text-lg font-semibold">{fmt(to.table, { table: order.tableNumber })}</span>
          <span className={`ml-3 text-xs font-medium px-2 py-0.5 rounded-full border ${STATUS_COLOR[order.status]}`}>{to.status[order.status]}</span>
        </div>
        <span className="text-xs text-gray-400 shrink-0">{age === 0 ? to.justNow : fmt(to.minutesAgo, { n: age })}</span>
      </div>

      <ul className="space-y-1 text-sm text-gray-700">
        {items.map((item, i) => (
          <li key={i} className="flex justify-between">
            <span>
              {item.quantity}× {item.name}
            </span>
            <span className="font-mono text-gray-500">{(item.price * item.quantity).toFixed(2)} €</span>
          </li>
        ))}
        <li className="flex justify-between font-semibold border-t pt-2 mt-2">
          <span>{to.total}</span>
          <span className="font-mono">{total.toFixed(2)} €</span>
        </li>
      </ul>

      {order.note && <p className="text-sm text-gray-500 italic bg-gray-50 rounded-xl px-3 py-2">📝 {order.note}</p>}

      <div className="flex gap-2 pt-1">
        {order.status === "pending" && (
          <button onClick={() => onStatusChange(order.id, "confirmed")} className="flex-1 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-xl py-2 transition-colors">
            {to.accept}
          </button>
        )}
        {(order.status === "pending" || order.status === "confirmed") && (
          <button onClick={() => onStatusChange(order.id, "done")} className="flex-1 bg-gray-900 hover:bg-gray-700 text-white text-sm font-semibold rounded-xl py-2 transition-colors">
            {to.done}
          </button>
        )}
      </div>
    </div>
  );
}

function BestellungenContent() {
  const searchParams = useSearchParams();
  const restaurantID = searchParams.get("restaurantID");
  const { t: uiDict, locale } = useUiLanguage();
  const to = uiDict.dashboard.orders;

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const { data: session, status } = useSession();

  const fetchOrders = useCallback(async () => {
    if (!restaurantID) return;
    try {
      const res = await fetch(`/api/orders/list/${restaurantID}`);
      if (res.ok) {
        const data = await res.json();
        setOrders(data.orders);
      }
    } finally {
      setLoading(false);
    }
  }, [restaurantID]);

  useEffect(() => {
    if (!session || session.user.subscription !== "Professional") return;
    fetchOrders();
    // Nur pollen, wenn der Tab sichtbar ist — spart Edge-Requests bei Hintergrund-Tabs
    const interval = setInterval(() => {
      if (document.visibilityState === "visible") fetchOrders();
    }, 30000);
    const onVisibilityChange = () => {
      if (document.visibilityState === "visible") fetchOrders();
    };
    document.addEventListener("visibilitychange", onVisibilityChange);
    return () => {
      clearInterval(interval);
      document.removeEventListener("visibilitychange", onVisibilityChange);
    };
  }, [fetchOrders, session]);

  if (!session) {
    return <div className="min-h-screen flex items-center justify-center text-gray-500">{to.noAccess}</div>;
  }

  if (session.user.subscription !== "Professional") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-8 max-w-md w-full text-center space-y-4">
          <p className="text-4xl">🔒</p>
          <h2 className="text-xl font-bold text-gray-900">{to.premiumRequired}</h2>
          <p className="text-gray-500 text-sm">{to.premiumText}</p>
          <a href={localizedPath("/pricing", locale)} className="inline-block bg-gray-900 hover:bg-gray-700 text-white font-semibold text-sm px-6 py-2.5 rounded-xl transition-colors">
            {to.upgrade}
          </a>
        </div>
      </div>
    );
  }

  if (status === "loading" || loading) {
    return <div className="min-h-screen flex items-center justify-center text-gray-500">{to.loading}</div>;
  }

  const handleStatusChange = async (orderId, newStatus) => {
    const res = await fetch(`/api/orders/${orderId}/status`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: newStatus }),
    });
    if (res.ok) {
      if (newStatus === "done") {
        setOrders((prev) => prev.filter((o) => o.id !== orderId));
        toast.success(to.completed);
      } else {
        setOrders((prev) => prev.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o)));
        toast.success(to.statusUpdated);
      }
    } else {
      toast.error(to.updateError);
    }
  };

  const pending = orders.filter((o) => o.status === "pending");
  const confirmed = orders.filter((o) => o.status === "confirmed");
  if (session.user.subscription === "Professional") {
    return (
      <div className="min-h-screen bg-gray-50 p-4 sm:p-8">
        <div className="max-w-2xl mx-auto space-y-6">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold">{to.title}</h1>
            <button onClick={fetchOrders} className="text-sm text-gray-500 hover:text-gray-800 border border-gray-200 rounded-xl px-3 py-1.5 bg-white transition-colors">
              {to.refresh}
            </button>
          </div>

          {orders.length === 0 ? (
            <div className="text-center py-20 text-gray-400">
              <p className="text-4xl mb-3">🍽️</p>
              <p className="font-medium">{to.empty}</p>
              <p className="text-sm mt-1">{to.autoRefresh}</p>
            </div>
          ) : (
            <>
              {pending.length > 0 && (
                <div className="space-y-3">
                  <h2 className="text-sm font-semibold text-amber-700 uppercase tracking-wide">{to.status.pending} ({pending.length})</h2>
                  {pending.map((o) => (
                    <OrderCard key={o.id} order={o} onStatusChange={handleStatusChange} />
                  ))}
                </div>
              )}
              {confirmed.length > 0 && (
                <div className="space-y-3">
                  <h2 className="text-sm font-semibold text-blue-700 uppercase tracking-wide">{to.status.confirmed} ({confirmed.length})</h2>
                  {confirmed.map((o) => (
                    <OrderCard key={o.id} order={o} onStatusChange={handleStatusChange} />
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    );
  }
}

export default function Bestellungen() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">…</div>}>
      <BestellungenContent />
    </Suspense>
  );
}
