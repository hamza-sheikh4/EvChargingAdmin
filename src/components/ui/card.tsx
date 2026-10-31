import { cva, type VariantProps } from "class-variance-authority";
import type { ComponentProps } from "react";
import { cn } from "@/lib/utils";

/** Flat panels with a thin line. No shadow, no blur: those are kept for overlays. */
export const cardVariants = cva("rounded-md border border-line", {
  variants: {
    variant: {
      default: "bg-surface",
      muted: "bg-surface-muted",
    },
    padding: {
      none: "",
      sm: "p-4",
      md: "p-5",
    },
  },
  defaultVariants: {
    variant: "default",
    padding: "md",
  },
});

type CardProps = ComponentProps<"div"> & VariantProps<typeof cardVariants>;

export function Card({ variant, padding, className, ...props }: CardProps) {
  return <div className={cn(cardVariants({ variant, padding }), className)} {...props} />;
}
