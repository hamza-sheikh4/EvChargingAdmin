/**
 * Reports the admin site's own errors to the Health page. Plain fetch, not the API client,
 * so a failing network cannot report about itself in a loop. At most one report per message
 * a minute, so a render loop cannot flood the log. The backend scrubs personal data.
 */
import { environment } from "@/config/environment";

const EVERY_MS = 60_000;
const sentAt = new Map<string, number>();

export function reportError(type: "crash" | "error", error: unknown): void {
  if (typeof window === "undefined") return;
  const failure = error instanceof Error ? error : new Error(String(error ?? "Unknown error"));
  const title = (failure.message || failure.name).slice(0, 300);
  if (Date.now() - (sentAt.get(title) ?? 0) < EVERY_MS) return;
  sentAt.set(title, Date.now());
  fetch(`${environment.apiUrl}/telemetry/errors`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      source: "admin",
      type,
      title,
      stack: failure.stack?.slice(0, 8000),
      where: window.location.pathname,
      platform: "web",
      device: navigator.userAgent.slice(0, 80),
      env: environment.appEnv,
    }),
    keepalive: true,
  }).catch(() => undefined);
}
