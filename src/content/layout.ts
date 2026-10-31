export const layoutCopy = {
  skipToContent: "Skip to content",
  homeLabel: "overview",
  navLabel: "Admin sections",
  locked: "Soon",
  lockedHint: (label: string) => `${label} is coming later.`,
  openMenu: "Open menu",
  closeMenu: "Close menu",
  close: "Close",
  cancel: "Cancel",
  retry: "Try again",
  environment: { development: "Dev", production: "Live" },
  account: {
    settings: "Settings",
    shortcut: "Ctrl ,",
    openAccount: "Open your account settings",
    loadFailed: "Could not load your account",
  },
} as const;

export const notFoundCopy = {
  title: "Page not found",
  description: "That admin page does not exist.",
  back: "Back to overview",
} as const;

export const errorCopy = {
  network: "The server could not be reached.",
  failed: (status: number) => `Request failed (${status}).`,
  title: "Something went wrong",
  crashed: "This page hit an error. It was reported to the team.",
} as const;
