"use client";

import * as Dialog from "@radix-ui/react-dialog";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

type ModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** Read by screen readers. Show a visible heading inside the content. */
  title: string;
  className?: string;
  children: ReactNode;
};

/**
 * A frosted panel in the middle of the screen. It rises in from below and leaves
 * through the top (rise-in / rise-out in tokens.css). Radix waits for the exit
 * animation before unmounting.
 */
export function Modal({ open, onOpenChange, title, className, children }: ModalProps) {
  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-40 bg-scrim data-[state=closed]:animate-fade-out data-[state=open]:animate-fade-in" />
        <Dialog.Content
          aria-describedby={undefined}
          className={cn(
            "overlay-surface fixed top-1/2 left-1/2 z-50 flex w-[calc(100%-1.5rem)] -translate-1/2 flex-col overflow-hidden rounded-lg",
            "data-[state=closed]:animate-rise-out data-[state=open]:animate-rise-in",
            className,
          )}
        >
          <Dialog.Title className="sr-only">{title}</Dialog.Title>
          {children}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
