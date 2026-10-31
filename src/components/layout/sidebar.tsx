import { Suspense } from "react";
import { SidebarAccount } from "@/components/layout/sidebar-account";
import { SidebarLinks, SidebarNav } from "@/components/layout/sidebar-nav";
import { Logo } from "@/components/shared/logo";

/** Logo, sections, then settings and the signed-in admin. Shared by the desktop sidebar and the mobile menu. */
export function SidebarContent({ onNavigate }: { onNavigate?: () => void }) {
  return (
    <div className="flex h-full flex-col gap-5">
      <Logo className="px-2 pt-1" />
      <div className="-mx-1 flex-1 overflow-y-auto px-1">
        <Suspense fallback={<SidebarLinks />}>
          <SidebarNav onNavigate={onNavigate} />
        </Suspense>
      </div>
      <SidebarAccount />
    </div>
  );
}

/** A flat column on the left on large screens, divided by a thin line. Small screens use MobileNav. */
export function Sidebar() {
  return (
    <aside className="fixed inset-y-0 left-0 z-30 hidden w-sidebar border-r border-line bg-sidebar px-3 py-3 lg:block">
      <SidebarContent />
    </aside>
  );
}
