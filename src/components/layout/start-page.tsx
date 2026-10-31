"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";
import { usePreferences } from "@/lib/preferences";

const startedKey = "admin-started";

/**
 * Settings > General > Start page. Once per browser tab, opening the panel at the
 * overview moves to the chosen section. Later visits to the overview stay put.
 */
export function StartPage() {
  const { landingPage } = usePreferences();
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    try {
      if (sessionStorage.getItem(startedKey)) return;
      sessionStorage.setItem(startedKey, "1");
    } catch {
      return;
    }
    if (pathname === "/" && landingPage !== "/") router.replace(landingPage);
    // Only the first render of the tab decides.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return null;
}
