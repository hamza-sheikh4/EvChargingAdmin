"use client";

import { keepPreviousData, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { healthCopy } from "@/content/health";
import { adminApi, adminQuery } from "@/services/admin";
import type { EventFilters, EventKind } from "@/types";

const REFRESH_MS = 30_000;

/** Every section of the Health page, checked live, refreshed every 30 seconds. */
export function useHealth() {
  return useQuery({ queryKey: adminQuery.health, queryFn: adminApi.health, refetchInterval: REFRESH_MS, retry: false });
}

export function useHealthEvents(kind: EventKind, filters: EventFilters, enabled = true) {
  return useQuery({
    queryKey: adminQuery.healthEvents(kind, filters),
    queryFn: () => adminApi.healthEvents(kind, filters),
    placeholderData: keepPreviousData,
    refetchInterval: REFRESH_MS,
    enabled,
  });
}

export function useHealthEvent(id: string | null) {
  return useQuery({ queryKey: adminQuery.healthEvent(id ?? ""), queryFn: () => adminApi.healthEvent(id as string), enabled: Boolean(id) });
}

/** Resolve (or close a bug report) and reopen. Refreshes the lists, the event and the page totals. */
export function useEventStatus(id: string) {
  const client = useQueryClient();
  const refresh = () => {
    client.invalidateQueries({ queryKey: adminQuery.healthEventsAll });
    client.invalidateQueries({ queryKey: adminQuery.healthEvent(id) });
    client.invalidateQueries({ queryKey: adminQuery.health });
  };
  const fail = (error: Error) => toast.error(error.message);
  const resolve = useMutation({
    mutationFn: () => adminApi.resolveEvent(id),
    onSuccess: () => {
      toast.success(healthCopy.events.toast.resolved);
      refresh();
    },
    onError: fail,
  });
  const reopen = useMutation({
    mutationFn: () => adminApi.reopenEvent(id),
    onSuccess: () => {
      toast.success(healthCopy.events.toast.reopened);
      refresh();
    },
    onError: fail,
  });
  return { resolve, reopen, busy: resolve.isPending || reopen.isPending };
}
