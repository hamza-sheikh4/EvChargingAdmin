"use client";

import { keepPreviousData, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { usersCopy } from "@/content/users";
import { adminApi, adminQuery } from "@/services/admin";
import type { UserFilter } from "@/types";

/** One filter of the Users page, with counts for every filter. Keeps the last list while a search loads. */
export function useUsers(filter: UserFilter, q: string) {
  return useQuery({
    queryKey: adminQuery.users(filter, q),
    queryFn: () => adminApi.users(filter, q),
    placeholderData: keepPreviousData,
  });
}

export function useUser(id: string | null) {
  return useQuery({ queryKey: adminQuery.user(id ?? ""), queryFn: () => adminApi.user(id as string), enabled: Boolean(id) });
}

/** Suspend with a reason, or lift it. Refreshes the page and the drawer. */
export function useSuspension(id: string) {
  const client = useQueryClient();
  const refresh = () => {
    client.invalidateQueries({ queryKey: adminQuery.usersAll });
    client.invalidateQueries({ queryKey: adminQuery.user(id) });
  };
  const fail = (error: Error) => toast.error(error.message);

  const suspend = useMutation({
    mutationFn: (reason: string) => adminApi.suspendUser(id, reason),
    onSuccess: () => {
      toast.success(usersCopy.toast.suspended);
      refresh();
    },
    onError: fail,
  });
  const unsuspend = useMutation({
    mutationFn: () => adminApi.unsuspendUser(id),
    onSuccess: () => {
      toast.success(usersCopy.toast.unsuspended);
      refresh();
    },
    onError: fail,
  });
  return { suspend, unsuspend, busy: suspend.isPending || unsuspend.isPending };
}
