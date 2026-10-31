import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

type SectionProps = {
  title?: string;
  description?: string;
  children: ReactNode;
};

/** A titled block of settings inside a bordered list. */
export function SettingsSection({ title, description, children }: SectionProps) {
  return (
    <section className="grid gap-2.5">
      {title ? (
        <div className="grid gap-0.5">
          <h3 className="text-[0.8125rem] font-semibold text-heading">{title}</h3>
          {description ? <p className="text-xs text-muted">{description}</p> : null}
        </div>
      ) : null}
      <div className="divide-y divide-line rounded-md border border-line bg-surface">{children}</div>
    </section>
  );
}

type RowProps = {
  label: string;
  description?: string;
  /** Ties the label to a switch or select through aria-labelledby. */
  labelId?: string;
  children: ReactNode;
  className?: string;
};

/** Label and description on the left, the control on the right. */
export function SettingsRow({ label, description, labelId, children, className }: RowProps) {
  return (
    <div className={cn("flex items-center justify-between gap-6 px-4 py-3", className)}>
      <div className="grid min-w-0 gap-0.5">
        <span id={labelId} className="text-[0.8125rem] font-medium text-fg">{label}</span>
        {description ? <span className="text-xs text-muted">{description}</span> : null}
      </div>
      <div className="flex shrink-0 items-center gap-2">{children}</div>
    </div>
  );
}
