import { CircleAlert } from "lucide-react";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export function getFieldIds(id: string) {
  return { hint: `${id}-hint`, error: `${id}-error` };
}

/** Space-separated ids for aria-describedby, or undefined when there are none. */
export function getDescribedBy(id: string, hint?: string, error?: string) {
  const ids = getFieldIds(id);
  const parts = [hint ? ids.hint : null, error ? ids.error : null].filter(Boolean);
  return parts.length > 0 ? parts.join(" ") : undefined;
}

export const fieldControlClass = cn(
  "flex w-full items-center gap-2 rounded-sm border bg-surface px-2.5 text-[0.8125rem] text-fg",
  "focus-within:border-accent focus-within:ring-2 focus-within:ring-accent-soft",
);

export const fieldErrorClass = "border-danger ring-2 ring-danger-soft";

type FormFieldProps = {
  id: string;
  label: string;
  hint?: string;
  error?: string;
  hideLabel?: boolean;
  className?: string;
  children: ReactNode;
};

/** Label, control slot, hint and error, shared by Input and Textarea. */
export function FormField({ id, label, hint, error, hideLabel, className, children }: FormFieldProps) {
  const ids = getFieldIds(id);

  return (
    <div className={cn("grid gap-1.5", className)}>
      <label htmlFor={id} className={cn("text-xs font-semibold text-fg", hideLabel && "sr-only")}>
        {label}
      </label>
      {children}
      {hint ? (
        <p id={ids.hint} className="text-xs text-muted">
          {hint}
        </p>
      ) : null}
      {error ? (
        <p id={ids.error} className="flex items-start gap-1.5 text-xs font-semibold text-fg">
          <CircleAlert aria-hidden="true" className="mt-0.5 size-4 shrink-0 text-danger" />
          {error}
        </p>
      ) : null}
    </div>
  );
}
