import type { LucideIcon } from "lucide-react";
import type { Permission } from "@/config/permissions";

export type NavItem = {
  label: string;
  href: string;
  icon: LucideIcon;
  /** Hidden from admins without it. Overview has none. */
  permission?: Permission;
  /** A planned section: shown locked, not clickable, no page yet. */
  locked?: boolean;
};

export type NavGroup = {
  label: string;
  items: NavItem[];
};

export type PageCopy = {
  title: string;
  description: string;
};

export type EmptyCopy = {
  icon: LucideIcon;
  title: string;
  description: string;
};

/** superadmin has every permission and cannot be edited. admin has the permissions it was given. */
export type AdminRole = "superadmin" | "admin";

/** An admin as the backend sends it (AdminSession.profile): GET /admin/me and each Team row. */
export type AdminProfile = {
  id: string;
  email: string;
  fullName: string;
  role: AdminRole;
  /** Every permission for the super admin. */
  permissions: Permission[];
  status: "active" | "suspended";
  twoFactorEnabled: boolean;
  lastLoginAt: string | null;
  createdAt: string;
};

export type TeamMember = AdminProfile;

export type AddMemberRequest = {
  fullName: string;
  email: string;
  permissions: Permission[];
};

/** The temporary password is shown once and never stored in the panel. */
export type AddMemberResponse = {
  member: TeamMember;
  temporaryPassword: string;
};

/** Step 1 of signing in. With 2FA on, the challenge goes to step 2 with the code. */
export type LoginResponse =
  | { twoFactor: false; admin: AdminProfile }
  | { twoFactor: true; challenge: string };

export type TwoFactorSetup = {
  /** Base32, typed into the authenticator app. */
  secret: string;
  /** otpauth:// link, opens the authenticator app on a phone. */
  uri: string;
};

export * from "./records";
export * from "./bookings";
export * from "./health";
export * from "./overview";
