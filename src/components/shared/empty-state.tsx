import { Card } from "@/components/ui/card";
import type { EmptyCopy } from "@/types";

export function EmptyState({ icon: Icon, title, description }: EmptyCopy) {
  return (
    <Card className="grid justify-items-center gap-3 py-14 text-center">
      <span aria-hidden="true" className="grid size-10 place-items-center rounded-md border border-line bg-surface-muted text-muted">
        <Icon className="size-4" />
      </span>
      <div className="grid gap-1">
        <h2 className="font-semibold text-heading">{title}</h2>
        <p className="max-w-sm text-sm text-muted">{description}</p>
      </div>
    </Card>
  );
}
