import type { ReactNode } from "react";

/** A titled, bordered list of label and value rows, for reading a record. */
export function DetailSection({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="grid gap-2">
      <h3 className="text-[0.8125rem] font-semibold text-heading">{title}</h3>
      <dl className="divide-y divide-line rounded-md border border-line bg-surface">{children}</dl>
    </section>
  );
}

export function DetailRow({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="grid gap-1 px-4 py-2.5 text-[0.8125rem] sm:grid-cols-[10rem_1fr] sm:gap-4">
      <dt className="text-muted">{label}</dt>
      <dd className="min-w-0 break-words text-fg">{children}</dd>
    </div>
  );
}
