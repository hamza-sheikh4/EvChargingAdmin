/** Shared by the inline script below and the client store in lib/preferences.ts. */
export const storageKey = "admin-preferences";
export const darkQuery = "(prefers-color-scheme: dark)";

export type ThemePreference = "light" | "dark" | "system";

export type Preferences = {
  theme: ThemePreference;
  reduceTransparency: boolean;
  compactTables: boolean;
  /** The section to open when the panel starts. */
  landingPage: string;
  sounds: boolean;
};

export const defaultPreferences: Preferences = {
  theme: "system",
  reduceTransparency: false,
  compactTables: false,
  landingPage: "/",
  sounds: true,
};

/**
 * Runs in <head> before the first paint, so saved settings never flash.
 * Keep it in step with applyPreferences() in lib/preferences.ts.
 */
export const preferencesScript = `(function(){try{var p=JSON.parse(localStorage.getItem("${storageKey}")||"{}");var t=p.theme||"system";var d=t==="dark"||(t==="system"&&matchMedia("${darkQuery}").matches);var h=document.documentElement;h.setAttribute("data-theme",d?"dark":"light");if(p.reduceTransparency)h.setAttribute("data-transparency","reduced");if(p.compactTables)h.setAttribute("data-density","compact")}catch(e){}})()`;
