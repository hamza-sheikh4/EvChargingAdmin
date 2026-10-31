"use client";

import { useRouter } from "next/navigation";
import { useEffect, type ReactNode } from "react";
import { useAdminSession } from "@/hooks/use-admin-session";

/**
 * Every dashboard page sits behind this. Signed out (no cookie, expired, suspended) goes to /login.
 * The backend checks the login on every /admin call anyway; this only keeps people off empty pages.
 */
export function AuthGuard({ children }: { children: ReactNode }) {
  const session = useAdminSession();
  const router = useRouter();

  useEffect(() => {
    if (session.status === "signed-out") router.replace("/login");
  }, [session.status, router]);

  if (session.status === "signed-out") return null;
  return children;
}
