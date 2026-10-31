"use client";

import * as Dialog from "@radix-ui/react-dialog";
import { X } from "lucide-react";
import type { ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { layoutCopy } from "@/content/layout";
import { cn } from "@/lib/utils";

type DrawerProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description?: string;
  /** Sticky buttons at the bottom, such as Cancel and Save. */
  footer?: ReactNode;
  /** wide fits documents and photos side by side. */
  size?: "md" | "wide";
  children: ReactNode;
};

/** A frosted panel that slides in from the right. Focus stays inside while it is open. */
export function Drawer({ open, onOpenChange, title, description, footer, size = "md", children }: DrawerProps) {
  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-40 bg-scrim data-[state=closed]:animate-fade-out data-[state=open]:animate-fade-in" />
        <Dialog.Content
          // Radix links the Description itself; without one, opt out of its warning.
          {...(description ? {} : { "aria-describedby": undefined })}
          className={cn(
            "overlay-surface fixed inset-y-2 right-2 z-50 flex w-[calc(100%-1rem)] flex-col rounded-lg",
            "data-[state=closed]:animate-drawer-out data-[state=open]:animate-drawer-in",
            size === "wide" ? "max-w-drawer-wide" : "max-w-drawer",
          )}
        >
          <header className="flex items-start justify-between gap-4 border-b border-line px-5 py-4">
            <div className="grid gap-0.5">
              <Dialog.Title className="text-[0.9375rem] font-semibold text-heading">{title}</Dialog.Title>
              {description ? <Dialog.Description className="text-xs text-muted">{description}</Dialog.Description> : null}
            </div>
            <Dialog.Close asChild>
              <Button variant="ghost" size="icon-sm" aria-label={layoutCopy.close}>
                <X />
              </Button>
            </Dialog.Close>
          </header>
          <div className="flex-1 overflow-y-auto px-5 py-5">{children}</div>
          {footer ? <footer className="flex justify-end gap-2 border-t border-line px-5 py-3">{footer}</footer> : null}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
