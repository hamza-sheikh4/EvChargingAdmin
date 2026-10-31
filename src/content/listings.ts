import { MapPin, Search } from "lucide-react";
import type { ListingFilter } from "@/types";

export const listingsCopy = {
  page: {
    title: "Listings",
    description: "Every charger hosts have listed. Pause one that should not be shown to drivers.",
  },
  tabs: { all: "All", live: "Listed", paused: "Paused", unverified: "In review" } satisfies Record<ListingFilter, string>,
  search: { label: "Search listings", placeholder: "Host, phone or area", icon: Search },
  columns: { charger: "Charger", host: "Host", rate: "Rate", status: "Status", checkIn: "Last check-in" },
  state: {
    live: "Listed",
    paused: "Paused",
    unverified: "In review",
  },
  perKwh: "/kWh",
  emergency: "Emergency",
  never: "Never",
  empty: {
    all: { icon: MapPin, title: "No listings yet", description: "Chargers appear here once hosts list them." },
    live: { icon: MapPin, title: "Nothing listed right now", description: "Verified chargers that are switched on appear here." },
    paused: { icon: MapPin, title: "Nothing paused", description: "Chargers switched off by the host or by an admin appear here." },
    unverified: { icon: MapPin, title: "Nothing in review", description: "Chargers whose host is not verified yet appear here." },
    search: { icon: Search, title: "No matches", description: "Try a different name, number or area." },
  },
  detail: {
    loading: "Loading listing",
    host: { title: "Host", name: "Name", phone: "Phone", status: "Verification", open: "Review in Host verification" },
    map: { title: "Exact pin", label: "Map of the charger's exact pin" },
    activity: { title: "Activity", added: "Listed on", checkIn: "Last check-in" },
    history: { title: "Admin changes", paused: "Paused", relisted: "Listed again", by: "by" },
  },
  actions: {
    pause: "Pause listing",
    relist: "List again",
    reason: "Reason",
    reasonHint: "Kept in the audit log. The host is told their listing was paused.",
    presetsLabel: "Common reasons",
    presets: [
      "The map pin is in the wrong place.",
      "Drivers reported the charger is not working.",
      "The photos do not show a real charger.",
      "The price looks wrong.",
      "The host is not answering requests.",
    ],
    confirmPause: "Pause listing",
    cancel: "Cancel",
    unverified: "This host is not verified yet. Approve them in Host verification first.",
    viewOnly: "You can view listings but not pause or list them.",
    confirmRelist: {
      title: "List this charger again?",
      description: "Drivers can find it straight away while the host keeps it switched on.",
      confirmLabel: "List again",
    },
  },
  toast: {
    paused: "Listing paused. The host was told.",
    relisted: "Listed again. The host was told.",
  },
} as const;
