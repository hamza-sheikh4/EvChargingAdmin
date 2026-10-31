import type { Permission, PermissionGroupId } from "@/config/permissions";

/** One group per panel page. */
export const permissionGroupLabels: Record<PermissionGroupId, string> = {
  hosts: "Host verification",
  listings: "Listings",
  users: "Users",
  bookings: "Bookings",
  team: "Team",
  health: "Health",
};

export const permissionCopy: Record<Permission, { label: string; description: string }> = {
  hosts_view: { label: "See the page", description: "Host applications, contact details and chargers." },
  hosts_view_documents: { label: "See CNIC details", description: "The CNIC number and both CNIC photos. Every open is logged." },
  hosts_approve: { label: "Approve hosts", description: "Verifies the host so their charger can go live." },
  hosts_reject: { label: "Reject hosts", description: "Rejects with a reason, or takes verification back." },

  listings_view: { label: "See the page", description: "Every charger, its photos, price and hours." },
  listings_view_location: { label: "See exact pins", description: "The charger's exact location on a map." },
  listings_pause: { label: "Pause listings", description: "Hides a charger from drivers, with a reason." },
  listings_relist: { label: "List again", description: "Shows a paused charger to drivers again." },

  users_view: { label: "See the page", description: "Drivers and hosts, their vehicles and chargers." },
  users_suspend: { label: "Suspend users", description: "Signs them out everywhere and blocks sign-in." },
  users_unsuspend: { label: "Lift suspensions", description: "Lets a suspended user sign in again." },

  bookings_view: { label: "See the page", description: "Every booking, with both people and the timeline." },
  bookings_view_photos: { label: "See end photos", description: "The driver's photos of the charger and car screens." },

  team_view: { label: "See the page", description: "Everyone on the team and their permissions." },
  team_add: { label: "Add admins", description: "Creates an admin with a temporary password." },
  team_edit: { label: "Change permissions", description: "Only permissions you have yourself." },
  team_suspend: { label: "Suspend admins", description: "Blocks an admin's sign-in, or lets them back." },
  team_reset: { label: "Reset passwords and 2FA", description: "For a forgotten password or a lost phone." },
  team_remove: { label: "Remove admins", description: "Takes someone off the team for good." },

  health_view: { label: "See the page", description: "Status, charts and environment for every part of PakVolt." },
  health_view_logs: { label: "See logs and reports", description: "Error details, crash reports, bug reports and screenshots." },
  health_resolve: { label: "Resolve problems", description: "Mark errors resolved and close bug reports." },
};

export const roleLabels = {
  superadmin: "Super admin",
  admin: "Admin",
} as const;
