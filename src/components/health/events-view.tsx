"use client";

import { useDeferredValue, useState } from "react";
import { EventDrawer } from "@/components/health/event-drawer";
import { EmptyState } from "@/components/shared/empty-state";
import { ErrorState } from "@/components/shared/error-state";
import { TableSkeleton } from "@/components/shared/table-skeleton";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { healthCopy } from "@/content/health";
import { useHealthEvents } from "@/hooks/use-health";
import { formatDateTime } from "@/lib/format";
import type { EventKind, EventSource } from "@/types";

const copy = healthCopy.events;
const headClass = "px-4 py-2 text-left text-xs font-medium text-muted";
const cellClass = "px-4 py-row text-[0.8125rem]";
const sourceOptions = [{ value: "", label: copy.allSources }, ...Object.entries(copy.sources).map(([value, label]) => ({ value, label }))];
const statusOptions = [{ value: "", label: copy.allStatuses }, ...Object.entries(copy.status).map(([value, label]) => ({ value, label }))];

/** One kind of event: grouped repeats with a count, filters by source, status and title, and a detail drawer. */
export function EventsView({ kind, canResolve }: { kind: EventKind; canResolve: boolean }) {
  const [source, setSource] = useState("");
  const [status, setStatus] = useState(kind === "bug_report" || kind === "error" || kind === "crash" ? "open" : "");
  const [search, setSearch] = useState("");
  const q = useDeferredValue(search.trim());
  const [openId, setOpenId] = useState<string | null>(null);
  const events = useHealthEvents(kind, {
    source: (source || undefined) as EventSource | undefined,
    status: (status || undefined) as "open" | "resolved" | undefined,
    q,
  });
  const rows = events.data?.events;

  return (
    <>
      <div className="flex flex-wrap items-center gap-2">
        <Select label={copy.columns.source} options={sourceOptions} value={source} onChange={setSource} />
        <Select label={copy.columns.status} options={statusOptions} value={status} onChange={setStatus} />
        <Input label={copy.search} hideLabel placeholder={copy.search} value={search} onChange={e => setSearch(e.target.value)} containerClassName="w-full sm:ml-auto sm:w-64" type="search" />
      </div>

      {events.isPending ? <TableSkeleton columns={5} /> : null}
      {events.isError ? <ErrorState message={events.error.message} onRetry={() => events.refetch()} /> : null}
      {rows && rows.length === 0 ? <EmptyState icon={copy.icons[kind]} {...copy.empty} /> : null}
      {rows && rows.length > 0 ? (
        <Card padding="none" className="overflow-x-auto">
          <table className="w-full min-w-[44rem] border-collapse">
            <thead className="border-b border-line">
              <tr>
                <th className={headClass}>{copy.columns.title}</th>
                <th className={headClass}>{copy.columns.source}</th>
                <th className={headClass}>{copy.columns.count}</th>
                <th className={headClass}>{copy.columns.last}</th>
                <th className={headClass}>{copy.columns.status}</th>
              </tr>
            </thead>
            <tbody>
              {rows.map(row => (
                <tr key={row.id} onClick={() => setOpenId(row.id)} className="cursor-pointer border-b border-line transition-colors last:border-b-0 hover:bg-hover">
                  <td className={cellClass}>
                    <button
                      type="button"
                      onClick={e => {
                        e.stopPropagation();
                        setOpenId(row.id);
                      }}
                      className={`line-clamp-2 text-left font-medium ${row.level === "error" ? "text-heading" : "text-fg"}`}
                    >
                      {row.title}
                    </button>
                    {row.appVersion ? <span className="text-xs text-muted">{row.appVersion} · {row.platform}</span> : null}
                  </td>
                  <td className={`${cellClass} text-muted`}>{copy.sources[row.source]}</td>
                  <td className={`${cellClass} tabular-nums`}>{row.count}</td>
                  <td className={`${cellClass} text-muted`}>{formatDateTime(row.lastSeenAt)}</td>
                  <td className={cellClass}>
                    <Badge variant={row.status === "open" ? (row.level === "error" ? "danger" : "warning") : "neutral"} showDot>
                      {copy.status[row.status]}
                    </Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      ) : null}

      <EventDrawer eventId={openId} kind={kind} canResolve={canResolve} onClose={() => setOpenId(null)} />
    </>
  );
}
