"use client";

import { ChevronRight } from "lucide-react";
import { AccountState, RoleBadges } from "@/components/users/user-badges";
import { Avatar } from "@/components/ui/avatar";
import { Card } from "@/components/ui/card";
import { usersCopy as copy } from "@/content/users";
import { formatDate, formatDateTime } from "@/lib/format";
import type { UserSummary } from "@/types";

const headClass = "px-4 py-2 text-left text-xs font-medium text-muted";
const cellClass = "px-4 py-row text-[0.8125rem]";

/** Accounts, newest first. A row opens the account on the right. */
export function UsersTable({ users, onOpen }: { users: UserSummary[]; onOpen: (id: string) => void }) {
  return (
    <Card padding="none" className="overflow-x-auto">
      <table className="w-full min-w-[48rem] border-collapse">
        <thead className="border-b border-line">
          <tr>
            <th className={headClass}>{copy.columns.user}</th>
            <th className={headClass}>{copy.columns.roles}</th>
            <th className={headClass}>{copy.columns.vehicles}</th>
            <th className={headClass}>{copy.columns.joined}</th>
            <th className={headClass}>{copy.columns.lastLogin}</th>
            <th className={headClass}>{copy.columns.status}</th>
            <th className="w-10" />
          </tr>
        </thead>
        <tbody>
          {users.map(user => (
            <tr
              key={user.id}
              onClick={() => onOpen(user.id)}
              className="cursor-pointer border-b border-line transition-colors last:border-b-0 hover:bg-hover"
            >
              <td className={cellClass}>
                <div className="flex items-center gap-3">
                  <Avatar name={user.fullName || "?"} size="sm" />
                  <div className="grid">
                    {/* The name is the keyboard target for the row. */}
                    <button
                      type="button"
                      onClick={event => {
                        event.stopPropagation();
                        onOpen(user.id);
                      }}
                      className="text-left font-medium text-heading"
                    >
                      {user.fullName || <span className="font-normal text-muted">{copy.noName}</span>}
                    </button>
                    <span className="text-xs text-muted">+92 {user.phone}</span>
                  </div>
                </div>
              </td>
              <td className={cellClass}>
                <RoleBadges roles={user.roles} />
              </td>
              <td className={`${cellClass} text-muted tabular-nums`}>{user.vehicleCount}</td>
              <td className={`${cellClass} text-muted`}>{formatDate(user.joinedAt)}</td>
              <td className={`${cellClass} text-muted`}>{user.lastLoginAt ? formatDateTime(user.lastLoginAt) : copy.never}</td>
              <td className={cellClass}>
                <AccountState suspended={user.suspendedAt !== null} />
              </td>
              <td className="pr-3 text-muted">
                <ChevronRight aria-hidden="true" className="size-4" />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </Card>
  );
}
