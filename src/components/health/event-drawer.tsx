"use client";

import { CheckCheck, RotateCcw } from "lucide-react";
import { PhotoTile } from "@/components/hosts/photo-tile";
import { DetailRow, DetailSection } from "@/components/shared/detail-list";
import { ErrorState } from "@/components/shared/error-state";
import { Button } from "@/components/ui/button";
import { Drawer } from "@/components/ui/drawer";
import { Skeleton } from "@/components/ui/skeleton";
import { healthCopy } from "@/content/health";
import { useEventStatus, useHealthEvent } from "@/hooks/use-health";
import { formatDateTime } from "@/lib/format";
import type { EventKind } from "@/types";

const copy = healthCopy.events;
const d = copy.detail;

type EventDrawerProps = { eventId: string | null; kind: EventKind; canResolve: boolean; onClose: () => void };

/** One event in full: message, stack, details, device, screenshot and reporter, and resolve or reopen. */
export function EventDrawer({ eventId, kind, canResolve, onClose }: EventDrawerProps) {
  const query = useHealthEvent(eventId);
  const event = query.data;
  const status = useEventStatus(eventId ?? "");
  const context = event?.context ? Object.entries(event.context).filter(([, value]) => value !== null && value !== undefined && value !== "") : [];

  const footer = event && canResolve ? (
    event.status === "open" ? (
      <Button leftIcon={<CheckCheck />} loading={status.resolve.isPending} onClick={() => status.resolve.mutate()}>
        {copy.resolve[kind]}
      </Button>
    ) : (
      <Button variant="secondary" leftIcon={<RotateCcw />} loading={status.reopen.isPending} onClick={() => status.reopen.mutate()}>
        {copy.reopen}
      </Button>
    )
  ) : undefined;

  return (
    <Drawer
      open={eventId !== null}
      onOpenChange={open => !open && onClose()}
      size="wide"
      title={event?.title ?? healthCopy.tabs[kind]}
      description={event ? `${copy.sources[event.source]} · ${copy.status[event.status]}` : undefined}
      footer={footer}
    >
      {query.isPending ? <Skeleton className="h-80 w-full rounded-md" aria-busy="true" /> : null}
      {query.isError ? <ErrorState message={query.error.message} onRetry={() => query.refetch()} /> : null}
      {event ? (
        <div className="grid gap-7">
          <DetailSection title={healthCopy.tabs[kind]}>
            <DetailRow label={d.count}>{event.count}</DetailRow>
            <DetailRow label={d.first}>{formatDateTime(event.firstSeenAt)}</DetailRow>
            <DetailRow label={d.last}>{formatDateTime(event.lastSeenAt)}</DetailRow>
            {event.appVersion ? <DetailRow label={d.version}>{event.appVersion}</DetailRow> : null}
            {event.platform ? <DetailRow label={d.platform}>{event.platform}</DetailRow> : null}
            {event.device ? <DetailRow label={d.device}>{event.device}</DetailRow> : null}
            {event.reporter ? (
              <DetailRow label={d.reporter}>
                {event.reporter.fullName || "-"} <span className="text-muted">· +92 {event.reporter.phone}</span>
              </DetailRow>
            ) : null}
            {event.resolvedBy ? (
              <DetailRow label={d.resolvedBy}>
                {event.resolvedBy} {event.resolvedAt ? <span className="text-muted">· {formatDateTime(event.resolvedAt)}</span> : null}
              </DetailRow>
            ) : null}
          </DetailSection>

          {event.message ? (
            <section className="grid gap-2">
              <h3 className="text-[0.8125rem] font-semibold text-heading">{d.message}</h3>
              <p className="rounded-md border border-line bg-surface px-4 py-3 text-[0.8125rem] whitespace-pre-wrap text-fg">{event.message}</p>
            </section>
          ) : null}

          {event.screenshotUrl ? (
            <section className="grid max-w-56 gap-2">
              <h3 className="text-[0.8125rem] font-semibold text-heading">{d.screenshot}</h3>
              <PhotoTile src={event.screenshotUrl} label={d.screenshot} />
            </section>
          ) : null}

          {context.length ? (
            <DetailSection title={d.context}>
              {context.map(([key, value]) => (
                <DetailRow key={key} label={key}>
                  <code className="font-mono text-xs break-all">{typeof value === "object" ? JSON.stringify(value) : String(value)}</code>
                </DetailRow>
              ))}
            </DetailSection>
          ) : null}

          {event.stack ? (
            <section className="grid gap-2">
              <h3 className="text-[0.8125rem] font-semibold text-heading">{d.stack}</h3>
              <pre className="max-h-80 overflow-auto rounded-md border border-line bg-surface-muted px-4 py-3 font-mono text-[0.6875rem] leading-relaxed text-fg">
                {event.stack}
              </pre>
            </section>
          ) : null}
        </div>
      ) : null}
    </Drawer>
  );
}
