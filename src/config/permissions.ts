/**
 * Everything an admin can be allowed to do, grouped by panel page. The keys match the
 * AdminPermission enum in the backend, which checks them on every /admin route; the panel
 * uses them to hide what an admin cannot use. The first permission of each group is
 * "see the page": every other one in the group needs it, here and on the backend.
 * Labels and descriptions are in content/permissions.ts.
 */
export const permissionGroups = [
  { id: "hosts", permissions: ["hosts_view", "hosts_view_documents", "hosts_approve", "hosts_reject"] },
  { id: "listings", permissions: ["listings_view", "listings_view_location", "listings_pause", "listings_relist"] },
  { id: "users", permissions: ["users_view", "users_suspend", "users_unsuspend"] },
  { id: "bookings", permissions: ["bookings_view", "bookings_view_photos"] },
  { id: "team", permissions: ["team_view", "team_add", "team_edit", "team_suspend", "team_reset", "team_remove"] },
  { id: "health", permissions: ["health_view", "health_view_logs", "health_resolve"] },
] as const;

export type PermissionGroupId = (typeof permissionGroups)[number]["id"];
export type Permission = (typeof permissionGroups)[number]["permissions"][number];

export const allPermissions: Permission[] = permissionGroups.flatMap(group => [...group.permissions]);

/** The group's "see the page" permission. */
export const viewOf = (group: (typeof permissionGroups)[number]): Permission => group.permissions[0];

/** A new admin starts able to look but not change anything, and without the CNIC or exact pins. */
export const defaultNewPermissions: Permission[] = ["hosts_view", "listings_view", "users_view", "bookings_view", "health_view"];
