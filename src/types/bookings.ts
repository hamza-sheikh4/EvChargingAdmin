/** Bookings as GET /admin/bookings sends them. The app calls a booking a session. */
import type { Connector } from "./records";

export type BookingState =
  | "requested" | "declined" | "expired" | "cancelled"
  | "accepted" | "active" | "interrupted" | "ended"
  | "awaiting_host_energy" | "billed" | "flagged" | "paid"
  | "disputed" | "reviewed" | "resolved";

export type BookingFilter = "all" | "upcoming" | "charging" | "ended" | "closed";

export type BookingPerson = { id: string; fullName: string; phone: string };

export type BookingSummary = {
  id: string;
  state: BookingState;
  driver: BookingPerson;
  host: BookingPerson;
  areaId: string | null;
  ratePaisa: number;
  vehicle: string;
  startPercent: number | null;
  endPercent: number | null;
  createdAt: string;
  updatedAt: string;
};

export type BookingListResponse = { counts: Record<BookingFilter, number>; bookings: BookingSummary[] };

export type BookingEvent = { from: BookingState | null; to: BookingState; actor: "driver" | "host" | "system" | "admin"; at: string; note?: string };

export type BookingDetail = BookingSummary & {
  charger: { hostName: string; location: "home" | "business"; areaId: string; connectors: Connector[]; maxKw: number };
  respondBy: string;
  interruptionReason: string | null;
  events: BookingEvent[];
  /** Signed links to the driver's end photos, valid for an hour. */
  proofs: { chargerDisplay: string | null; carScreen: string | null };
};
