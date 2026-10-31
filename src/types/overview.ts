/** GET /admin/overview. Each section is present only with that page's permission. */
import type { BookingState } from "./bookings";

export type DayCount = { day: string; count: number };

export type OverviewData = {
  generatedAt: string;
  hosts?: {
    pending: number;
    oldest: { id: string; fullName: string; areaId: string | null; waitingSince: string }[];
    approved7d: number;
    rejected7d: number;
  };
  listings?: {
    live: number;
    paused: number;
    inReview: number;
    quiet: number;
    emergency: number;
    areas: { areaId: string; chargers: number; bookings7d: number }[];
  };
  bookings?: {
    today: { upcoming: number; charging: number; ended: number; closed: number };
    waitingForHost: number;
    chargingNow: { id: string; driver: string; host: string; areaId: string | null; state: BookingState; since: string }[];
    daily: DayCount[];
    acceptanceRate7d: number | null;
    avgResponseSeconds7d: number | null;
    busyChargers: number;
  };
  users?: { total: number; drivers: number; hosts: number; suspended: number; new7d: number; daily: DayCount[] };
  team?: { superadmins: number; admins: number; recent: { id: string; fullName: string; role: "superadmin" | "admin"; lastLoginAt: string }[] };
  activity?: { id: string; actor: string; action: string; at: string }[];
  system?: { database: boolean; openErrors: number; openBugReports: number; security24h: number; crashes7d: number };
};
