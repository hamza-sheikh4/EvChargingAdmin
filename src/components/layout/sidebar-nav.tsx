"use client";

import { Lock } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { sidebarNav } from "@/config/navigation";
import { canDo, useAdminSession } from "@/hooks/use-admin-session";
import { layoutCopy } from "@/content/layout";
import { cn } from "@/lib/utils";
import type { NavItem } from "@/types";

type NavProps = { onNavigate?: () => void };
type LinksProps = NavProps & { pathname?: string; allowed?: (item: NavItem) => boolean };

const linkClass = cn(
  "flex h-8 items-center gap-2.5 rounded-sm px-2 text-[0.8125rem] font-medium text-muted transition-colors",
  "hover:bg-hover hover:text-fg",
  "aria-[current=page]:bg-hover aria-[current=page]:text-heading",
  // The current section's icon takes the accent; everything else stays grey.
  "aria-[current=page]:[&_svg]:text-accent",
);

const lockedClass = "flex h-8 cursor-not-allowed items-center gap-2.5 rounded-sm px-2 text-[0.8125rem] font-medium text-muted/60 select-none";

function isActive(pathname: string | undefined, href: string) {
  if (!pathname) return false;
  return href === "/" ? pathname === "/" : pathname.startsWith(href);
}

/** The links without an active state. The Suspense fallback while the pathname is unknown. */
export function SidebarLinks({ pathname, onNavigate, allowed = () => true }: LinksProps) {
  const groups = sidebarNav
    .map(group => ({ ...group, items: group.items.filter(allowed) }))
    .filter(group => group.items.length > 0);
  return (
    <nav aria-label={layoutCopy.navLabel} className="grid gap-4">
      {groups.map(group => (
        <div key={group.label} className="grid gap-0.5">
          <p className="px-2 pb-1 text-[0.6875rem] font-medium text-muted">{group.label}</p>
          {group.items.map(({ label, href, icon: Icon, locked }) =>
            locked ? (
              // Not a link and not focusable: there is no page yet, so it is not offered as a control.
              <div key={href} aria-disabled="true" title={layoutCopy.lockedHint(label)} className={lockedClass}>
                <Icon aria-hidden="true" className="size-4 shrink-0" />
                {label}
                <span className="ml-auto inline-flex items-center gap-1 rounded-xs border border-line px-1.5 text-[0.625rem] font-medium">
                  <Lock aria-hidden="true" className="size-2.5" />
                  {layoutCopy.locked}
                </span>
              </div>
            ) : (
              <Link
                key={href}
                href={href}
                onClick={onNavigate}
                aria-current={isActive(pathname, href) ? "page" : undefined}
                className={linkClass}
              >
                <Icon aria-hidden="true" className="size-4 shrink-0" />
                {label}
              </Link>
            ),
          )}
        </div>
      ))}
    </nav>
  );
}

/**
 * Highlights the current section. With Cache Components, usePathname suspends on routes with
 * unknown dynamic params (such as /hosts/[id]), so callers wrap this in Suspense.
 */
export function SidebarNav({ onNavigate }: NavProps) {
  const pathname = usePathname();
  const session = useAdminSession();
  // Until the admin is known every link shows; then only the ones they have permission for.
  const allowed = (item: NavItem) => session.status !== "ready" || canDo(session.admin, item.permission);
  return <SidebarLinks pathname={pathname} onNavigate={onNavigate} allowed={allowed} />;
}
