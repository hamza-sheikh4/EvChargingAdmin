"use client";

import { useDeferredValue, useState } from "react";
import { BookingDrawer } from "@/components/bookings/booking-drawer";
import { BookingsTable } from "@/components/bookings/bookings-table";
import { EmptyState } from "@/components/shared/empty-state";
import { ErrorState } from "@/components/shared/error-state";
import { FilterTabs } from "@/components/shared/filter-tabs";
import { PageHeader } from "@/components/shared/page-header";
import { TableSkeleton } from "@/components/shared/table-skeleton";
import { Input } from "@/components/ui/input";
import { bookingsCopy as copy } from "@/content/bookings";
import { useBookings } from "@/hooks/use-bookings";
import type { BookingFilter } from "@/types";

/** Every booking, filtered by stage, with a search and the booking drawer. Refreshes itself. */
export function BookingsView() {
  const [filter, setFilter] = useState<BookingFilter>("all");
  const [search, setSearch] = useState("");
  const q = useDeferredValue(search.trim());
  const [openId, setOpenId] = useState<string | null>(null);
  const bookings = useBookings(filter, q);
  const { icon: SearchIcon } = copy.search;
  const rows = bookings.data?.bookings;

  return (
    <>
      <PageHeader {...copy.page} />
      <div className="flex flex-wrap items-center justify-between gap-3">
        <FilterTabs label={copy.page.title} tabs={copy.tabs} value={filter} onChange={setFilter} counts={bookings.data?.counts} />
        <Input
          label={copy.search.label}
          hideLabel
          placeholder={copy.search.placeholder}
          value={search}
          onChange={event => setSearch(event.target.value)}
          leftAddon={<SearchIcon />}
          containerClassName="w-full sm:w-64"
          type="search"
        />
      </div>

      {bookings.isPending ? <TableSkeleton columns={6} /> : null}
      {bookings.isError ? <ErrorState message={bookings.error.message} onRetry={() => bookings.refetch()} /> : null}
      {rows && rows.length > 0 ? <BookingsTable bookings={rows} onOpen={setOpenId} /> : null}
      {rows && rows.length === 0 ? <EmptyState {...(q ? copy.empty.search : copy.empty[filter])} /> : null}

      <BookingDrawer bookingId={openId} onClose={() => setOpenId(null)} />
    </>
  );
}
