"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useAdminSession } from "@/hooks/use-admin-session";
import { usePreferences } from "@/lib/preferences";

/** On the sign-in screen: an admin who is already signed in goes straight to their start page. */
export function SignedInRedirect() {
  const session = useAdminSession();
  const { landingPage } = usePreferences();
  const router = useRouter();

  useEffect(() => {
    if (session.status === "ready") router.replace(landingPage);
  }, [session.status, landingPage, router]);

  return null;
}
