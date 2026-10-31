"use client";

import * as Dialog from "@radix-ui/react-dialog";
import { Menu } from "lucide-react";
import { useState } from "react";
import { SidebarContent } from "@/components/layout/sidebar";
import { Logo } from "@/components/shared/logo";
import { Button } from "@/components/ui/button";
import { layoutCopy } from "@/content/layout";

/** Top bar below the lg breakpoint. The menu opens the full sidebar as a frosted panel. */
export function MobileNav() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-30 flex h-topbar items-center justify-between border-b border-line bg-canvas px-4 lg:hidden">
      <Logo />
      <Dialog.Root open={open} onOpenChange={setOpen}>
        <Dialog.Trigger asChild>
          <Button variant="ghost" size="icon" aria-label={layoutCopy.openMenu}>
            <Menu />
          </Button>
        </Dialog.Trigger>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 z-40 bg-scrim data-[state=closed]:animate-fade-out data-[state=open]:animate-fade-in" />
          <Dialog.Content
            aria-describedby={undefined}
            className="overlay-surface fixed inset-y-2 left-2 z-50 w-[min(16rem,calc(100%-1rem))] rounded-lg p-3 data-[state=closed]:animate-fade-out data-[state=open]:animate-fade-in"
          >
            <Dialog.Title className="sr-only">{layoutCopy.navLabel}</Dialog.Title>
            <SidebarContent onNavigate={() => setOpen(false)} />
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </header>
  );
}
