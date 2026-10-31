"use client";

import { useId, type ComponentProps } from "react";
import { FormField, fieldControlClass, fieldErrorClass, getDescribedBy } from "@/components/ui/form-field";
import { cn } from "@/lib/utils";

type TextareaProps = ComponentProps<"textarea"> & {
  label: string;
  hint?: string;
  error?: string;
  containerClassName?: string;
};

export function Textarea({ id, label, hint, error, className, containerClassName, ...props }: TextareaProps) {
  const generatedId = useId();
  const fieldId = id ?? generatedId;

  return (
    <FormField id={fieldId} label={label} hint={hint} error={error} className={containerClassName}>
      <textarea
        id={fieldId}
        aria-invalid={error ? true : undefined}
        aria-describedby={getDescribedBy(fieldId, hint, error)}
        className={cn(
          fieldControlClass,
          "min-h-24 resize-y py-2 placeholder:text-muted/70 focus-visible:outline-none",
          error ? fieldErrorClass : "border-line-strong",
          className,
        )}
        {...props}
      />
    </FormField>
  );
}
