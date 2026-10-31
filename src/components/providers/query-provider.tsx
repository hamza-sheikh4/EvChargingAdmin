"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import type { ReactNode } from "react";
import { Toaster } from "sonner";
import { ConfirmProvider } from "@/components/providers/confirm-provider";
import { ErrorReporter } from "@/components/providers/error-reporter";
import { usePreferences } from "@/lib/preferences";

let browserQueryClient: QueryClient | undefined;

function makeQueryClient() {
  return new QueryClient({
    defaultOptions: { queries: { staleTime: 30_000, retry: 1, refetchOnWindowFocus: false } },
  });
}

// Keep server renders isolated and reuse one client in the browser.
function getQueryClient() {
  if (typeof window === "undefined") return makeQueryClient();
  browserQueryClient ??= makeQueryClient();
  return browserQueryClient;
}

/** React Query for admin API calls, the confirm dialog, and toasts for action results. */
export function Providers({ children }: { children: ReactNode }) {
  const { theme } = usePreferences();
  return (
    <QueryClientProvider client={getQueryClient()}>
      <ErrorReporter />
      <ConfirmProvider>{children}</ConfirmProvider>
      <Toaster position="top-right" theme={theme} richColors closeButton />
    </QueryClientProvider>
  );
}
