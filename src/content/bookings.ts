import { CalendarClock, Search } from "lucide-react";
import type { BookingEvent, BookingFilter, BookingState } from "@/types";

type Tone = "neutral" | "accent" | "host" | "warning" | "danger";

export const bookingsCopy = {
  page: {
    title: "Bookings",
    description: "Every booking between drivers and hosts, live. Read only until billing is built.",
  },
  tabs: { all: "All", upcoming: "Upcoming", charging: "Charging", ended: "Ended", closed: "Closed" } satisfies Record<BookingFilter, string>,
  search: { label: "Search bookings", placeholder: "Driver or host, name or phone", icon: Search },
  columns: { booking: "Booking", driver: "Driver", host: "Host", rate: "Rate", state: "Status", updated: "Updated" },
  perKwh: "/kWh",
  /** Label and colour for each state. */
  states: {
    requested: { label: "Requested", tone: "warning" },
    accepted: { label: "Accepted", tone: "host" },
    active: { label: "Charging", tone: "accent" },
    interrupted: { label: "Paused", tone: "warning" },
    ended: { label: "Ended", tone: "neutral" },
    awaiting_host_energy: { label: "Waiting for host kWh", tone: "neutral" },
    billed: { label: "Billed", tone: "neutral" },
    flagged: { label: "Flagged", tone: "danger" },
    paid: { label: "Paid", tone: "accent" },
    disputed: { label: "Disputed", tone: "danger" },
    reviewed: { label: "Reviewed", tone: "accent" },
    resolved: { label: "Resolved", tone: "neutral" },
    declined: { label: "Declined", tone: "neutral" },
    expired: { label: "Expired", tone: "neutral" },
    cancelled: { label: "Cancelled", tone: "neutral" },
  } satisfies Record<BookingState, { label: string; tone: Tone }>,
  actors: { driver: "Driver", host: "Host", system: "System", admin: "Admin" } satisfies Record<BookingEvent["actor"], string>,
  empty: {
    all: { icon: CalendarClock, title: "No bookings yet", description: "Bookings appear here once drivers request a charger." },
    upcoming: { icon: CalendarClock, title: "Nothing upcoming", description: "Requests waiting for a host, and accepted bookings, appear here." },
    charging: { icon: CalendarClock, title: "Nobody charging", description: "Bookings in progress appear here." },
    ended: { icon: CalendarClock, title: "Nothing ended yet", description: "Finished charging sessions appear here." },
    closed: { icon: CalendarClock, title: "Nothing closed", description: "Declined, expired and cancelled requests appear here." },
    search: { icon: Search, title: "No matches", description: "Try a different name or number." },
  },
  detail: {
    loading: "Loading booking",
    people: { title: "People", driver: "Driver", host: "Host", vehicle: "Car" },
    charging: { title: "Charging", place: "Charger", rate: "Rate (frozen when booked)", respondBy: "Host had until", battery: "Battery", interruption: "Paused because" },
    timeline: { title: "Timeline" },
    proofs: { title: "Driver's end photos", chargerDisplay: "Charger display", carScreen: "Car screen" },
    readOnly: "Read only. Resolving flagged and disputed bookings comes with billing.",
  },
} as const;
