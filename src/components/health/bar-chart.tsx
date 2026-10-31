"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";

type Bar = { key: string; label: string; value: number; detail?: string };

type BarChartProps = {
  /** Names the chart; one series, so no legend. */
  title: string;
  bars: Bar[];
  /** accent for volume, danger for failures. */
  tone?: "accent" | "danger";
  unit?: string;
};

const HEIGHT = 72;

/**
 * A small single-series bar chart: thin bars on one baseline, a 2px gap between them, a
 * recessive baseline, and a tooltip on hover or focus. A hidden table gives the same numbers
 * to screen readers.
 */
export function BarChart({ title, bars, tone = "accent", unit = "" }: BarChartProps) {
  const [active, setActive] = useState<number | null>(null);
  const max = Math.max(1, ...bars.map(bar => bar.value));
  const fill = tone === "danger" ? "bg-danger" : "bg-accent";
  const shown = active === null ? null : bars[active];

  return (
    <figure className="grid gap-2">
      <figcaption className="flex items-baseline justify-between gap-2 text-xs text-muted">
        <span>{title}</span>
        <span className="tabular-nums text-fg" aria-live="polite">
          {shown ? `${shown.label}: ${shown.value}${unit}${shown.detail ? ` · ${shown.detail}` : ""}` : `max ${max}${unit}`}
        </span>
      </figcaption>
      <div className="flex items-end gap-0.5 border-b border-line" style={{ height: HEIGHT }} onMouseLeave={() => setActive(null)} aria-hidden="true">
        {bars.map((bar, index) => (
          // The hit area is the full column, bigger than the bar itself.
          <div
            key={bar.key}
            className="flex h-full flex-1 cursor-default items-end"
            onMouseEnter={() => setActive(index)}
          >
            <div
              className={cn("w-full rounded-t-[2px] transition-opacity", fill, active !== null && active !== index && "opacity-40")}
              style={{ height: bar.value ? Math.max(2, (bar.value / max) * HEIGHT) : 0 }}
            />
          </div>
        ))}
      </div>
      <table className="sr-only">
        <caption>{title}</caption>
        <tbody>
          {bars.map(bar => (
            <tr key={bar.key}>
              <th scope="row">{bar.label}</th>
              <td>
                {bar.value}
                {unit}
                {bar.detail ? `, ${bar.detail}` : ""}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </figure>
  );
}
