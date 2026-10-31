"use client";

import { ChevronRight } from "lucide-react";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { allPermissions } from "@/config/permissions";
import { roleLabels } from "@/content/permissions";
import { teamCopy } from "@/content/team";
import { formatDateTime } from "@/lib/format";
import type { TeamMember } from "@/types";

const columns = teamCopy.columns;
const headClass = "px-4 py-2 text-left text-xs font-medium text-muted";
const cellClass = "px-4 py-row text-[0.8125rem]";

type TeamTableProps = {
  members: TeamMember[];
  /** The signed-in admin, tagged "You". */
  meId: string;
  onOpen: (member: TeamMember) => void;
};

/** Every admin. A row opens that member's permissions on the right. */
export function TeamTable({ members, meId, onOpen }: TeamTableProps) {
  return (
    <Card padding="none" className="overflow-x-auto">
      <table className="w-full min-w-[46rem] border-collapse">
        <thead className="border-b border-line">
          <tr>
            <th className={headClass}>{columns.member}</th>
            <th className={headClass}>{columns.role}</th>
            <th className={headClass}>{columns.access}</th>
            <th className={headClass}>{columns.security}</th>
            <th className={headClass}>{columns.status}</th>
            <th className={headClass}>{columns.lastActive}</th>
            <th className="w-10" />
          </tr>
        </thead>
        <tbody>
          {members.map(member => (
            <tr
              key={member.id}
              onClick={() => onOpen(member)}
              className="cursor-pointer border-b border-line transition-colors last:border-b-0 hover:bg-hover"
            >
              <td className={cellClass}>
                <div className="flex items-center gap-3">
                  <Avatar name={member.fullName} size="sm" />
                  <div className="grid">
                    {/* The name is the keyboard target for the row. */}
                    <button
                      type="button"
                      onClick={event => {
                        event.stopPropagation();
                        onOpen(member);
                      }}
                      className="text-left font-medium text-heading"
                    >
                      {member.fullName}
                      {member.id === meId ? <span className="ml-1.5 text-xs font-normal text-muted">({teamCopy.you})</span> : null}
                    </button>
                    <span className="text-xs text-muted">{member.email}</span>
                  </div>
                </div>
              </td>
              <td className={cellClass}>
                <Badge variant={member.role === "superadmin" ? "accent" : "host"}>{roleLabels[member.role]}</Badge>
              </td>
              <td className={`${cellClass} text-muted`}>
                {teamCopy.access(member.permissions.length, allPermissions.length)}
              </td>
              <td className={`${cellClass} text-muted`}>
                {member.twoFactorEnabled ? teamCopy.twoFactor.on : teamCopy.twoFactor.off}
              </td>
              <td className={cellClass}>
                <Badge variant={member.status === "active" ? "accent" : "danger"} showDot>
                  {teamCopy.status[member.status]}
                </Badge>
              </td>
              <td className={`${cellClass} text-muted`}>
                {member.lastLoginAt ? formatDateTime(member.lastLoginAt) : teamCopy.never}
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
