import type { LucideIcon } from "lucide-react";
import { ArrowUpRight } from "lucide-react";
import Link from "next/link";
import type { ReactNode } from "react";
import { Card } from "@/components/ui/card";
import { overviewCopy } from "@/content/overview";

type WidgetProps = {
  icon: LucideIcon;
  title: string;
  /** The page it comes from; adds an Open link. */
  href?: string;
  children: ReactNode;
};

/** One Overview card. break-inside-avoid keeps it whole in the masonry columns. */
export function Widget({ icon: Icon, title, href, children }: WidgetProps) {
  return (
    <Card className="mb-4 grid break-inside-avoid gap-4">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <span aria-hidden="true" className="grid size-7 place-items-center rounded-sm border border-line bg-surface-muted text-muted">
            <Icon className="size-3.5" />
          </span>
          <h2 className="text-[0.8125rem] font-semibold text-heading">{title}</h2>
        </div>
        {href ? (
          <Link href={href} className="inline-flex items-center gap-0.5 rounded-xs text-xs font-medium text-muted hover:text-accent">
            {overviewCopy.open}
            <ArrowUpRight aria-hidden="true" className="size-3.5" />
          </Link>
        ) : null}
      </div>
      {children}
    </Card>
  );
}

/** A planned widget, shown locked like its sidebar tab. */
export function LockedWidget({ icon: Icon, title, text }: { icon: LucideIcon; title: string; text: string }) {
  const { locked } = overviewCopy;
  return (
    <div aria-disabled="true" className="mb-4 grid break-inside-avoid gap-2 rounded-md border border-dashed border-line-strong bg-surface-muted p-5 opacity-80">
      <div className="flex items-center justify-between gap-3">
        <span className="flex items-center gap-2 text-[0.8125rem] font-semibold text-fg">
          <Icon aria-hidden="true" className="size-4 text-muted" />
          {title}
        </span>
        <span className="inline-flex items-center gap-1 rounded-xs border border-line px-1.5 text-[0.625rem] font-medium text-muted">
          <locked.icon aria-hidden="true" className="size-2.5" />
          {locked.soon}
        </span>
      </div>
      <p className="text-xs text-muted">{text}</p>
    </div>
  );
}

/** A labelled number. */
export function Figure({ label, value, tone }: { label: string; value: ReactNode; tone?: "danger" | "warning" | "accent" }) {
  const color = tone === "danger" ? "text-danger" : tone === "warning" ? "text-warning" : tone === "accent" ? "text-accent" : "text-heading";
  return (
    <div className="flex min-w-0 flex-col gap-1">
      <span className="text-xs leading-snug text-muted">{label}</span>
      <span className={`text-lg leading-tight font-semibold tabular-nums ${color}`}>{value}</span>
    </div>
  );
}

export function Figures({ children }: { children: ReactNode }) {
  return <div className="grid grid-cols-2 gap-x-4 gap-y-3.5">{children}</div>;
}
