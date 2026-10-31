"use client";

import { ChevronRight, Siren } from "lucide-react";
import { ListingState } from "@/components/listings/listing-state";
import { Card } from "@/components/ui/card";
import { areaName } from "@/content/areas";
import { hostsCopy } from "@/content/hosts";
import { listingsCopy as copy } from "@/content/listings";
import { formatDateTime, formatRupees } from "@/lib/format";
import type { ListingSummary } from "@/types";

const headClass = "px-4 py-2 text-left text-xs font-medium text-muted";
const cellClass = "px-4 py-row text-[0.8125rem]";

/** Chargers, newest first. A row opens the charger on the right. */
export function ListingsTable({ listings, onOpen }: { listings: ListingSummary[]; onOpen: (id: string) => void }) {
  return (
    <Card padding="none" className="overflow-x-auto">
      <table className="w-full min-w-[46rem] border-collapse">
        <thead className="border-b border-line">
          <tr>
            <th className={headClass}>{copy.columns.charger}</th>
            <th className={headClass}>{copy.columns.host}</th>
            <th className={headClass}>{copy.columns.rate}</th>
            <th className={headClass}>{copy.columns.status}</th>
            <th className={headClass}>{copy.columns.checkIn}</th>
            <th className="w-10" />
          </tr>
        </thead>
        <tbody>
          {listings.map(listing => (
            <tr
              key={listing.id}
              onClick={() => onOpen(listing.id)}
              className="cursor-pointer border-b border-line transition-colors last:border-b-0 hover:bg-hover"
            >
              <td className={cellClass}>
                <div className="grid">
                  {/* The area is the keyboard target for the row. */}
                  <button
                    type="button"
                    onClick={event => {
                      event.stopPropagation();
                      onOpen(listing.id);
                    }}
                    className="text-left font-medium text-heading"
                  >
                    {areaName(listing.areaId)}
                  </button>
                  <span className="flex items-center gap-1.5 text-xs text-muted">
                    {hostsCopy.location[listing.locationType]} · {listing.powerKw} kW ·{" "}
                    {listing.connectors.map(c => hostsCopy.connectors[c]).join(", ")}
                    {listing.emergencyAvailability ? (
                      <Siren aria-label={copy.emergency} className="size-3 text-warning" />
                    ) : null}
                  </span>
                </div>
              </td>
              <td className={cellClass}>
                <div className="grid">
                  <span className="text-fg">{listing.host.fullName || "-"}</span>
                  <span className="text-xs text-muted">+92 {listing.host.phone}</span>
                </div>
              </td>
              <td className={`${cellClass} tabular-nums`}>
                {formatRupees(listing.ratePaisa)}
                <span className="text-xs text-muted">{copy.perKwh}</span>
              </td>
              <td className={cellClass}>
                <ListingState listed={listing.listed} verified={listing.verified} />
              </td>
              <td className={`${cellClass} text-muted`}>
                {listing.lastCheckInAt ? formatDateTime(listing.lastCheckInAt) : copy.never}
              </td>
              <td className="pr-3 text-muted">
                <ChevronRight aria-hidden="true" className="size-4" />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </Card>
  );
}
