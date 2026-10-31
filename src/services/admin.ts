/**
 * The admin endpoints. The login is an httpOnly cookie set by the backend, so nothing here
 * handles a token: the browser sends the cookie with every /admin call (credentials: include).
 */
import type { Permission } from "@/config/permissions";
import { api } from "@/services/api";
import type {
  AddMemberRequest,
  AddMemberResponse,
  AdminProfile,
  BookingDetail,
  BookingFilter,
  BookingListResponse,
  EventFilters,
  EventKind,
  HealthOverview,
  OverviewData,
  SystemEventDetail,
  SystemEventRow,
  HostDetail,
  HostListResponse,
  HostStatus,
  ListingDetail,
  ListingFilter,
  ListingListResponse,
  UserDetail,
  UserFilter,
  UserListResponse,
  LoginResponse,
  TeamMember,
  TwoFactorSetup,
} from "@/types";

export const adminApi = {
  overview: () => api.get<OverviewData>("/admin/overview"),
  health: () => api.get<HealthOverview>("/admin/health"),
  healthEvents: (kind: EventKind, filters: EventFilters) =>
    api.get<{ events: SystemEventRow[]; open: number }>("/admin/health/events", { kind, ...filters, q: filters.q || undefined }),
  healthEvent: (id: string) => api.get<SystemEventDetail>(`/admin/health/events/${id}`),
  resolveEvent: (id: string) => api.post<{ status: "resolved" }>(`/admin/health/events/${id}/resolve`),
  reopenEvent: (id: string) => api.post<{ status: "open" }>(`/admin/health/events/${id}/reopen`),

  login: (email: string, password: string) => api.post<LoginResponse>("/admin/auth/login", { email, password }),
  twoFactor: (challenge: string, code: string) => api.post<LoginResponse>("/admin/auth/two-factor", { challenge, code }),
  logout: () => api.post<{ signedOut: true }>("/admin/auth/logout"),

  me: () => api.get<AdminProfile>("/admin/me"),
  changePassword: (currentPassword: string, newPassword: string) =>
    api.patch<{ changed: true }>("/admin/me/password", { currentPassword, newPassword }),
  /** Bumps tokenVersion, so every login made so far stops working, this one included. */
  signOutEverywhere: () => api.post<{ signedOut: true }>("/admin/me/sign-out-all"),
  setupTwoFactor: () => api.post<TwoFactorSetup>("/admin/me/two-factor/setup"),
  enableTwoFactor: (code: string) => api.post<{ enabled: true }>("/admin/me/two-factor/enable", { code }),
  disableTwoFactor: (password: string) => api.post<{ enabled: false }>("/admin/me/two-factor/disable", { password }),

  team: () => api.get<TeamMember[]>("/admin/team"),
  addMember: (body: AddMemberRequest) => api.post<AddMemberResponse>("/admin/team", body),
  updateMember: (id: string, body: { permissions?: Permission[]; status?: TeamMember["status"] }) =>
    api.patch<TeamMember>(`/admin/team/${id}`, body),
  resetPassword: (id: string) => api.post<{ temporaryPassword: string }>(`/admin/team/${id}/reset-password`),
  resetTwoFactor: (id: string) => api.post<TeamMember>(`/admin/team/${id}/reset-two-factor`),
  removeMember: (id: string) => api.delete<{ removed: true }>(`/admin/team/${id}`),

  hosts: (status: HostStatus, q: string) => api.get<HostListResponse>("/admin/hosts", { status, q: q || undefined }),
  host: (id: string) => api.get<HostDetail>(`/admin/hosts/${id}`),
  approveHost: (id: string) => api.post<{ status: "verified" }>(`/admin/hosts/${id}/approve`),
  rejectHost: (id: string, reason: string) => api.post<{ status: "rejected" }>(`/admin/hosts/${id}/reject`, { reason }),

  listings: (filter: ListingFilter, q: string) => api.get<ListingListResponse>("/admin/listings", { filter, q: q || undefined }),
  listing: (id: string) => api.get<ListingDetail>(`/admin/listings/${id}`),
  setListed: (id: string, listed: boolean, reason?: string) =>
    api.patch<{ listed: boolean }>(`/admin/listings/${id}`, { listed, reason }),

  users: (filter: UserFilter, q: string) => api.get<UserListResponse>("/admin/users", { filter, q: q || undefined }),
  user: (id: string) => api.get<UserDetail>(`/admin/users/${id}`),
  suspendUser: (id: string, reason: string) => api.post<{ suspended: true }>(`/admin/users/${id}/suspend`, { reason }),
  unsuspendUser: (id: string) => api.post<{ suspended: false }>(`/admin/users/${id}/unsuspend`),

  bookings: (filter: BookingFilter, q: string) => api.get<BookingListResponse>("/admin/bookings", { filter, q: q || undefined }),
  booking: (id: string) => api.get<BookingDetail>(`/admin/bookings/${id}`),
};

export const adminQuery = {
  me: ["admin", "me"] as const,
  team: ["admin", "team"] as const,
  overview: ["admin", "overview"] as const,
  health: ["admin", "health"] as const,
  healthEvents: (kind: EventKind, filters: EventFilters) => ["admin", "health", "events", kind, filters] as const,
  healthEventsAll: ["admin", "health", "events"] as const,
  healthEvent: (id: string) => ["admin", "health", "event", id] as const,
  hosts: (status: HostStatus, q: string) => ["admin", "hosts", status, q] as const,
  hostsAll: ["admin", "hosts"] as const,
  host: (id: string) => ["admin", "host", id] as const,
  listings: (filter: ListingFilter, q: string) => ["admin", "listings", filter, q] as const,
  listingsAll: ["admin", "listings"] as const,
  listing: (id: string) => ["admin", "listing", id] as const,
  users: (filter: UserFilter, q: string) => ["admin", "users", filter, q] as const,
  usersAll: ["admin", "users"] as const,
  user: (id: string) => ["admin", "user", id] as const,
  bookings: (filter: BookingFilter, q: string) => ["admin", "bookings", filter, q] as const,
  booking: (id: string) => ["admin", "booking", id] as const,
};
