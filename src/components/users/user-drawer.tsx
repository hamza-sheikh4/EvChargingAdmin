"use client";

import { DetailRow, DetailSection } from "@/components/shared/detail-list";
import { ErrorState } from "@/components/shared/error-state";
import { SuspendBar } from "@/components/users/suspend-bar";
import { AccountState, RoleBadges } from "@/components/users/user-badges";
import { Avatar } from "@/components/ui/avatar";
import { Drawer } from "@/components/ui/drawer";
import { Skeleton } from "@/components/ui/skeleton";
import { areaName } from "@/content/areas";
import { hostsCopy } from "@/content/hosts";
import { usersCopy } from "@/content/users";
import { useUser } from "@/hooks/use-users";
import { formatDate, formatDateTime } from "@/lib/format";

const copy = usersCopy.detail;

type UserDrawerProps = {
  userId: string | null;
  allowed: { suspend: boolean; unsuspend: boolean };
  onClose: () => void;
};

/** One account: who they are, their vehicles and chargers, past suspensions, and suspend or lift. */
export function UserDrawer({ userId, allowed, onClose }: UserDrawerProps) {
  const query = useUser(userId);
  const user = query.data;
  const p = copy.profile;

  return (
    <Drawer
      open={userId !== null}
      onOpenChange={open => !open && onClose()}
      title={user ? user.fullName || usersCopy.noName : copy.loading}
      description={user ? `+92 ${user.phone}` : undefined}
      footer={
        user ? (
          (user.suspendedAt ? allowed.unsuspend : allowed.suspend) ? (
            <SuspendBar key={`${user.id}-${user.suspendedAt}`} user={user} />
          ) : (
            <p className="mr-auto text-xs text-muted">{usersCopy.actions.viewOnly}</p>
          )
        ) : undefined
      }
    >
      {query.isPending ? <Skeleton className="h-80 w-full rounded-md" aria-busy="true" aria-label={copy.loading} /> : null}
      {query.isError ? <ErrorState message={query.error.message} onRetry={() => query.refetch()} /> : null}
      {user ? (
        <div className="grid gap-7">
          <div className="flex items-center gap-3">
            {user.photoUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={user.photoUrl} alt="" className="size-14 rounded-md object-cover" referrerPolicy="no-referrer" />
            ) : (
              <Avatar name={user.fullName || "?"} size="lg" />
            )}
            <div className="grid gap-1.5">
              <RoleBadges roles={user.roles} />
              <AccountState suspended={user.suspendedAt !== null} />
            </div>
          </div>

          <DetailSection title={p.title}>
            <DetailRow label={p.phone}>+92 {user.phone}</DetailRow>
            {user.email ? <DetailRow label={p.email}>{user.email}</DetailRow> : null}
            <DetailRow label={p.joined}>{formatDate(user.joinedAt)}</DetailRow>
            <DetailRow label={p.lastLogin}>{user.lastLoginAt ? formatDateTime(user.lastLoginAt) : usersCopy.never}</DetailRow>
            {user.driverSince ? <DetailRow label={p.driverSince}>{formatDate(user.driverSince)}</DetailRow> : null}
            {user.hostSince ? <DetailRow label={p.hostSince}>{formatDate(user.hostSince)}</DetailRow> : null}
            {user.hostStatus ? <DetailRow label={p.hostStatus}>{hostsCopy.status[user.hostStatus]}</DetailRow> : null}
          </DetailSection>

          {user.vehicles.length > 0 ? (
            <DetailSection title={copy.vehicles.title}>
              {user.vehicles.map(v => (
                <DetailRow key={v.id} label={[v.manufacturer, v.model].filter(Boolean).join(" ") || copy.vehicles.unnamed[v.category]}>
                  {v.connectors.map(c => hostsCopy.connectors[c]).join(", ")}
                  {v.usesAdapter ? <span className="block text-xs text-muted">{copy.vehicles.adapter}</span> : null}
                </DetailRow>
              ))}
            </DetailSection>
          ) : null}

          {user.chargers.length > 0 ? (
            <DetailSection title={copy.chargers.title}>
              {user.chargers.map(c => (
                <DetailRow key={c.id} label={`${hostsCopy.location[c.locationType]} · ${areaName(c.areaId)}`}>
                  {!c.verified ? copy.chargers.review : c.listed ? copy.chargers.listed : copy.chargers.paused}
                </DetailRow>
              ))}
            </DetailSection>
          ) : null}

          {user.history.length > 0 ? (
            <DetailSection title={copy.history.title}>
              {user.history.map(entry => (
                <DetailRow key={`${entry.at}-${entry.action}`} label={formatDateTime(entry.at)}>
                  <span className={entry.action === "suspended" ? "font-medium text-danger" : "font-medium text-accent"}>
                    {copy.history[entry.action]}
                  </span>{" "}
                  {copy.history.by} {entry.by}
                  {entry.reason ? <span className="block text-xs text-muted">{entry.reason}</span> : null}
                </DetailRow>
              ))}
            </DetailSection>
          ) : null}
        </div>
      ) : null}
    </Drawer>
  );
}
