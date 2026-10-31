"use client";

import { useDeferredValue, useState } from "react";
import { HostDrawer } from "@/components/hosts/host-drawer";
import { HostsTable } from "@/components/hosts/hosts-table";
import { EmptyState } from "@/components/shared/empty-state";
import { FilterTabs } from "@/components/shared/filter-tabs";
import { ErrorState } from "@/components/shared/error-state";
import { PageHeader } from "@/components/shared/page-header";
import { TableSkeleton } from "@/components/shared/table-skeleton";
import { Input } from "@/components/ui/input";
import { hostsCopy as copy } from "@/content/hosts";
import { useCan } from "@/hooks/use-admin-session";
import { useHosts } from "@/hooks/use-hosts";
import type { HostStatus } from "@/types";

/** The review queue: Pending, Verified and Rejected tabs with counts, a search, and the host drawer. */
export function HostsView() {
  const can = useCan();
  const [status, setStatus] = useState<HostStatus>("pending");
  const [search, setSearch] = useState("");
  const q = useDeferredValue(search.trim());
  const [openId, setOpenId] = useState<string | null>(null);
  const hosts = useHosts(status, q);
  const review = { approve: can("hosts_approve"), reject: can("hosts_reject") };
  const { icon: SearchIcon } = copy.search;

  return (
    <>
      <PageHeader {...copy.page} />
      <div className="flex flex-wrap items-center justify-between gap-3">
        <FilterTabs
          label={copy.page.title}
          tabs={copy.tabs}
          value={status}
          onChange={setStatus}
          counts={hosts.data?.counts}
        />
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

      {hosts.isPending ? <TableSkeleton columns={5} /> : null}
      {hosts.isError ? <ErrorState message={hosts.error.message} onRetry={() => hosts.refetch()} /> : null}
      {hosts.data && hosts.data.hosts.length > 0 ? <HostsTable hosts={hosts.data.hosts} onOpen={setOpenId} /> : null}
      {hosts.data && hosts.data.hosts.length === 0 ? <EmptyState {...(q ? copy.empty.search : copy.empty[status])} /> : null}

      <HostDrawer hostId={openId} review={review} onClose={() => setOpenId(null)} />
    </>
  );
}
