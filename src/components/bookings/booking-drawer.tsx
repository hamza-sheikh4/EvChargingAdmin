"use client";

import { BookingState } from "@/components/bookings/booking-state";
import { PhotoTile } from "@/components/hosts/photo-tile";
import { DetailRow, DetailSection } from "@/components/shared/detail-list";
import { ErrorState } from "@/components/shared/error-state";
import { Drawer } from "@/components/ui/drawer";
import { Skeleton } from "@/components/ui/skeleton";
import { areaName } from "@/content/areas";
import { bookingsCopy } from "@/content/bookings";
import { hostsCopy } from "@/content/hosts";
import { useBooking } from "@/hooks/use-bookings";
import { formatDateTime, formatRupees } from "@/lib/format";

const copy = bookingsCopy.detail;

/** One booking: both people, the charger as booked, every step in order, and the end photos. */
export function BookingDrawer({ bookingId, onClose }: { bookingId: string | null; onClose: () => void }) {
  const query = useBooking(bookingId);
  const booking = query.data;

  return (
    <Drawer
      open={bookingId !== null}
      onOpenChange={open => !open && onClose()}
      size="wide"
      title={booking ? `${booking.driver.fullName || "-"} at ${booking.host.fullName || "-"}` : copy.loading}
      description={booking ? formatDateTime(booking.createdAt) : undefined}
      footer={<p className="mr-auto text-xs text-muted">{copy.readOnly}</p>}
    >
      {query.isPending ? <Skeleton className="h-96 w-full rounded-md" aria-busy="true" aria-label={copy.loading} /> : null}
      {query.isError ? <ErrorState message={query.error.message} onRetry={() => query.refetch()} /> : null}
      {booking ? (
        <div className="grid gap-7">
          <div className="justify-self-start">
            <BookingState state={booking.state} />
          </div>

          <DetailSection title={copy.people.title}>
            <DetailRow label={copy.people.driver}>
              {booking.driver.fullName || "-"} <span className="text-muted">· +92 {booking.driver.phone}</span>
            </DetailRow>
            <DetailRow label={copy.people.vehicle}>{booking.vehicle || "-"}</DetailRow>
            <DetailRow label={copy.people.host}>
              {booking.host.fullName || "-"} <span className="text-muted">· +92 {booking.host.phone}</span>
            </DetailRow>
          </DetailSection>

          <DetailSection title={copy.charging.title}>
            <DetailRow label={copy.charging.place}>
              {hostsCopy.location[booking.charger.location]} · {areaName(booking.charger.areaId)} · {booking.charger.maxKw} kW ·{" "}
              {booking.charger.connectors.map(c => hostsCopy.connectors[c]).join(", ")}
            </DetailRow>
            <DetailRow label={copy.charging.rate}>
              {formatRupees(booking.ratePaisa)}
              {bookingsCopy.perKwh}
            </DetailRow>
            <DetailRow label={copy.charging.respondBy}>{formatDateTime(booking.respondBy)}</DetailRow>
            {booking.startPercent !== null ? (
              <DetailRow label={copy.charging.battery}>
                {booking.startPercent}% {booking.endPercent !== null ? `to ${booking.endPercent}%` : ""}
              </DetailRow>
            ) : null}
            {booking.interruptionReason ? <DetailRow label={copy.charging.interruption}>{booking.interruptionReason}</DetailRow> : null}
          </DetailSection>

          <section className="grid gap-2">
            <h3 className="text-[0.8125rem] font-semibold text-heading">{copy.timeline.title}</h3>
            <ol className="grid gap-0 rounded-md border border-line bg-surface">
              {booking.events.map((event, index) => (
                <li key={`${event.at}-${index}`} className="flex gap-3 border-b border-line px-4 py-2.5 last:border-b-0">
                  <span aria-hidden="true" className="mt-1.5 size-2 shrink-0 rounded-full bg-accent" />
                  <div className="grid flex-1 gap-0.5 text-[0.8125rem]">
                    <span className="text-fg">
                      {bookingsCopy.states[event.to].label}
                      <span className="text-muted"> · {bookingsCopy.actors[event.actor]}</span>
                    </span>
                    {event.note ? <span className="text-xs text-muted">{event.note}</span> : null}
                  </div>
                  <span className="text-xs text-muted tabular-nums">{formatDateTime(event.at)}</span>
                </li>
              ))}
            </ol>
          </section>

          {booking.proofs.chargerDisplay || booking.proofs.carScreen ? (
            <section className="grid gap-2">
              <h3 className="text-[0.8125rem] font-semibold text-heading">{copy.proofs.title}</h3>
              <div className="grid gap-3 sm:grid-cols-2">
                <PhotoTile src={booking.proofs.chargerDisplay} label={copy.proofs.chargerDisplay} />
                <PhotoTile src={booking.proofs.carScreen} label={copy.proofs.carScreen} />
              </div>
            </section>
          ) : null}
        </div>
      ) : null}
    </Drawer>
  );
}
