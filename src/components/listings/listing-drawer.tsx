"use client";

import { HostCharger } from "@/components/hosts/host-charger";
import { ListingState } from "@/components/listings/listing-state";
import { PauseBar } from "@/components/listings/pause-bar";
import { PinMap } from "@/components/listings/pin-map";
import { DetailRow, DetailSection } from "@/components/shared/detail-list";
import { ErrorState } from "@/components/shared/error-state";
import { Drawer } from "@/components/ui/drawer";
import { Skeleton } from "@/components/ui/skeleton";
import { areaName } from "@/content/areas";
import { hostsCopy } from "@/content/hosts";
import { listingsCopy } from "@/content/listings";
import { useListing } from "@/hooks/use-listings";
import { formatDateTime } from "@/lib/format";

const copy = listingsCopy.detail;

type ListingDrawerProps = {
  listingId: string | null;
  allowed: { pause: boolean; relist: boolean };
  onClose: () => void;
};

/** One charger: state, host, exact pin, photos and details, admin changes, and pause or list again. */
export function ListingDrawer({ listingId, allowed, onClose }: ListingDrawerProps) {
  const query = useListing(listingId);
  const listing = query.data;

  return (
    <Drawer
      open={listingId !== null}
      onOpenChange={open => !open && onClose()}
      size="wide"
      title={listing ? `${hostsCopy.location[listing.locationType]} · ${areaName(listing.areaId)}` : copy.loading}
      description={listing?.host.fullName}
      footer={
        listing ? (
          (listing.listed ? allowed.pause : allowed.relist) ? (
            <PauseBar key={`${listing.id}-${listing.listed}`} listing={listing} />
          ) : (
            <p className="mr-auto text-xs text-muted">{listingsCopy.actions.viewOnly}</p>
          )
        ) : undefined
      }
    >
      {query.isPending ? (
        <div className="grid gap-6" aria-busy="true" aria-label={copy.loading}>
          <Skeleton className="aspect-[16/9] w-full rounded-md" />
          <Skeleton className="h-72 w-full rounded-md" />
        </div>
      ) : null}
      {query.isError ? <ErrorState message={query.error.message} onRetry={() => query.refetch()} /> : null}
      {listing ? (
        <div className="grid gap-7">
          <div className="justify-self-start">
            <ListingState listed={listing.listed} verified={listing.verifiedAt !== null} />
          </div>
          <DetailSection title={copy.host.title}>
            <DetailRow label={copy.host.name}>{listing.host.fullName || "-"}</DetailRow>
            <DetailRow label={copy.host.phone}>+92 {listing.host.phone}</DetailRow>
            <DetailRow label={copy.host.status}>
              {listing.host.status ? hostsCopy.status[listing.host.status] : "-"}
            </DetailRow>
          </DetailSection>
          {/* The exact pin needs the See exact pins permission. */}
          {listing.coordinates ? <PinMap {...listing.coordinates} /> : null}
          <HostCharger charger={listing} index={0} />
          <DetailSection title={copy.activity.title}>
            <DetailRow label={copy.activity.added}>{formatDateTime(listing.createdAt)}</DetailRow>
            <DetailRow label={copy.activity.checkIn}>
              {listing.lastCheckInAt ? formatDateTime(listing.lastCheckInAt) : listingsCopy.never}
            </DetailRow>
          </DetailSection>
          {listing.history.length > 0 ? (
            <DetailSection title={copy.history.title}>
              {listing.history.map(entry => (
                <DetailRow key={`${entry.at}-${entry.action}`} label={formatDateTime(entry.at)}>
                  <span className={entry.action === "paused" ? "font-medium text-danger" : "font-medium text-accent"}>
                    {copy.history[entry.action]}
                  </span>{" "}
                  {copy.history.by} {entry.by}
                  {entry.reason ? <span className="block text-xs text-muted">{entry.reason}</span> : null}
                </DetailRow>
              ))}
            </DetailSection>
          ) : null}
        </div>
      ) : null}
    </Drawer>
  );
}
