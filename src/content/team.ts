import { ShieldOff, UserCog, UserPlus } from "lucide-react";

export const teamCopy = {
  page: {
    title: "Team",
    description: "Add admins and choose exactly what each one can see and change.",
  },
  add: { label: "Add admin", icon: UserPlus },
  columns: { member: "Member", role: "Role", access: "Access", security: "2FA", status: "Status", lastActive: "Last sign-in" },
  access: (count: number, total: number) => (count === total ? "Full access" : `${count} of ${total} permissions`),
  status: { active: "Active", suspended: "Suspended" },
  twoFactor: { on: "On", off: "Off" },
  you: "You",
  never: "Never",
  sections: {
    superadmins: { title: "Super admins" },
    admins: { title: "Admins", description: "Only the permissions they are given, grouped by page." },
  },
  empty: {
    icon: UserCog,
    title: "No admins yet",
    description: "Add an admin to share the work. You pick their permissions.",
  },
  noAccess: {
    icon: ShieldOff,
    title: "No access to the team",
    description: "Ask a super admin for the Team: See the page permission."
  },
  drawer: {
    addTitle: "Add admin",
    addDescription: "They sign in with this email and a temporary password you pass on.",
    editDescription: "Changes apply on their next page load.",
    name: "Full name",
    namePlaceholder: "Ayesha Khan",
    email: "Email",
    emailPlaceholder: "ayesha@example.com",
    permissions: "Permissions",
    all: "All",
    notYours: "You can only give permissions you have.",
    noEdit: "You can see their permissions but not change them.",
    needsView: "Turning on any action also turns on See the page for that group.",
    selfNote: "This is you. Change your own account in Settings.",
    cancel: "Cancel",
    close: "Done",
    add: "Add admin",
    save: "Save permissions",
  },
  actions: {
    title: "Account",
    suspend: "Suspend",
    suspendHint: "Blocks sign-in and ends their current logins.",
    reactivate: "Reactivate",
    resetPassword: "Reset password",
    resetPasswordHint: "Gives a new temporary password and signs them out.",
    resetTwoFactor: "Turn off 2FA",
    resetTwoFactorHint: "For a lost phone. They can set it up again.",
    remove: "Remove from team",
    removeHint: "Their past actions stay in the audit log.",
    confirmSuspend: (name: string) => ({
      title: `Suspend ${name}?`,
      description: "They are signed out straight away and cannot sign in until you reactivate them.",
      confirmLabel: "Suspend",
    }),
    confirmReset: (name: string) => ({
      title: `Reset the password for ${name}?`,
      description: "Their current password stops working and they are signed out. You get a temporary password to pass on.",
      confirmLabel: "Reset password",
    }),
    confirmRemove: (name: string) => ({
      title: `Remove ${name} from the team?`,
      description: "They lose admin access straight away. Their past actions stay in the audit log.",
      confirmLabel: "Remove",
    }),
  },
  temporary: {
    title: "Temporary password",
    description: (name: string) =>
      `Pass this to ${name} privately. It is shown once. They should change it in Settings > Security after signing in.`,
    copy: "Copy",
    copied: "Copied.",
  },
  errors: {
    name: "Enter their full name.",
    email: "Enter a valid email address.",
    permissions: "Give at least one permission.",
  },
  toast: {
    added: (name: string) => `${name} was added.`,
    updated: (name: string) => `Saved changes for ${name}.`,
    twoFactorOff: (name: string) => `2FA turned off for ${name}.`,
    removed: "Removed from the team.",
  },
} as const;
