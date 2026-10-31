"use client";

import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { SettingsModal } from "@/components/settings/settings-modal";
import type { SettingsCategory } from "@/content/settings";

type SettingsContextValue = { openSettings: (category: SettingsCategory) => void };

const SettingsContext = createContext<SettingsContextValue | null>(null);

/**
 * Settings is a modal, not a page. Anything inside the dashboard can open it at a category,
 * and Ctrl+, (Cmd+, on a Mac) opens it from anywhere.
 */
export function SettingsProvider({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  // Kept while closing, so the panel does not switch sections during its exit animation.
  const [category, setCategory] = useState<SettingsCategory>("appearance");
  const value = useMemo(
    () => ({
      openSettings: (next: SettingsCategory) => {
        setCategory(next);
        setOpen(true);
      },
    }),
    [],
  );

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if ((event.ctrlKey || event.metaKey) && event.key === ",") {
        event.preventDefault();
        setOpen(true);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <SettingsContext.Provider value={value}>
      {children}
      <SettingsModal open={open} category={category} onCategoryChange={setCategory} onClose={() => setOpen(false)} />
    </SettingsContext.Provider>
  );
}

export function useSettings(): SettingsContextValue {
  const context = useContext(SettingsContext);
  if (!context) throw new Error("useSettings must be used inside SettingsProvider");
  return context;
}
