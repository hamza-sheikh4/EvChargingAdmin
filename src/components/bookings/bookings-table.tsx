"use client";

import { ChevronRight } from "lucide-react";
import { BookingState } from "@/components/bookings/booking-state";
import { Card } from "@/components/ui/card";
import { areaName } from "@/content/areas";
import { bookingsCopy as copy } from "@/content/bookings";
import { formatDateTime, formatRupees } from "@/lib/format";
import type { BookingPerson, BookingSummary } from "@/types";

const headClass = "px-4 py-2 text-left text-xs font-medium text-muted";
const cellClass = "px-4 py-row text-[0.8125rem]";

function Person({ person }: { person: BookingPerson }) {
  return (
    <div className="grid">
      <span className="text-fg">{person.fullName || "-"}</span>
      <span className="text-xs text-muted">+92 {person.phone}</span>
    </div>
  );
}

/** Bookings, newest first. A row opens the booking on the right. */
export function BookingsTable({ bookings, onOpen }: { bookings: BookingSummary[]; onOpen: (id: string) => void }) {
  return (
    <Card padding="none" className="overflow-x-auto">
      <table className="w-full min-w-[50rem] border-collapse">
        <thead className="border-b border-line">
          <tr>
            <th className={headClass}>{copy.columns.booking}</th>
            <th className={headClass}>{copy.columns.driver}</th>
            <th className={headClass}>{copy.columns.host}</th>
            <th className={headClass}>{copy.columns.rate}</th>
            <th className={headClass}>{copy.columns.state}</th>
            <th className={headClass}>{copy.columns.updated}</th>
            <th className="w-10" />
          </tr>
        </thead>
        <tbody>
          {bookings.map(booking => (
            <tr
              key={booking.id}
              onClick={() => onOpen(booking.id)}
              className="cursor-pointer border-b border-line transition-colors last:border-b-0 hover:bg-hover"
            >
              <td className={cellClass}>
                <div className="grid">
                  {/* The area is the keyboard target for the row. */}
                  <button
                    type="button"
                    onClick={event => {
                      event.stopPropagation();
                      onOpen(booking.id);
                    }}
                    className="text-left font-medium text-heading"
                  >
                    {areaName(booking.areaId)}
                  </button>
                  <span className="text-xs text-muted">{formatDateTime(booking.createdAt)}</span>
                </div>
              </td>
              <td className={cellClass}>
                <Person person={booking.driver} />
              </td>
              <td className={cellClass}>
                <Person person={booking.host} />
              </td>
              <td className={`${cellClass} tabular-nums`}>
                {formatRupees(booking.ratePaisa)}
                <span className="text-xs text-muted">{copy.perKwh}</span>
              </td>
              <td className={cellClass}>
                <BookingState state={booking.state} />
              </td>
              <td className={`${cellClass} text-muted`}>{formatDateTime(booking.updatedAt)}</td>
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
