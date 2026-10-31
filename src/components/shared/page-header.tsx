import type { ReactNode } from "react";
import type { PageCopy } from "@/types";

type PageHeaderProps = PageCopy & {
  /** Buttons or filters on the right, such as "Invite admin". */
  actions?: ReactNode;
};

export function PageHeader({ title, description, actions }: PageHeaderProps) {
  return (
    <div className="flex flex-wrap items-end justify-between gap-4">
      <div className="grid gap-1">
        <h1 className="text-lg font-semibold tracking-tight text-heading">{title}</h1>
        <p className="text-[0.8125rem] text-muted">{description}</p>
      </div>
      {actions ? <div className="flex items-center gap-2">{actions}</div> : null}
    </div>
  );
}
