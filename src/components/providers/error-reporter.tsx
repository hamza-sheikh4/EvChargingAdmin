"use client";

import { useEffect } from "react";
import { reportError } from "@/services/telemetry";

/**
 * Sends the admin site's own uncaught errors and rejected promises to the Health page.
 * Mounted once in Providers. Renders nothing.
 */
export function ErrorReporter() {
  useEffect(() => {
    const onError = (event: ErrorEvent) => reportError("error", event.error ?? event.message);
    const onRejection = (event: PromiseRejectionEvent) => reportError("error", event.reason);
    window.addEventListener("error", onError);
    window.addEventListener("unhandledrejection", onRejection);
    return () => {
      window.removeEventListener("error", onError);
      window.removeEventListener("unhandledrejection", onRejection);
    };
  }, []);
  return null;
}
