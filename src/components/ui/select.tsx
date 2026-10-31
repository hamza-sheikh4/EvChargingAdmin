"use client";

import * as Menu from "@radix-ui/react-dropdown-menu";
import { Check, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

type SelectProps = {
  options: { value: string; label: string }[];
  value: string;
  onChange: (value: string) => void;
  /** The id of the text that names this control, or label when there is no visible one. */
  "aria-labelledby"?: string;
  label?: string;
  className?: string;
};

/**
 * A themed dropdown. Not the browser's own select: its open list takes the system's colours
 * (a bright blue hover on Windows, a light list in dark mode) and cannot be styled.
 * Keyboard: Enter or Space opens it, arrows move, Enter picks, Esc closes.
 */
export function Select({ options, value, onChange, className, label, ...aria }: SelectProps) {
  const current = options.find(option => option.value === value) ?? options[0];

  return (
    <Menu.Root modal={false}>
      <Menu.Trigger
        {...aria}
        aria-label={label}
        className={cn(
          "inline-flex h-8 min-w-36 items-center justify-between gap-2 rounded-sm border border-line-strong bg-surface pr-2 pl-2.5 text-[0.8125rem] text-fg",
          "transition-colors hover:border-muted focus-visible:border-accent data-[state=open]:border-accent",
          className,
        )}
      >
        {current?.label}
        <ChevronDown aria-hidden="true" className="size-3.5 text-muted" />
      </Menu.Trigger>
      <Menu.Portal>
        <Menu.Content
          align="end"
          sideOffset={4}
          // Above the settings modal, which sits at z-50.
          className="overlay-surface z-[80] min-w-[var(--radix-dropdown-menu-trigger-width)] rounded-md p-1 data-[state=closed]:animate-fade-out data-[state=open]:animate-fade-in"
        >
          <Menu.RadioGroup value={value} onValueChange={onChange}>
            {options.map(option => (
              <Menu.RadioItem
                key={option.value}
                value={option.value}
                className={cn(
                  "flex h-8 cursor-pointer items-center justify-between gap-3 rounded-sm px-2.5 text-[0.8125rem] text-fg outline-none select-none",
                  "data-[highlighted]:bg-hover data-[state=checked]:font-medium data-[state=checked]:text-heading",
                )}
              >
                {option.label}
                <Menu.ItemIndicator>
                  <Check aria-hidden="true" className="size-3.5 text-accent" />
                </Menu.ItemIndicator>
              </Menu.RadioItem>
            ))}
          </Menu.RadioGroup>
        </Menu.Content>
      </Menu.Portal>
    </Menu.Root>
  );
}
