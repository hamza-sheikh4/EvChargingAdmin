import { cva, type VariantProps } from "class-variance-authority";
import { cn, initials } from "@/lib/utils";

const avatarVariants = cva("grid shrink-0 place-items-center rounded-md bg-accent-soft font-semibold text-accent", {
  variants: {
    size: {
      sm: "size-8 text-xs",
      md: "size-10 text-sm",
      lg: "size-14 text-lg",
    },
  },
  defaultVariants: {
    size: "md",
  },
});

type AvatarProps = VariantProps<typeof avatarVariants> & {
  name: string;
  className?: string;
};

/** Initials in a tile. Decorative, since the name is always shown next to it. */
export function Avatar({ name, size, className }: AvatarProps) {
  return (
    <span aria-hidden="true" className={cn(avatarVariants({ size }), className)}>
      {initials(name)}
    </span>
  );
}
