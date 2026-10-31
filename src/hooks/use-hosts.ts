"use client";

import { keepPreviousData, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { hostsCopy } from "@/content/hosts";
import { adminApi, adminQuery } from "@/services/admin";
import type { HostStatus } from "@/types";

/** One tab of the review queue, with the counts for every tab. Keeps the last list while a new search loads. */
export function useHosts(status: HostStatus, q: string) {
  return useQuery({
    queryKey: adminQuery.hosts(status, q),
    queryFn: () => adminApi.hosts(status, q),
    placeholderData: keepPreviousData,
  });
}

export function useHost(id: string | null) {
  return useQuery({
    queryKey: adminQuery.host(id ?? ""),
    queryFn: () => adminApi.host(id as string),
    enabled: Boolean(id),
    // Photo links expire after an hour, so refetch rather than show dead images.
    staleTime: 10 * 60 * 1000,
  });
}

/** Approve and reject. Both refresh the queue and this host, then call onDone. */
export function useHostReview(id: string, name: string, onDone: () => void) {
  const client = useQueryClient();
  const settle = (message: string) => {
    toast.success(message);
    client.invalidateQueries({ queryKey: adminQuery.hostsAll });
    client.invalidateQueries({ queryKey: adminQuery.host(id) });
    onDone();
  };
  const fail = (error: Error) => toast.error(error.message);

  const approve = useMutation({
    mutationFn: () => adminApi.approveHost(id),
    onSuccess: () => settle(hostsCopy.toast.approved(name)),
    onError: fail,
  });
  const reject = useMutation({
    mutationFn: (reason: string) => adminApi.rejectHost(id, reason),
    onSuccess: () => settle(hostsCopy.toast.rejected(name)),
    onError: fail,
  });
  return { approve, reject, busy: approve.isPending || reject.isPending };
}
