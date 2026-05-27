"use client";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

/**
 * Wiederverwendbarer Bestätigungs-Dialog als Ersatz für window.confirm().
 *
 * Props:
 *   open          boolean   – ob der Dialog sichtbar ist
 *   onOpenChange  fn        – wird mit false aufgerufen wenn Dialog geschlossen wird
 *   title         string    – Überschrift
 *   description   string?   – optionaler Hinweistext
 *   onConfirm     fn        – wird aufgerufen wenn der User bestätigt
 *   confirmLabel  string?   – Text des Bestätigungs-Buttons (default: "Bestätigen")
 *   destructive   bool?     – roter Button für kritische Aktionen (default: true)
 */
export function ConfirmDialog({
  open,
  onOpenChange,
  title,
  description,
  onConfirm,
  confirmLabel = "Bestätigen",
  destructive = true,
}) {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          {description && (
            <AlertDialogDescription>{description}</AlertDialogDescription>
          )}
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Abbrechen</AlertDialogCancel>
          <AlertDialogAction
            onClick={onConfirm}
            className={
              destructive
                ? "bg-red-600 hover:bg-red-700 text-white"
                : undefined
            }
          >
            {confirmLabel}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
