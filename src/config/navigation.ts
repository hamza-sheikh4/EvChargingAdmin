import { Activity, CalendarClock, LayoutDashboard, MapPin, Scale, ShieldCheck, UserCog, Users, Wallet } from "lucide-react";
import type { NavGroup } from "@/types";

/**
 * Sidebar sections, in order. Each link is a route under src/app/(dashboard), shown only with its
 * permission. Locked items are planned sections: shown with a lock, with no page behind them yet.
 */
export const sidebarNav: NavGroup[] = [
  {
    label: "Operations",
    items: [
      { label: "Overview", href: "/", icon: LayoutDashboard },
      { label: "Host verification", href: "/hosts", icon: ShieldCheck, permission: "hosts_view" },
      { label: "Listings", href: "/listings", icon: MapPin, permission: "listings_view" },
      { label: "Users", href: "/users", icon: Users, permission: "users_view" },
      { label: "Bookings", href: "/bookings", icon: CalendarClock, permission: "bookings_view" },
      { label: "Disputes", href: "/disputes", icon: Scale, locked: true },
    ],
  },
  {
    label: "Finance",
    items: [{ label: "Revenue", href: "/revenue", icon: Wallet, locked: true }],
  },
  {
    label: "System",
    items: [
      { label: "Team", href: "/team", icon: UserCog, permission: "team_view" },
      { label: "Health", href: "/health", icon: Activity, permission: "health_view" },
    ],
  },
];
