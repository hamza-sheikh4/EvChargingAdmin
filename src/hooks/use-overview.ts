"use client";

import { useQuery } from "@tanstack/react-query";
import { adminApi, adminQuery } from "@/services/admin";

/** Every Overview widget's numbers in one call, refreshed every minute. */
export function useOverview() {
  return useQuery({ queryKey: adminQuery.overview, queryFn: adminApi.overview, refetchInterval: 60_000 });
}
