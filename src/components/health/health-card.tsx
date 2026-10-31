import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { healthCopy } from "@/content/health";

type HealthCardProps = {
  icon: LucideIcon;
  title: string;
  /** true: Up, false: Down, undefined: no badge. */
  ok?: boolean;
  /** Shown beside the badge, such as a response time. */
  meta?: string;
  children: ReactNode;
  className?: string;
};

/** One part of the system: an icon, its name, Up or Down, then its numbers. */
export function HealthCard({ icon: Icon, title, ok, meta, children, className }: HealthCardProps) {
  return (
    <Card className={`grid content-start gap-4 ${className ?? ""}`}>
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <span aria-hidden="true" className="grid size-7 place-items-center rounded-sm border border-line bg-surface-muted text-muted">
            <Icon className="size-3.5" />
          </span>
          <h2 className="text-[0.8125rem] font-semibold text-heading">{title}</h2>
        </div>
        <div className="flex items-center gap-2">
          {meta ? <span className="text-xs text-muted tabular-nums">{meta}</span> : null}
          {ok === undefined ? null : (
            <Badge variant={ok ? "accent" : "danger"} showDot>
              {ok ? healthCopy.labels.up : healthCopy.labels.down}
            </Badge>
          )}
        </div>
      </div>
      {children}
    </Card>
  );
}

/** A labelled number in a card. */
export function Stat({ label, value, tone }: { label: string; value: ReactNode; tone?: "danger" | "warning" }) {
  const color = tone === "danger" ? "text-danger" : tone === "warning" ? "text-warning" : "text-heading";
  return (
    // Own line heights, so a label or value that wraps never runs into the line below it.
    <div className="flex min-w-0 flex-col gap-1">
      <span className="text-xs leading-snug text-muted">{label}</span>
      <span className={`text-[0.9375rem] leading-snug font-semibold tabular-nums break-words ${color}`}>{value}</span>
    </div>
  );
}

/**
 * Stats in a grid. Two columns fit a one-third card; wide cards (two-thirds of the row)
 * take three from the sm breakpoint.
 */
export function Stats({ wide = false, children }: { wide?: boolean; children: ReactNode }) {
  return <div className={`grid grid-cols-2 gap-x-4 gap-y-3.5 ${wide ? "sm:grid-cols-3" : ""}`}>{children}</div>;
}

/** The error text from a failed check. */
export function CheckError({ error }: { error: string }) {
  return <p className="rounded-sm border border-danger/30 bg-danger-soft px-3 py-2 text-xs text-danger">{error}</p>;
}
