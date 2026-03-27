"use client";
import { useEffect, useState } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { useSession } from "next-auth/react";

export default function UpdateUserIDInURL() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [updated, setUpdated] = useState(false);

  useEffect(() => {
    if (status === "authenticated" && session?.user?.id && !updated) {
      const newSearchParams = new URLSearchParams(searchParams.toString());
      newSearchParams.set("userID", session.user.id); // userID in URL einfügen
      const newUrl = `${pathname}?${newSearchParams.toString()}`;
      router.replace(newUrl); // URL ohne Reload ersetzen
      setUpdated(true);
    }
  }, [status, session, pathname, searchParams, router, updated]);

  return null;
}