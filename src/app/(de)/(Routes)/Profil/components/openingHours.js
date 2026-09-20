"use client";

import React, { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardHeader, CardContent } from "@/components/ui/card";

const DAYS = [
  { key: "monday",    label: "Montag" },
  { key: "tuesday",   label: "Dienstag" },
  { key: "wednesday", label: "Mittwoch" },
  { key: "thursday",  label: "Donnerstag" },
  { key: "friday",    label: "Freitag" },
  { key: "saturday",  label: "Samstag" },
  { key: "sunday",    label: "Sonntag" },
];

const DEFAULT_HOURS = {
  monday:    { open: "09:00", close: "22:00", closed: false },
  tuesday:   { open: "09:00", close: "22:00", closed: false },
  wednesday: { open: "09:00", close: "22:00", closed: false },
  thursday:  { open: "09:00", close: "22:00", closed: false },
  friday:    { open: "09:00", close: "23:00", closed: false },
  saturday:  { open: "10:00", close: "23:00", closed: false },
  sunday:    { open: "10:00", close: "20:00", closed: false },
};

/**
 * Öffnungszeiten-Editor
 * Props:
 *   restaurantId  string
 *   userID        string
 *   initialHours  object|null  – gespeicherte Öffnungszeiten aus der DB
 */
const OpeningHoursEditor = ({ restaurantId, userID, initialHours }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [hours, setHours] = useState(
    initialHours && Object.keys(initialHours).length > 0
      ? initialHours
      : DEFAULT_HOURS
  );
  const [isSaving, setIsSaving] = useState(false);

  const updateDay = (dayKey, field, value) => {
    setHours((prev) => ({
      ...prev,
      [dayKey]: { ...prev[dayKey], [field]: value },
    }));
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const resp = await fetch("/api/user/profil/updateRestaurant", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          restaurant: { id: restaurantId, openingHours: hours },
          locations: [],
          userID,
        }),
      });

      if (!resp.ok) throw new Error("Fehler beim Speichern");

      toast.success("Öffnungszeiten gespeichert!");
      setIsEditing(false);
    } catch (err) {
      toast.error("Fehler: " + err.message);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <h2 className="text-xl font-semibold">Öffnungszeiten</h2>
      </CardHeader>
      <CardContent>
        {isEditing ? (
          <div className="space-y-3">
            {DAYS.map(({ key, label }) => {
              const day = hours[key] ?? { open: "09:00", close: "22:00", closed: false };
              return (
                <div key={key} className="flex items-center gap-3 flex-wrap">
                  <span className="w-28 text-sm font-medium">{label}</span>

                  <div className="flex items-center gap-1">
                    <Checkbox
                      id={`closed-${key}`}
                      checked={!!day.closed}
                      onCheckedChange={(v) => updateDay(key, "closed", !!v)}
                    />
                    <Label htmlFor={`closed-${key}`} className="text-sm text-gray-500 cursor-pointer">
                      Geschlossen
                    </Label>
                  </div>

                  {!day.closed && (
                    <>
                      <div className="flex items-center gap-1">
                        <Label className="text-xs text-gray-500">Von</Label>
                        <Input
                          type="time"
                          value={day.open}
                          onChange={(e) => updateDay(key, "open", e.target.value)}
                          className="w-28 text-sm"
                        />
                      </div>
                      <div className="flex items-center gap-1">
                        <Label className="text-xs text-gray-500">Bis</Label>
                        <Input
                          type="time"
                          value={day.close}
                          onChange={(e) => updateDay(key, "close", e.target.value)}
                          className="w-28 text-sm"
                        />
                      </div>
                    </>
                  )}
                </div>
              );
            })}

            <div className="flex gap-2 pt-2">
              <Button onClick={handleSave} disabled={isSaving} size="sm">
                {isSaving ? "Speichert..." : "Speichern"}
              </Button>
              <Button variant="outline" size="sm" onClick={() => setIsEditing(false)}>
                Abbrechen
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-1">
            {DAYS.map(({ key, label }) => {
              const day = hours[key];
              if (!day) return null;
              return (
                <div key={key} className="flex gap-4 text-sm">
                  <span className="w-28 font-medium">{label}</span>
                  {day.closed ? (
                    <span className="text-gray-400">Geschlossen</span>
                  ) : (
                    <span className="text-gray-700">
                      {day.open} – {day.close} Uhr
                    </span>
                  )}
                </div>
              );
            })}
            <Button
              onClick={() => setIsEditing(true)}
              variant="outline"
              size="sm"
              className="mt-3"
            >
              Bearbeiten
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export { OpeningHoursEditor, DAYS, DEFAULT_HOURS };
