"use client";

import { useSyncExternalStore } from "react";
import { darkQuery, defaultPreferences, storageKey, type Preferences } from "@/lib/preferences-script";

const listeners = new Set<() => void>();
let cachedRaw: string | null | undefined;
let cached: Preferences = defaultPreferences;

/** The saved settings, merged over the defaults. Cached so useSyncExternalStore sees a stable object. */
function read(): Preferences {
  let raw: string | null = null;
  try {
    raw = localStorage.getItem(storageKey);
  } catch {
    // Storage blocked: defaults.
  }
  if (raw === cachedRaw) return cached;
  cachedRaw = raw;
  try {
    cached = { ...defaultPreferences, ...(raw ? (JSON.parse(raw) as Partial<Preferences>) : {}) };
  } catch {
    cached = defaultPreferences;
  }
  return cached;
}

function toggleAttribute(name: string, value: string, on: boolean) {
  if (on) document.documentElement.setAttribute(name, value);
  else document.documentElement.removeAttribute(name);
}

function applyPreferences(preferences: Preferences) {
  const dark = preferences.theme === "dark" || (preferences.theme === "system" && matchMedia(darkQuery).matches);
  document.documentElement.setAttribute("data-theme", dark ? "dark" : "light");
  toggleAttribute("data-transparency", "reduced", preferences.reduceTransparency);
  toggleAttribute("data-density", "compact", preferences.compactTables);
}

export function setPreference<K extends keyof Preferences>(key: K, value: Preferences[K]) {
  const next = { ...read(), [key]: value };
  try {
    localStorage.setItem(storageKey, JSON.stringify(next));
  } catch {
    // Private windows can block storage. The change still applies for this visit.
    cachedRaw = undefined;
    cached = next;
  }
  applyPreferences(next);
  listeners.forEach(listener => listener());
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  // Follow the OS while the theme is "system".
  const media = matchMedia(darkQuery);
  const onChange = () => {
    applyPreferences(read());
    listener();
  };
  media.addEventListener("change", onChange);
  return () => {
    listeners.delete(listener);
    media.removeEventListener("change", onChange);
  };
}

export function usePreferences(): Preferences {
  return useSyncExternalStore(subscribe, read, () => defaultPreferences);
}
