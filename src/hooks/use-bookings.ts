"use client";

import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { adminApi, adminQuery } from "@/services/admin";
import type { BookingFilter } from "@/types";

/** Bookings change on their own (requests expire, charging ends), so the list refreshes every 30 seconds. */
const REFRESH_MS = 30_000;

export function useBookings(filter: BookingFilter, q: string) {
  return useQuery({
    queryKey: adminQuery.bookings(filter, q),
    queryFn: () => adminApi.bookings(filter, q),
    placeholderData: keepPreviousData,
    refetchInterval: REFRESH_MS,
  });
}

export function useBooking(id: string | null) {
  return useQuery({
    queryKey: adminQuery.booking(id ?? ""),
    queryFn: () => adminApi.booking(id as string),
    enabled: Boolean(id),
    refetchInterval: REFRESH_MS,
  });
}
