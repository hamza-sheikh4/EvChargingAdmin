// Mirrors src/styles/tokens.css and themes.css, which are the source of truth. Keep them in sync.

export const colors = {
  forest: "#0E3B2E",
  emerald: "#1F7A5A",
  mint: "#3DDC97",
  sage: "#A8D5BA",
  white: "#FFFFFF",
} as const;

/** The page background per theme, for the browser's theme-color. */
export const canvas = {
  light: "#FFFFFF",
  dark: "#0C0E0D",
} as const;

export const radii = {
  xs: 3,
  sm: 5,
  md: 7,
  lg: 10,
} as const;

export const layout = {
  sidebar: 240,
  topbar: 52,
  content: 1216,
  drawer: 448,
  drawerWide: 736,
  settings: 832,
} as const;
