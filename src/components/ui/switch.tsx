import { cn } from "@/lib/utils";

type SwitchProps = {
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
  /** The id of the text that names this switch. */
  labelledBy?: string;
  label?: string;
  disabled?: boolean;
};

/** An on/off toggle. */
export function Switch({ checked, onCheckedChange, labelledBy, label, disabled }: SwitchProps) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-labelledby={labelledBy}
      aria-label={label}
      disabled={disabled}
      onClick={() => onCheckedChange(!checked)}
      className={cn(
        "relative inline-flex h-[1.125rem] w-8 shrink-0 items-center rounded-full border transition-colors disabled:opacity-50",
        checked ? "border-accent bg-accent" : "border-line-strong bg-line-strong",
      )}
    >
      <span
        aria-hidden="true"
        className={cn(
          "absolute top-px size-3.5 rounded-full shadow-sm transition-transform",
          checked ? "translate-x-[0.9375rem] bg-white" : "translate-x-px bg-white dark:bg-muted",
        )}
      />
    </button>
  );
}
