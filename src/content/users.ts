import { Search, UserX, Users } from "lucide-react";
import type { UserFilter } from "@/types";

export const usersCopy = {
  page: {
    title: "Users",
    description: "Every app account: drivers, hosts, or both. Suspend anyone who should not use PakVolt.",
  },
  tabs: { all: "All", drivers: "Drivers", hosts: "Hosts", suspended: "Suspended" } satisfies Record<UserFilter, string>,
  search: { label: "Search users", placeholder: "Name, phone or email", icon: Search },
  columns: { user: "User", roles: "Uses", vehicles: "Vehicles", joined: "Joined", lastLogin: "Last sign-in", status: "Status" },
  roles: { driver: "Driver", host: "Host" },
  status: { active: "Active", suspended: "Suspended" },
  noName: "No name yet",
  never: "Never",
  empty: {
    all: { icon: Users, title: "No users yet", description: "Accounts appear here once people sign up in the app." },
    drivers: { icon: Users, title: "No drivers yet", description: "People who finish driver setup appear here." },
    hosts: { icon: Users, title: "No hosts yet", description: "People who list a charger appear here." },
    suspended: { icon: UserX, title: "Nobody is suspended", description: "Accounts you suspend appear here." },
    search: { icon: Search, title: "No matches", description: "Try a different name, number or email." },
  },
  detail: {
    loading: "Loading user",
    profile: { title: "Account", phone: "Phone", email: "Email", joined: "Joined", lastLogin: "Last sign-in", driverSince: "Driver since", hostSince: "Host since", hostStatus: "Host verification" },
    vehicles: { title: "Vehicles", adapter: "Uses an adapter", unnamed: { car: "Car", bike: "Bike" } },
    chargers: { title: "Chargers", listed: "Listed", paused: "Paused", review: "In review" },
    history: { title: "Suspensions", suspended: "Suspended", unsuspended: "Unsuspended", by: "by" },
  },
  actions: {
    suspend: "Suspend user",
    unsuspend: "Lift suspension",
    reason: "Reason",
    reasonHint: "Kept in the audit log. They are signed out on every phone straight away.",
    presetsLabel: "Common reasons",
    presets: [
      "Fake or someone else's details.",
      "Abusive to drivers or hosts.",
      "Repeated no-shows or cancelled sessions.",
      "Payment disputes that point to fraud.",
    ],
    confirmSuspend: "Suspend",
    cancel: "Cancel",
    viewOnly: "You can view users but not suspend them.",
    confirmUnsuspend: {
      title: "Lift the suspension?",
      description: "They can sign in to the app again with their phone number.",
      confirmLabel: "Lift suspension",
    },
  },
  toast: {
    suspended: "Suspended and signed out everywhere.",
    unsuspended: "Suspension lifted. They can sign in again.",
  },
} as const;
