import { Slot, Slottable } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { LoaderCircle } from "lucide-react";
import type { ComponentProps, ReactNode } from "react";
import { cn } from "@/lib/utils";

export const buttonVariants = cva(
  [
    "inline-flex select-none items-center justify-center gap-1.5 whitespace-nowrap rounded-sm font-medium transition-colors",
    "disabled:pointer-events-none disabled:opacity-55 aria-disabled:pointer-events-none aria-disabled:opacity-55",
    "[&_svg]:size-3.5 [&_svg]:shrink-0",
  ],
  {
    variants: {
      variant: {
        primary: "bg-accent text-on-accent hover:opacity-90",
        secondary: "border border-line-strong bg-surface text-fg hover:bg-hover",
        ghost: "text-muted hover:bg-hover hover:text-fg",
        danger: "border border-line-strong bg-surface text-danger hover:border-danger hover:bg-danger-soft",
      },
      size: {
        sm: "h-7 px-2.5 text-xs",
        md: "h-8 px-3 text-[0.8125rem]",
        icon: "size-8",
        "icon-sm": "size-7",
      },
      fullWidth: {
        true: "w-full",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
    },
  },
);

type ButtonProps = ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    /** Render the single child element (for example a Link) with button styles. */
    asChild?: boolean;
    loading?: boolean;
    leftIcon?: ReactNode;
    rightIcon?: ReactNode;
  };

export function Button({
  asChild = false,
  loading = false,
  disabled,
  leftIcon,
  rightIcon,
  variant,
  size,
  fullWidth,
  className,
  children,
  type,
  ...props
}: ButtonProps) {
  const Component = asChild ? Slot : "button";
  const isDisabled = disabled || loading;

  return (
    <Component
      className={cn(buttonVariants({ variant, size, fullWidth }), className)}
      {...(asChild
        ? { "aria-disabled": isDisabled || undefined }
        : { type: type ?? "button", disabled: isDisabled })}
      aria-busy={loading || undefined}
      {...props}
    >
      {loading ? (
        <LoaderCircle aria-hidden="true" className="animate-spin motion-reduce:animate-none" />
      ) : (
        leftIcon
      )}
      <Slottable>{children}</Slottable>
      {rightIcon}
    </Component>
  );
}
