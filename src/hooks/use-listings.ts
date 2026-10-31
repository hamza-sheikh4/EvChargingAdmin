"use client";

import { keepPreviousData, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { listingsCopy } from "@/content/listings";
import { adminApi, adminQuery } from "@/services/admin";
import type { ListingFilter } from "@/types";

/** One filter of the Listings page, with counts for every filter. Keeps the last list while a search loads. */
export function useListings(filter: ListingFilter, q: string) {
  return useQuery({
    queryKey: adminQuery.listings(filter, q),
    queryFn: () => adminApi.listings(filter, q),
    placeholderData: keepPreviousData,
  });
}

export function useListing(id: string | null) {
  return useQuery({
    queryKey: adminQuery.listing(id ?? ""),
    queryFn: () => adminApi.listing(id as string),
    enabled: Boolean(id),
    // Photo links expire after an hour, so refetch rather than show dead images.
    staleTime: 10 * 60 * 1000,
  });
}

/** Pause with a reason, or list again. Refreshes the page and the drawer. */
export function useSetListed(id: string) {
  const client = useQueryClient();
  return useMutation({
    mutationFn: ({ listed, reason }: { listed: boolean; reason?: string }) => adminApi.setListed(id, listed, reason),
    onSuccess: ({ listed }) => {
      toast.success(listed ? listingsCopy.toast.relisted : listingsCopy.toast.paused);
      client.invalidateQueries({ queryKey: adminQuery.listingsAll });
      client.invalidateQueries({ queryKey: adminQuery.listing(id) });
    },
    onError: (error: Error) => toast.error(error.message),
  });
}
