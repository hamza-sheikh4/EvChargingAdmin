"use client";

import * as Dialog from "@radix-ui/react-dialog";
import { createContext, useCallback, useContext, useRef, useState, type ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { layoutCopy } from "@/content/layout";
import { cn } from "@/lib/utils";

export type ConfirmOptions = {
  title: string;
  description: string;
  confirmLabel: string;
  /** danger for things that cannot be undone, such as removing or rejecting. */
  tone?: "primary" | "danger";
};

type Confirm = (options: ConfirmOptions) => Promise<boolean>;

const ConfirmContext = createContext<Confirm | null>(null);

/**
 * The panel's own confirm dialog. Never window.confirm or alert: those look foreign, cannot be
 * styled, and block the page. `await confirm({...})` resolves true on confirm, false on cancel or Esc.
 */
export function ConfirmProvider({ children }: { children: ReactNode }) {
  const [options, setOptions] = useState<ConfirmOptions | null>(null);
  const [open, setOpen] = useState(false);
  const resolver = useRef<(answer: boolean) => void>(undefined);

  const confirm = useCallback<Confirm>(next => {
    resolver.current?.(false);
    setOptions(next);
    setOpen(true);
    return new Promise<boolean>(resolve => {
      resolver.current = resolve;
    });
  }, []);

  const answer = (value: boolean) => {
    resolver.current?.(value);
    resolver.current = undefined;
    setOpen(false);
  };

  return (
    <ConfirmContext.Provider value={confirm}>
      {children}
      <Dialog.Root open={open} onOpenChange={next => !next && answer(false)}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 z-[60] bg-scrim data-[state=closed]:animate-fade-out data-[state=open]:animate-fade-in" />
          <Dialog.Content
            role="alertdialog"
            className={cn(
              "overlay-surface fixed top-1/2 left-1/2 z-[70] grid w-[calc(100%-2rem)] max-w-sm -translate-1/2 gap-5 rounded-lg p-5",
              "data-[state=closed]:animate-rise-out data-[state=open]:animate-rise-in",
            )}
          >
            <div className="grid gap-1.5">
              <Dialog.Title className="text-[0.9375rem] font-semibold text-heading">{options?.title}</Dialog.Title>
              <Dialog.Description className="text-[0.8125rem] text-muted">{options?.description}</Dialog.Description>
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="ghost" onClick={() => answer(false)}>
                {layoutCopy.cancel}
              </Button>
              <Button
                variant={options?.tone === "danger" ? "danger" : "primary"}
                onClick={() => answer(true)}
                // Danger waits for a deliberate click; a safe confirm can take Enter straight away.
                autoFocus={options?.tone !== "danger"}
              >
                {options?.confirmLabel}
              </Button>
            </div>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </ConfirmContext.Provider>
  );
}

export function useConfirm(): Confirm {
  const confirm = useContext(ConfirmContext);
  if (!confirm) throw new Error("useConfirm must be used inside ConfirmProvider");
  return confirm;
}
