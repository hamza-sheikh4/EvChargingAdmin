import {
  Activity, BellRing, CalendarClock, Clock, History, Lock, MapPin, MapPinned, Scale, ShieldCheck, Timer, UserCog, Users, Wallet, Zap,
} from "lucide-react";

const greeting = (hour: number) => (hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening");

export const overviewCopy = {
  title: "Overview",
  greeting: (name: string, hour: number) => `${greeting(hour)}, ${name.split(" ")[0]}`,
  description: "What needs you today, and how PakVolt is doing. Refreshes every minute.",
  updated: (time: string) => `Updated ${time}`,
  open: "Open",
  none: "None",
  attention: {
    icon: BellRing,
    title: "Needs attention",
    allClear: "Nothing needs you right now.",
    items: {
      hosts: (n: number) => `${n} host${n === 1 ? "" : "s"} waiting for verification`,
      waiting: (n: number) => `${n} booking request${n === 1 ? "" : "s"} waiting for a host to answer`,
      quiet: (n: number) => `${n} listed charger${n === 1 ? " has" : "s have"} not checked in for 7 days`,
      errors: (n: number) => `${n} open error${n === 1 ? "" : "s"}`,
      bugs: (n: number) => `${n} open bug report${n === 1 ? "" : "s"}`,
      database: () => "The database cannot be reached",
    },
  },
  hosts: { icon: ShieldCheck, title: "Host queue", pending: "Waiting", approved: "Approved (7 d)", rejected: "Rejected (7 d)", oldest: "Waiting longest", waiting: (since: string) => `waiting ${since}` },
  listings: { icon: MapPin, title: "Listings", live: "Listed", paused: "Paused", inReview: "In review", quiet: "Gone quiet (7 d)", emergency: "Emergency-ready" },
  areas: { icon: MapPinned, title: "Coverage by area", chargers: "Chargers", bookings: "Bookings (7 d)", empty: "No listed chargers yet." },
  bookings: { icon: CalendarClock, title: "Bookings today", upcoming: "Upcoming", charging: "Charging", ended: "Ended", closed: "Closed", chart: "Bookings per day, last 14 days", waiting: "Waiting for a host", busy: "Chargers in use" },
  live: { icon: Zap, title: "Charging right now", empty: "Nobody is charging right now.", at: "at", paused: "paused" },
  response: { icon: Timer, title: "Host response (7 d)", acceptance: "Acceptance rate", average: "Average answer time", hint: "Expired requests count as not accepted." },
  users: { icon: Users, title: "Users", total: "Total", drivers: "Drivers", hosts: "Hosts", new: "New (7 d)", suspended: "Suspended", chart: "Sign-ups per day, last 14 days" },
  system: { icon: Activity, title: "System", database: "Database", up: "Up", down: "Down", errors: "Open errors", bugs: "Open bug reports", security: "Security events (24 h)", crashes: "App crashes (7 d)" },
  team: { icon: UserCog, title: "Team", superadmins: "Super admins", admins: "Admins", recent: "Recent sign-ins", roles: { superadmin: "Super admin", admin: "Admin" } },
  activity: {
    icon: History,
    title: "Recent admin activity",
    empty: "No admin actions yet.",
    actions: {
      "host.approve": "approved a host",
      "host.reject": "rejected a host",
      "listing.pause": "paused a listing",
      "listing.relist": "listed a charger again",
      "user.suspend": "suspended a user",
      "user.unsuspend": "lifted a suspension",
      "team.add": "added an admin",
      "team.update": "changed an admin",
      "team.remove": "removed an admin",
      "team.reset_password": "reset an admin's password",
      "team.reset_two_factor": "turned off an admin's 2FA",
    } as Record<string, string>,
  },
  locked: {
    icon: Lock,
    soon: "Coming later",
    disputes: { icon: Scale, title: "Disputes", text: "Open disputes and how long they have waited, once billing is built." },
    revenue: { icon: Wallet, title: "Revenue", text: "Energy sold, commission and payouts, once billing is built." },
  },
  time: { icon: Clock, seconds: "s", minutes: "min" },
  empty: { icon: Users, title: "No widgets for you yet", description: "Ask a super admin for permissions to see each page's numbers here." },
} as const;
