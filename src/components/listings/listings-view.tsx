"use client";

import { useDeferredValue, useState } from "react";
import { ListingDrawer } from "@/components/listings/listing-drawer";
import { ListingsTable } from "@/components/listings/listings-table";
import { EmptyState } from "@/components/shared/empty-state";
import { ErrorState } from "@/components/shared/error-state";
import { FilterTabs } from "@/components/shared/filter-tabs";
import { PageHeader } from "@/components/shared/page-header";
import { TableSkeleton } from "@/components/shared/table-skeleton";
import { Input } from "@/components/ui/input";
import { listingsCopy as copy } from "@/content/listings";
import { useCan } from "@/hooks/use-admin-session";
import { useListings } from "@/hooks/use-listings";
import type { ListingFilter } from "@/types";

/** Every charger, filtered by state, with a search and the charger drawer. */
export function ListingsView() {
  const can = useCan();
  const [filter, setFilter] = useState<ListingFilter>("all");
  const [search, setSearch] = useState("");
  const q = useDeferredValue(search.trim());
  const [openId, setOpenId] = useState<string | null>(null);
  const listings = useListings(filter, q);
  const allowed = { pause: can("listings_pause"), relist: can("listings_relist") };
  const { icon: SearchIcon } = copy.search;
  const rows = listings.data?.listings;

  return (
    <>
      <PageHeader {...copy.page} />
      <div className="flex flex-wrap items-center justify-between gap-3">
        <FilterTabs label={copy.page.title} tabs={copy.tabs} value={filter} onChange={setFilter} counts={listings.data?.counts} />
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

      {listings.isPending ? <TableSkeleton columns={5} /> : null}
      {listings.isError ? <ErrorState message={listings.error.message} onRetry={() => listings.refetch()} /> : null}
      {rows && rows.length > 0 ? <ListingsTable listings={rows} onOpen={setOpenId} /> : null}
      {rows && rows.length === 0 ? <EmptyState {...(q ? copy.empty.search : copy.empty[filter])} /> : null}

      <ListingDrawer listingId={openId} allowed={allowed} onClose={() => setOpenId(null)} />
    </>
  );
}
