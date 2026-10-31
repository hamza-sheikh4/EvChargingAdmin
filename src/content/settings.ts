import { Monitor, Moon, Palette, ShieldCheck, SlidersHorizontal, Sun, UserRound } from "lucide-react";

export const settingsCopy = {
  title: "Settings",
  close: "Close settings",
  groups: {
    personal: "Personal",
    preferences: "Preferences",
  },
  categories: {
    account: { group: "personal", label: "Account", icon: UserRound, description: "Your profile and what you can do in the panel." },
    security: { group: "personal", label: "Security", icon: ShieldCheck, description: "Password, two-factor sign-in and where you are signed in." },
    appearance: { group: "preferences", label: "Appearance", icon: Palette, description: "How the panel looks on this device." },
    general: { group: "preferences", label: "General", icon: SlidersHorizontal, description: "Start page and alerts." },
  },
  savedHint: "Saved on this device.",
  appearance: {
    theme: { title: "Theme", description: "System follows your device's light or dark setting." },
    themes: {
      light: { label: "Light", icon: Sun },
      dark: { label: "Dark", icon: Moon },
      system: { label: "System", icon: Monitor },
    },
    display: { title: "Display" },
    transparency: { label: "Reduce transparency", description: "Menus, drawers and this panel turn solid instead of frosted." },
    compact: { label: "Compact tables", description: "Tighter rows, so more fit on screen." },
  },
  general: {
    startPage: { label: "Start page", description: "The section that opens when you open the panel." },
    alerts: { title: "Alerts" },
    sounds: { label: "Notification sounds", description: "Play a sound when a new host application arrives." },
  },
  account: {
    details: { title: "Details" },
    name: "Name",
    email: "Email",
    role: "Role",
    lastLogin: "Last sign-in",
    permissions: { title: "Permissions", description: "Set on the Team page by the super admin or a team manager." },
    allowed: "Allowed",
    notAllowed: "Not allowed",
  },
  security: {
    password: {
      title: "Password",
      description: "Changing it signs you out on every other device.",
      current: "Current password",
      next: "New password",
      nextHint: "At least 10 characters.",
      confirm: "Repeat new password",
      mismatch: "The new passwords do not match.",
      tooShort: "Use at least 10 characters.",
      save: "Change password",
      saved: "Password changed.",
    },
    twoFactor: {
      title: "Two-factor sign-in",
      description: "Optional. After your password, you also enter a code from an authenticator app.",
      on: "On",
      off: "Off",
      start: "Set up",
      steps: [
        "Open an authenticator app (Google Authenticator, Microsoft Authenticator, Authy or 1Password).",
        "Add an account, choose to enter a setup key, and type the key below. Time-based.",
        "Enter the 6-digit code the app shows.",
      ],
      key: "Setup key",
      copyKey: "Copy key",
      copied: "Copied.",
      openApp: "Open in authenticator app",
      code: "Code from the app",
      enable: "Turn on",
      enabled: "Two-factor sign-in is on.",
      cancel: "Cancel",
      disable: "Turn off",
      disablePassword: "Your password",
      disabled: "Two-factor sign-in is off.",
    },
    sessions: {
      title: "Sessions",
      browser: "This browser",
      signOut: "Sign out",
      everywhere: "Sign out everywhere",
      everywhereHint: "Ends every login on every phone and computer, this one included.",
      confirm: {
        title: "Sign out everywhere?",
        description: "Every login on every phone and computer ends, including this one. You will need to sign in again.",
        confirmLabel: "Sign out everywhere",
      },
    },
  },
} as const;

export type SettingsCategory = keyof typeof settingsCopy.categories;
export type SettingsGroup = keyof typeof settingsCopy.groups;
