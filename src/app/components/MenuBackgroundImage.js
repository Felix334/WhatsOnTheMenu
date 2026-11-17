"use client";

import { useEffect, useState } from "react";
import { smallVariantPath } from "@/lib/schemas/menuImage";

// Hintergrundbild der Speisekarte, das beim Scrollen stehen bleibt.
// Kein `background-attachment: fixed` — das ignoriert iOS Safari und zieht das
// Bild dann über die ganze (lange) Seite. Stattdessen eine feststehende Ebene
// (position: fixed). Höhe `lvh` (größter Viewport) statt inset-0/100dvh: sonst
// ändert sich die Höhe, wenn die Adressleiste am Handy ein-/ausfährt, und
// `bg-cover` skaliert das Bild beim Scrollen sichtbar um.
//
// Die Ebene muss das ERSTE Kind des äußersten Seiten-Wrappers sein, und alles
// darin, das undurchsichtig ist (z. B. ein Bereich mit Hintergrundfarbe), verdeckt
// das Bild — die Hintergrundfarbe gehört dann auf denselben Wrapper.
//
// Zwei Ebenen: Handy-Fassung (<uuid>-sm.webp) unter `md` (768 px), Desktop-Fassung
// ab `md`. Browser laden Hintergrundbilder von Elementen mit display:none nicht —
// jedes Gerät lädt also nur eine Fassung.
//
// Das Elternelement braucht `isolate`: Erst damit liegt die Ebene (-z-10) über
// der Hintergrundfarbe des Elternelements und unter dem gesamten Inhalt.
const LAYER = "fixed inset-x-0 top-0 -z-10 h-lvh bg-cover bg-center bg-no-repeat pointer-events-none";

const MOBILE_QUERY = "(max-width: 767.98px)";

const bg = (url) => ({ backgroundImage: `url(${JSON.stringify(url)})` });

export function MenuBackgroundImage({ url }) {
  const smallUrl = smallVariantPath(url);
  const [smallMissing, setSmallMissing] = useState(false);

  // Fehlt die Handy-Fassung (z. B. Bild von vor Einführung der zwei Fassungen),
  // auf die große Fassung zurückfallen statt gar kein Bild zu zeigen. Nur auf
  // kleinen Bildschirmen prüfen; die Prüfung lädt dieselbe URL wie das CSS,
  // kommt also aus dem Cache und kostet keinen zusätzlichen Traffic.
  useEffect(() => {
    setSmallMissing(false);
    if (!smallUrl || !window.matchMedia(MOBILE_QUERY).matches) return;
    const probe = new Image();
    probe.onerror = () => setSmallMissing(true);
    probe.src = smallUrl;
    return () => {
      probe.onerror = null;
    };
  }, [smallUrl]);

  if (!url) return null;
  return (
    <>
      <div aria-hidden="true" className={`${LAYER} md:hidden`} style={bg(smallMissing ? url : smallUrl)} />
      <div aria-hidden="true" className={`${LAYER} hidden md:block`} style={bg(url)} />
    </>
  );
}
