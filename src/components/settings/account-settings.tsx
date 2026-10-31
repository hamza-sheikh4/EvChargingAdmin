"use client";

import { Check, Minus } from "lucide-react";
import { SettingsRow, SettingsSection } from "@/components/settings/settings-section";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { permissionGroups, type Permission } from "@/config/permissions";
import { permissionCopy, permissionGroupLabels, roleLabels } from "@/content/permissions";
import { settingsCopy } from "@/content/settings";
import { useAdminSession } from "@/hooks/use-admin-session";
import { formatDateTime } from "@/lib/format";
import { cn } from "@/lib/utils";

const copy = settingsCopy.account;

function AccountSkeleton() {
  return (
    <div className="grid gap-6" aria-busy="true">
      <div className="flex items-center gap-3">
        <Skeleton className="size-14 rounded-md" />
        <div className="grid gap-2">
          <Skeleton className="h-4 w-36" />
          <Skeleton className="h-3 w-20" />
        </div>
      </div>
      <Skeleton className="h-32 w-full rounded-md" />
      <Skeleton className="h-48 w-full rounded-md" />
    </div>
  );
}

/** Profile, details and the permissions you have been given. */
export function AccountSettings() {
  const session = useAdminSession();
  if (session.status !== "ready") return <AccountSkeleton />;

  const { admin } = session;
  const isOwner = admin.role === "superadmin";
  const allowed = (permission: Permission) => isOwner || admin.permissions.includes(permission);

  return (
    <div className="grid gap-7">
      <div className="flex items-center gap-3.5">
        <Avatar name={admin.fullName} size="lg" />
        <div className="grid gap-1">
          <p className="text-[0.9375rem] font-semibold text-heading">{admin.fullName}</p>
          <Badge variant={isOwner ? "accent" : "host"} className="justify-self-start">
            {roleLabels[admin.role]}
          </Badge>
        </div>
      </div>

      <SettingsSection title={copy.details.title}>
        <SettingsRow label={copy.name}>{admin.fullName}</SettingsRow>
        <SettingsRow label={copy.email}>{admin.email}</SettingsRow>
        <SettingsRow label={copy.role}>{roleLabels[admin.role]}</SettingsRow>
        {admin.lastLoginAt ? <SettingsRow label={copy.lastLogin}>{formatDateTime(admin.lastLoginAt)}</SettingsRow> : null}
      </SettingsSection>

      <SettingsSection title={copy.permissions.title} description={copy.permissions.description}>
        {permissionGroups.flatMap(group =>
          group.permissions.map(permission => {
            const yes = allowed(permission);
            const Icon = yes ? Check : Minus;
            return (
              <SettingsRow
                key={permission}
                label={permissionCopy[permission].label}
                description={permissionGroupLabels[group.id]}
              >
                <span className={cn("flex items-center gap-1 text-xs", yes ? "text-accent" : "text-muted")}>
                  <Icon aria-hidden="true" className="size-3.5" />
                  {yes ? copy.allowed : copy.notAllowed}
                </span>
              </SettingsRow>
            );
          }),
        )}
      </SettingsSection>
    </div>
  );
}
