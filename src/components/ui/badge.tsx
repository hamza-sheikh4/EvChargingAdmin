import { cva, type VariantProps } from "class-variance-authority";
import type { ComponentProps } from "react";
import { cn } from "@/lib/utils";

/** Status tags. driver is green and host is blue, matching the mobile app's role themes. */
export const badgeVariants = cva(
  "inline-flex items-center gap-1.5 whitespace-nowrap rounded-xs px-1.5 py-px text-xs font-medium",
  {
    variants: {
      variant: {
        neutral: "bg-surface-muted text-muted",
        accent: "bg-accent-soft text-accent",
        host: "bg-host-soft text-host",
        warning: "bg-warning-soft text-warning",
        danger: "bg-danger-soft text-danger",
      },
    },
    defaultVariants: {
      variant: "neutral",
    },
  },
);

type BadgeProps = ComponentProps<"span"> &
  VariantProps<typeof badgeVariants> & {
    showDot?: boolean;
  };

export function Badge({ variant, showDot = false, className, children, ...props }: BadgeProps) {
  return (
    <span className={cn(badgeVariants({ variant }), className)} {...props}>
      {showDot ? <span aria-hidden="true" className="size-1.5 rounded-full bg-current" /> : null}
      {children}
    </span>
  );
}
