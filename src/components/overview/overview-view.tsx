"use client";

import {
  AreasWidget, BookingsWidget, ChargingNowWidget, HostsWidget, ListingsWidget, ResponseWidget,
} from "@/components/overview/ops-widgets";
import { ActivityWidget, AttentionWidget, SystemWidget, TeamWidget, UsersWidget } from "@/components/overview/people-widgets";
import { LockedWidget } from "@/components/overview/widget";
import { EmptyState } from "@/components/shared/empty-state";
import { ErrorState } from "@/components/shared/error-state";
import { PageHeader } from "@/components/shared/page-header";
import { Skeleton } from "@/components/ui/skeleton";
import { overviewCopy as copy } from "@/content/overview";
import { useAdminSession } from "@/hooks/use-admin-session";
import { useOverview } from "@/hooks/use-overview";
import { formatDateTime } from "@/lib/format";

/** Masonry: cards of different heights packed into columns, Pinterest style. */
const MASONRY = "columns-1 gap-4 md:columns-2 2xl:columns-3";
const SKELETON_HEIGHTS = ["h-40", "h-64", "h-52", "h-72", "h-44", "h-56"];

/**
 * The admin home: what needs attention first, then one widget per page the admin may see,
 * plus coverage, live charging, host response and admin activity. Disputes and Revenue are locked.
 */
export function OverviewView() {
  const session = useAdminSession();
  const overview = useOverview();
  const data = overview.data;
  const name = session.status === "ready" ? session.admin.fullName : "";
  const hasAny = data && (data.hosts || data.listings || data.bookings || data.users || data.team || data.system);

  return (
    <>
      <PageHeader
        title={name ? copy.greeting(name, new Date().getHours()) : copy.title}
        description={copy.description}
        actions={data ? <span className="text-xs text-muted">{copy.updated(formatDateTime(data.generatedAt))}</span> : undefined}
      />

      {overview.isPending ? (
        <div className={MASONRY} aria-busy="true">
          {SKELETON_HEIGHTS.map(height => (
            <Skeleton key={height} className={`mb-4 w-full break-inside-avoid rounded-md ${height}`} />
          ))}
        </div>
      ) : null}
      {overview.isError ? <ErrorState message={overview.error.message} onRetry={() => overview.refetch()} /> : null}
      {data && !hasAny ? <EmptyState {...copy.empty} /> : null}

      {data && hasAny ? (
        <div className={MASONRY}>
          <AttentionWidget data={data} />
          {data.bookings ? <BookingsWidget bookings={data.bookings} /> : null}
          {data.hosts ? <HostsWidget hosts={data.hosts} /> : null}
          {data.bookings ? <ChargingNowWidget sessions={data.bookings.chargingNow} /> : null}
          {data.listings ? <ListingsWidget listings={data.listings} /> : null}
          {data.users ? <UsersWidget users={data.users} /> : null}
          {data.bookings ? <ResponseWidget bookings={data.bookings} /> : null}
          {data.listings ? <AreasWidget areas={data.listings.areas} /> : null}
          {data.system ? <SystemWidget system={data.system} /> : null}
          {data.activity ? <ActivityWidget activity={data.activity} /> : null}
          {data.team ? <TeamWidget team={data.team} /> : null}
          <LockedWidget {...copy.locked.disputes} />
          <LockedWidget {...copy.locked.revenue} />
        </div>
      ) : null}
    </>
  );
}
