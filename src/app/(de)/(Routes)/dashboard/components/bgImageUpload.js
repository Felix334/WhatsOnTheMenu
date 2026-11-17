import { useRef, useState } from "react";
import { toast } from "sonner";
import { ImagePlus, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { MENU_IMAGE_MAX_BYTES, MENU_IMAGE_TYPES, MENU_IMAGE_MAX_EDGE } from "@/lib/schemas/menuImage";
import { useUiLanguage } from "@/app/components/useUiLanguage";

const toBlob = (canvas, type, quality) => new Promise((resolve) => canvas.toBlob(resolve, type, quality));

// Jedes Bild vor dem Upload im Browser verkleinern und komprimieren: spart
// Upload-Volumen (ein Handyfoto hat oft 3–8 MB) und hält das Upload-Limit ein.
// Die eigentliche Prüfung und das endgültige Neu-Kodieren macht der Server
// (api/user/profil/bgImage) — die Komprimierung hier ist nur eine Ersparnis.
async function compressImage(file, processError) {
  const bitmap = await createImageBitmap(file); // berücksichtigt die EXIF-Ausrichtung
  const scale = Math.min(1, MENU_IMAGE_MAX_EDGE / Math.max(bitmap.width, bitmap.height));
  const canvas = document.createElement("canvas");
  canvas.width = Math.round(bitmap.width * scale);
  canvas.height = Math.round(bitmap.height * scale);
  canvas.getContext("2d").drawImage(bitmap, 0, 0, canvas.width, canvas.height);
  bitmap.close();

  // Ältere Browser liefern bei "image/webp" stillschweigend PNG (viel größer) → dann JPEG.
  let blob = await toBlob(canvas, "image/webp", 0.85);
  if (!blob || blob.type !== "image/webp") blob = await toBlob(canvas, "image/jpeg", 0.85);
  if (!blob) throw new Error(processError);

  // Falls die Komprimierung nichts bringt (schon kleines Bild), das Original senden.
  return blob.size < file.size ? blob : file;
}

const BgImageUpload = ({ restaurantID, bgImageUrl, onChange }) => {
  const { t: uiDict } = useUiLanguage();
  const t = uiDict.dashboard;
  const tb = t.bgImage;
  const inputRef = useRef(null);
  const [busy, setBusy] = useState(false);
  const [confirmRemove, setConfirmRemove] = useState(false);

  const handleFile = async (e) => {
    const file = e.target.files?.[0];
    e.target.value = ""; // dieselbe Datei erneut auswählbar
    if (!file) return;

    if (!MENU_IMAGE_TYPES.includes(file.type)) {
      toast.error(tb.wrongType);
      return;
    }

    setBusy(true);
    try {
      const upload = await compressImage(file, tb.processError);
      if (upload.size > MENU_IMAGE_MAX_BYTES) throw new Error(tb.tooLarge);

      const body = new FormData();
      body.append("file", upload, "background");
      body.append("restaurantId", restaurantID);

      const res = await fetch("/api/user/profil/bgImage", { method: "POST", body, credentials: "include" });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.message || `HTTP ${res.status}`);

      onChange?.(data.bgImageUrl);
      toast.success(tb.saved);
    } catch (err) {
      toast.error(tb.uploadFailed + err.message);
    } finally {
      setBusy(false);
    }
  };

  const handleRemove = async () => {
    setConfirmRemove(false);
    setBusy(true);
    try {
      const res = await fetch("/api/user/profil/bgImage", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ restaurantId: restaurantID }),
        credentials: "include",
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.message || `HTTP ${res.status}`);

      onChange?.(null);
      toast.success(tb.removed);
    } catch (err) {
      toast.error(tb.removeFailed + err.message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="space-y-2">
      <Label>{tb.label}</Label>

      {bgImageUrl ? (
        <div className="h-28 w-full rounded-xl border bg-cover bg-center" style={{ backgroundImage: `url("${bgImageUrl}")` }} role="img" aria-label={tb.current} />
      ) : (
        <p className="text-xs text-gray-500">{tb.none}</p>
      )}

      <input ref={inputRef} type="file" accept={MENU_IMAGE_TYPES.join(",")} className="hidden" onChange={handleFile} />

      <div className="flex gap-2">
        <Button type="button" variant="outline" size="sm" disabled={busy || !restaurantID} onClick={() => inputRef.current?.click()}>
          <ImagePlus className="size-4" />
          {busy ? tb.uploading : bgImageUrl ? tb.replace : tb.upload}
        </Button>
        {bgImageUrl && (
          <Button type="button" variant="outline" size="sm" disabled={busy} onClick={() => setConfirmRemove(true)}>
            <Trash2 className="size-4" />
            {t.common.remove}
          </Button>
        )}
      </div>
      <p className="text-xs text-gray-500">{tb.hint}</p>

      <ConfirmDialog
        open={confirmRemove}
        onOpenChange={setConfirmRemove}
        title={tb.confirmTitle}
        description={tb.confirmText}
        confirmLabel={t.common.remove}
        onConfirm={handleRemove}
      />
    </div>
  );
};

export { BgImageUpload };
