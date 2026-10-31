import type { ComponentProps } from "react";
import { cn } from "@/lib/utils";

/**
 * A placeholder block with a moving shine, shown while data loads.
 * Size it with classes, for example "h-4 w-32". Screen readers skip it.
 */
export function Skeleton({ className, ...props }: ComponentProps<"div">) {
  return (
    <div
      aria-hidden="true"
      className={cn(
        "relative overflow-hidden rounded-xs bg-skeleton",
        "after:absolute after:inset-0 after:animate-shimmer",
        "after:bg-linear-to-r after:from-transparent after:via-(--skeleton-shine) after:to-transparent",
        className,
      )}
      {...props}
    />
  );
}
