"use client";

import { cn } from "@/lib/utils";

type FilterTabsProps<T extends string> = {
  label: string;
  tabs: Record<T, string>;
  value: T;
  onChange: (value: T) => void;
  /** Shown beside each tab once loaded. */
  counts?: Partial<Record<T, number>>;
};

/** A segmented row of filters, each with its count, such as Pending / Verified / Rejected. */
export function FilterTabs<T extends string>({ label, tabs, value, onChange, counts }: FilterTabsProps<T>) {
  const keys = Object.keys(tabs) as T[];
  return (
    <div role="tablist" aria-label={label} className="flex flex-wrap gap-1 rounded-md border border-line bg-surface-muted p-0.5">
      {keys.map(tab => (
        <button
          key={tab}
          type="button"
          role="tab"
          aria-selected={value === tab}
          onClick={() => onChange(tab)}
          className={cn(
            "flex h-7 items-center gap-1.5 rounded-sm px-3 text-[0.8125rem] font-medium transition-colors",
            value === tab ? "bg-surface text-heading shadow-overlay" : "text-muted hover:text-fg",
          )}
        >
          {tabs[tab]}
          <span className="text-xs text-muted tabular-nums">{counts?.[tab] ?? ""}</span>
        </button>
      ))}
    </div>
  );
}
