"use client";

import { Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";

// Hängt den aktuellen Query-String (z. B. ?userID=...) an das Ziel an, damit
// die userID beim Navigieren nicht aus der URL verschwindet.
function DynamicButton({ href, children, className, variant, size }) {
  const searchParams = useSearchParams();
  const qs = searchParams.toString();
  const fullHref = qs ? `${href}?${qs}` : href;
  return (
    <Button asChild className={className} variant={variant} size={size}>
      <Link href={fullHref}>{children}</Link>
    </Button>
  );
}

// Button-Link, der den Query-String beibehält. In Suspense gewickelt, damit
// er auch in Server-Komponenten (z. B. Seiten mit metadata-Export) nutzbar ist,
// ohne die ganze Seite ins Client-Rendering zu zwingen. Der Fallback rendert
// denselben Link ohne Query-String (greift nur ganz kurz vor der Hydration).
export function DynamicLinkButton({ href, children, className, variant, size }) {
  return (
    <Suspense
      fallback={
        <Button asChild className={className} variant={variant} size={size}>
          <Link href={href}>{children}</Link>
        </Button>
      }
    >
      <DynamicButton href={href} className={className} variant={variant} size={size}>
        {children}
      </DynamicButton>
    </Suspense>
  );
}

function DynamicAnchor({ href, children, className }) {
  const searchParams = useSearchParams();
  const qs = searchParams.toString();
  const fullHref = qs ? `${href}?${qs}` : href;
  return (
    <Link href={fullHref} className={className}>
      {children}
    </Link>
  );
}

// Schlichter Text-Link (ohne Button), der den Query-String beibehält.
export function DynamicLink({ href, children, className }) {
  return (
    <Suspense fallback={<Link href={href} className={className}>{children}</Link>}>
      <DynamicAnchor href={href} className={className}>
        {children}
      </DynamicAnchor>
    </Suspense>
  );
}
