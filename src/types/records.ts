/** Hosts and their chargers, as the /admin/hosts and /admin/listings endpoints send them. */

export type HostStatus = "pending" | "verified" | "rejected";
export type Connector = "type2" | "ccs2" | "chademo" | "gbt";
export type DayKey = "mon" | "tue" | "wed" | "thu" | "fri" | "sat" | "sun";
export type DayHours = { open: boolean; opensAt: string; closesAt: string };

/** A row in the review queue (GET /admin/hosts). */
export type HostSummary = {
  id: string;
  fullName: string;
  phone: string;
  status: HostStatus;
  submittedAt: string;
  areaId: string | null;
  locationType: "home" | "business" | null;
  chargerCount: number;
};

export type HostListResponse = {
  counts: Record<HostStatus, number>;
  hosts: HostSummary[];
};

export type HostCharger = {
  id: string;
  locationType: "home" | "business";
  areaId: string;
  /** Missing on the Listings page without listings_view_location. */
  coordinates?: { latitude: number; longitude: number };
  instructions: string;
  connectors: Connector[];
  powerKw: number;
  reportsEnergy: boolean;
  ratePaisa: number;
  hours: Record<DayKey, DayHours>;
  emergencyAvailability: boolean;
  listed: boolean;
  verifiedAt: string | null;
  lastCheckInAt: string | null;
  createdAt: string;
  /** Signed links, valid for an hour. */
  photos: { charger: string | null; connector: string | null };
};

/** One host, for review (GET /admin/hosts/:id). The CNIC is only ever in this response. */
export type HostDetail = {
  id: string;
  fullName: string;
  phone: string;
  email: string | null;
  photoUrl: string | null;
  memberSince: string;
  submittedAt: string | null;
  status: HostStatus;
  /** null without the hosts_view_documents permission. */
  cnic: string | null;
  address: string;
  documents: { front: string | null; back: string | null } | null;
  chargers: HostCharger[];
  history: { action: "approved" | "rejected"; by: string; at: string; reason: string | null }[];
};

export type ListingFilter = "all" | "live" | "paused" | "unverified";

export type ListingHost = { id: string; fullName: string; phone: string; status: HostStatus | null };

/** A row on the Listings page (GET /admin/listings). */
export type ListingSummary = {
  id: string;
  host: ListingHost;
  areaId: string;
  locationType: "home" | "business";
  ratePaisa: number;
  powerKw: number;
  connectors: Connector[];
  listed: boolean;
  verified: boolean;
  emergencyAvailability: boolean;
  lastCheckInAt: string | null;
  createdAt: string;
};

export type ListingListResponse = { counts: Record<ListingFilter, number>; listings: ListingSummary[] };

/** One charger (GET /admin/listings/:id), with its host and past pauses. */
export type ListingDetail = HostCharger & {
  host: ListingHost;
  history: { action: "paused" | "relisted"; by: string; at: string; reason: string | null }[];
};

export type UserFilter = "all" | "drivers" | "hosts" | "suspended";
export type UserRole = "driver" | "host";

/** A row on the Users page (GET /admin/users). Never the CNIC. */
export type UserSummary = {
  id: string;
  fullName: string;
  phone: string;
  email: string | null;
  roles: UserRole[];
  hostStatus: HostStatus | null;
  vehicleCount: number;
  joinedAt: string;
  lastLoginAt: string | null;
  suspendedAt: string | null;
};

export type UserListResponse = { counts: Record<UserFilter, number>; users: UserSummary[] };

export type UserDetail = UserSummary & {
  photoUrl: string | null;
  driverSince: string | null;
  hostSince: string | null;
  vehicles: { id: string; category: "car" | "bike"; manufacturer: string | null; model: string | null; connectors: Connector[]; usesAdapter: boolean }[];
  chargers: { id: string; areaId: string; locationType: "home" | "business"; listed: boolean; verified: boolean }[];
  history: { action: "suspended" | "unsuspended"; by: string; at: string; reason: string | null }[];
};
