"use client";

import { useId, type ComponentProps, type ReactNode } from "react";
import {
  FormField,
  fieldControlClass,
  fieldErrorClass,
  getDescribedBy,
} from "@/components/ui/form-field";
import { cn } from "@/lib/utils";

type InputProps = Omit<ComponentProps<"input">, "size"> & {
  label: string;
  hint?: string;
  error?: string;
  hideLabel?: boolean;
  /** Content shown inside the field before the text, such as an icon. */
  leftAddon?: ReactNode;
  containerClassName?: string;
};

export function Input({
  id,
  label,
  hint,
  error,
  hideLabel,
  leftAddon,
  className,
  containerClassName,
  ...props
}: InputProps) {
  const generatedId = useId();
  const inputId = id ?? generatedId;

  return (
    <FormField
      id={inputId}
      label={label}
      hint={hint}
      error={error}
      hideLabel={hideLabel}
      className={containerClassName}
    >
      <div className={cn(fieldControlClass, "h-8", error ? fieldErrorClass : "border-line-strong")}>
        {leftAddon ? (
          <span aria-hidden="true" className="flex shrink-0 text-muted [&_svg]:size-4">
            {leftAddon}
          </span>
        ) : null}
        <input
          id={inputId}
          aria-invalid={error ? true : undefined}
          aria-describedby={getDescribedBy(inputId, hint, error)}
          className={cn(
            "h-full min-w-0 flex-1 bg-transparent placeholder:text-muted/70 focus-visible:outline-none",
            className,
          )}
          {...props}
        />
      </div>
    </FormField>
  );
}
