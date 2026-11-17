import "server-only";
import { createClient } from "@supabase/supabase-js";

// Supabase wird nur serverseitig für Storage genutzt. Die Nutzer melden sich über
// NextAuth an, nicht über Supabase Auth — für Supabase ist deshalb jeder Browser
// anonym. Darum gibt es im Bucket KEINE Schreibregeln für anon/authenticated,
// und jeder Schreibzugriff läuft über unsere API-Routen mit dem Service-Role-Key.
//
// Der Service-Role-Key umgeht alle Storage-Regeln: nie mit NEXT_PUBLIC_ benennen,
// diese Datei nie in Client-Komponenten importieren ("server-only" bricht dann den Build).

const supabaseUrl = process.env.SUPABASE_API_URL?.replace(/\/$/, "");
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

// null, wenn die Variablen fehlen — der Build läuft trotzdem, Uploads antworten mit 503.
export const supabaseAdmin =
  supabaseUrl && serviceRoleKey
    ? createClient(supabaseUrl, serviceRoleKey, { auth: { persistSession: false, autoRefreshToken: false } })
    : null;

// Öffentliche URL einer Datei in einem öffentlichen Bucket. In der DB steht nur der Pfad.
export function storagePublicUrl(bucket, path) {
  if (!path || !supabaseUrl) return null;
  return `${supabaseUrl}/storage/v1/object/public/${bucket}/${path}`;
}

// Löscht Dateien; Fehler werden nur geloggt, damit das Aufräumen alter Bilder
// nie die eigentliche Aktion (Speichern, Konto löschen) scheitern lässt.
export async function removeStorageFiles(bucket, paths) {
  if (!supabaseAdmin || paths.length === 0) return;
  const { error } = await supabaseAdmin.storage.from(bucket).remove(paths);
  if (error) console.error(`Storage cleanup failed (${bucket}):`, error.message);
}

// Alle Dateien direkt in einem Ordner löschen (nicht rekursiv).
export async function removeStorageFolder(bucket, folder) {
  if (!supabaseAdmin) return;
  const { data, error } = await supabaseAdmin.storage.from(bucket).list(folder, { limit: 1000 });
  if (error) {
    console.error(`Storage list failed (${bucket}/${folder}):`, error.message);
    return;
  }
  await removeStorageFiles(bucket, (data ?? []).filter((f) => f.id).map((f) => `${folder}/${f.name}`));
}
