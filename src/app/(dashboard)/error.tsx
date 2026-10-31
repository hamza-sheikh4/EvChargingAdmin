"use client";

import { useEffect } from "react";
import { ErrorState } from "@/components/shared/error-state";
import { errorCopy } from "@/content/layout";
import { reportError } from "@/services/telemetry";

/** A page that failed to render: reported to the Health page as a crash, with a retry. */
export default function DashboardError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    reportError("crash", error);
  }, [error]);
  return <ErrorState message={errorCopy.crashed} onRetry={reset} />;
}
