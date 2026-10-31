"use client";

import { CircleAlert, RotateCw, TriangleAlert } from "lucide-react";
import { useState } from "react";
import { ApiCard, RoutesCard } from "@/components/health/api-card";
import { LandingCard, MobileCard, TotalsCard } from "@/components/health/client-cards";
import { EnvironmentView } from "@/components/health/environment-view";
import { EventsView } from "@/components/health/events-view";
import { DatabaseCard, JobsCard, NotificationsCard, RealtimeCard, StorageCard } from "@/components/health/infra-cards";
import { EmptyState } from "@/components/shared/empty-state";
import { ErrorState } from "@/components/shared/error-state";
import { FilterTabs } from "@/components/shared/filter-tabs";
import { PageHeader } from "@/components/shared/page-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { healthCopy as copy } from "@/content/health";
import { useCan } from "@/hooks/use-admin-session";
import { useHealth } from "@/hooks/use-health";
import { formatDateTime } from "@/lib/format";
import type { EventKind, HealthOverview } from "@/types";

type Tab = keyof typeof copy.tabs;
const LOG_TABS: EventKind[] = ["error", "crash", "bug_report", "event", "security"];

function Overview({ overview }: { overview: HealthOverview }) {
  return (
    <div className="grid gap-4 lg:grid-cols-3">
      <ApiCard api={overview.api} />
      <DatabaseCard database={overview.database} />
      <StorageCard storage={overview.storage} />
      <RealtimeCard realtime={overview.realtime} />
      <JobsCard jobs={overview.jobs} />
      <MobileCard mobile={overview.mobile} />
      <LandingCard landing={overview.landing} />
      <NotificationsCard notifications={overview.notifications} />
      <RoutesCard routes={overview.api.routes} />
      <TotalsCard totals={overview.totals} />
    </div>
  );
}

/** Live status of every part of PakVolt, the logs, and the environment. Banners only for alerts. */
export function HealthView() {
  const can = useCan();
  const health = useHealth();
  const [tab, setTab] = useState<Tab>("overview");
  const overview = health.data;
  const isLog = (LOG_TABS as string[]).includes(tab);
  const status = overview ? copy.status[overview.status] : null;

  return (
    <>
      <PageHeader
        {...copy.page}
        actions={
          <>
            {status ? <Badge variant={status.tone} showDot>{status.label}</Badge> : null}
            {overview ? <span className="text-xs text-muted">{copy.checked(formatDateTime(overview.checkedAt))}</span> : null}
            <Button variant="secondary" size="sm" leftIcon={<RotateCw />} loading={health.isFetching} onClick={() => health.refetch()}>
              {copy.checkNow}
            </Button>
          </>
        }
      />

      {overview?.banners.map(banner => {
        const Icon = banner.level === "error" ? CircleAlert : TriangleAlert;
        return (
          <div
            key={banner.id}
            role="alert"
            className={`flex items-center gap-2.5 rounded-md border px-4 py-2.5 text-[0.8125rem] ${banner.level === "error" ? "border-danger/30 bg-danger-soft text-danger" : "border-warning/30 bg-warning-soft text-warning"}`}
          >
            <Icon aria-hidden="true" className="size-4 shrink-0" />
            {copy.banners[banner.id]?.(banner.value) ?? banner.id}
          </div>
        );
      })}

      <FilterTabs label={copy.page.title} tabs={copy.tabs} value={tab} onChange={setTab} counts={overview ? { error: overview.totals.openErrors, bug_report: overview.totals.openBugReports } : undefined} />

      {health.isPending ? (
        <div className="grid gap-4 lg:grid-cols-3" aria-busy="true">
          <Skeleton className="h-80 rounded-md lg:col-span-2" />
          <Skeleton className="h-80 rounded-md" />
          <Skeleton className="h-44 rounded-md" />
          <Skeleton className="h-44 rounded-md" />
          <Skeleton className="h-44 rounded-md" />
        </div>
      ) : null}
      {health.isError ? <ErrorState message={copy.unreachable} onRetry={() => health.refetch()} /> : null}

      {overview && tab === "overview" ? <Overview overview={overview} /> : null}
      {overview && tab === "environment" ? <EnvironmentView overview={overview} /> : null}
      {isLog && can("health_view_logs") ? <EventsView key={tab} kind={tab as EventKind} canResolve={can("health_resolve")} /> : null}
      {isLog && !can("health_view_logs") ? <EmptyState {...copy.events.noAccess} /> : null}
      {overview && tab === "overview" ? <p className="text-xs text-muted">{copy.since(formatDateTime(overview.api.startedAt))}</p> : null}
    </>
  );
}
