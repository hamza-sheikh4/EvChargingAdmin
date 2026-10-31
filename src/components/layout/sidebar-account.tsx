"use client";

import { ChevronsUpDown, RotateCw, Settings } from "lucide-react";
import { useSettings } from "@/components/settings/settings-provider";
import { Avatar } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { layoutCopy } from "@/content/layout";
import { roleLabels } from "@/content/permissions";
import { useAdminSession } from "@/hooks/use-admin-session";

const copy = layoutCopy.account;
const rowClass = "flex w-full items-center gap-2.5 rounded-sm px-2 py-1.5 text-left text-[0.8125rem] transition-colors hover:bg-hover";

function AccountCard() {
  const session = useAdminSession();
  const { openSettings } = useSettings();

  if (session.status === "loading") {
    return (
      <div className="flex items-center gap-2.5 px-2 py-1.5">
        <Skeleton className="size-8 rounded-sm" />
        <div className="grid flex-1 gap-1.5">
          <Skeleton className="h-3 w-24" />
          <Skeleton className="h-3 w-14" />
        </div>
      </div>
    );
  }
  if (session.status === "error") {
    return (
      <button type="button" onClick={session.retry} className={rowClass}>
        <RotateCw aria-hidden="true" className="size-4 text-danger" />
        <span className="grid">
          <span className="font-medium text-fg">{copy.loadFailed}</span>
          <span className="text-xs text-muted">{layoutCopy.retry}</span>
        </span>
      </button>
    );
  }
  // AuthGuard is already moving a signed-out visitor to /login.
  if (session.status === "signed-out") return null;

  const { admin } = session;
  return (
    <button type="button" onClick={() => openSettings("account")} aria-label={copy.openAccount} className={rowClass}>
      <Avatar name={admin.fullName} size="sm" />
      <span className="grid min-w-0 flex-1 gap-0.5">
        <span className="truncate font-medium text-heading">{admin.fullName}</span>
        <span className="text-xs text-muted">{roleLabels[admin.role]}</span>
      </span>
      <ChevronsUpDown aria-hidden="true" className="size-4 text-muted" />
    </button>
  );
}

/** Bottom of the sidebar: Settings, then the signed-in admin and their role. */
export function SidebarAccount() {
  const { openSettings } = useSettings();
  return (
    <div className="grid gap-0.5 border-t border-line pt-2">
      <button type="button" onClick={() => openSettings("appearance")} className={rowClass}>
        <Settings aria-hidden="true" className="size-4 text-muted" />
        <span className="font-medium text-muted">{copy.settings}</span>
        <kbd className="ml-auto rounded-xs border border-line px-1 text-[0.625rem] text-muted">{copy.shortcut}</kbd>
      </button>
      <AccountCard />
    </div>
  );
}
