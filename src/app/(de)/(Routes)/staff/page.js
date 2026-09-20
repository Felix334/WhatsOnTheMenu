"use client";

import { useSession } from "next-auth/react";
import Link from "next/link";
import { Suspense } from "react";
import { useUiLanguage } from "@/app/components/useUiLanguage";
import UiLanguageSwitcher from "@/app/components/UiLanguageSwitcher";

const ROLE_COLORS = {
  manager: "bg-purple-100 text-purple-800 border-purple-200",
  waiter: "bg-blue-100 text-blue-800 border-blue-200",
  kitchen: "bg-orange-100 text-orange-800 border-orange-200",
};

function StaffDashboardContent() {
  const { data: session, status } = useSession();
  const { t } = useUiLanguage();
  const tc = t.staff.common;
  const td = t.staff.dashboard;
  const roleLabels = t.staff.roles;

  if (status === "loading") {
    return <div className="min-h-screen flex items-center justify-center text-gray-500">{tc.loading}</div>;
  }

  if (!session) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="text-center space-y-2">
          <p className="text-2xl">🔒</p>
          <p className="font-semibold">{tc.signInRequired}</p>
        </div>
      </div>
    );
  }

  const memberships = session.user?.staffMemberships ?? [];
  const isOwner = session.user.role === "Owner";
  const restaurantId = session.user.restaurantId;
  const userID = session.user.id

  if (!isOwner && memberships.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="text-center space-y-3 max-w-sm">
          <p className="text-4xl">👋</p>
          <p className="font-semibold text-gray-800 text-lg">{td.noRestaurantAssigned}</p>
          <p className="text-sm text-gray-500">{td.noRestaurantAssignedHint}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="max-w-md mx-auto space-y-6">
        <div className="text-center">
          <p className="text-sm text-gray-500">{td.welcome}</p>
          <h1 className="text-2xl font-bold text-gray-900">{session.user.name}</h1>
          <div className="mt-2 flex justify-center">
            <UiLanguageSwitcher />
          </div>
        </div>

        <div className="space-y-3">
          {/* Owner-Karte */}
          {isOwner && restaurantId && (
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-5 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold px-3 py-1 rounded-full border bg-green-100 text-green-800 border-green-200">{roleLabels.owner}</span>
              </div>
              <div className="space-y-2">
                <Link href={{ pathname: "/staff/bestellungen", query: { restaurantID: restaurantId, userID: userID } }} className="flex items-center gap-3 w-full bg-gray-900 hover:bg-gray-700 text-white font-semibold rounded-xl px-4 py-3 transition-colors">
                  <span className="text-xl">🍽️</span>
                  <span>{td.orders}</span>
                </Link>
                <Link href={{ pathname: "/staff/availability", query: { restaurantID: restaurantId, userID: userID } }} className="flex items-center gap-3 w-full bg-orange-600 hover:bg-orange-700 text-white font-semibold rounded-xl px-4 py-3 transition-colors">
                  <span className="text-xl">🧑‍🍳</span>
                  <span>{td.availability}</span>
                </Link>
                <Link href={{ pathname: "/staff/calendar", query: { restaurantID: restaurantId, userID: userID } }} className="flex items-center gap-3 w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-xl px-4 py-3 transition-colors">
                  <span className="text-xl">📅</span>
                  <span>{td.calendar}</span>
                </Link>
              </div>
            </div>
          )}

          {/* Staff-Karten */}
          {memberships.map((m) => (
            <div key={m.restaurantId} className="bg-white rounded-2xl border border-gray-200 shadow-sm p-5 space-y-4">
              <div className="flex items-center justify-between">
                <span className={`text-sm font-semibold px-3 py-1 rounded-full border ${ROLE_COLORS[m.role] ?? ""}`}>{roleLabels[m.role] ?? m.role}</span>
              </div>
              <div className="space-y-2">
                <Link href={{ pathname: "/staff/bestellungen", query: { restaurantID: m.restaurantId, userID: userID } }} className="flex items-center gap-3 w-full bg-gray-900 hover:bg-gray-700 text-white font-semibold rounded-xl px-4 py-3 transition-colors">
                  <span className="text-xl">🍽️</span>
                  <span>{td.orders}</span>
                </Link>
                {(m.role === "kitchen" || m.role === "manager") && (
                  <Link href={{ pathname: "/staff/availability", query: { restaurantID: m.restaurantId, userID: userID } }} className="flex items-center gap-3 w-full bg-orange-600 hover:bg-orange-700 text-white font-semibold rounded-xl px-4 py-3 transition-colors">
                    <span className="text-xl">🧑‍🍳</span>
                    <span>{td.availability}</span>
                  </Link>
                )}
                {m.role === "manager" && (
                  <Link href={{ pathname: "/staff/calendar", query: { restaurantID: m.restaurantId, userID: userID } }} className="flex items-center gap-3 w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-xl px-4 py-3 transition-colors">
                    <span className="text-xl">📅</span>
                    <span>{td.calendar}</span>
                  </Link>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function StaffDashboard() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center" />}>
      <StaffDashboardContent />
    </Suspense>
  );
}
