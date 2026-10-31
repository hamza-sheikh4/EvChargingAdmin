"use client";

import { ChevronRight } from "lucide-react";
import { statusBadge } from "@/components/hosts/host-drawer";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { areaName } from "@/content/areas";
import { hostsCopy } from "@/content/hosts";
import { formatDateTime } from "@/lib/format";
import type { HostSummary } from "@/types";

const columns = hostsCopy.columns;
const headClass = "px-4 py-2 text-left text-xs font-medium text-muted";
const cellClass = "px-4 py-row text-[0.8125rem]";

/** One tab of the queue. A row opens the host's application on the right. */
export function HostsTable({ hosts, onOpen }: { hosts: HostSummary[]; onOpen: (id: string) => void }) {
  return (
    <Card padding="none" className="overflow-x-auto">
      <table className="w-full min-w-[42rem] border-collapse">
        <thead className="border-b border-line">
          <tr>
            <th className={headClass}>{columns.host}</th>
            <th className={headClass}>{columns.area}</th>
            <th className={headClass}>{columns.location}</th>
            <th className={headClass}>{columns.submitted}</th>
            <th className={headClass}>{columns.status}</th>
            <th className="w-10" />
          </tr>
        </thead>
        <tbody>
          {hosts.map(host => (
            <tr
              key={host.id}
              onClick={() => onOpen(host.id)}
              className="cursor-pointer border-b border-line transition-colors last:border-b-0 hover:bg-hover"
            >
              <td className={cellClass}>
                <div className="flex items-center gap-3">
                  <Avatar name={host.fullName || "?"} size="sm" />
                  <div className="grid">
                    {/* The name is the keyboard target for the row. */}
                    <button
                      type="button"
                      onClick={event => {
                        event.stopPropagation();
                        onOpen(host.id);
                      }}
                      className="text-left font-medium text-heading"
                    >
                      {host.fullName || "-"}
                    </button>
                    <span className="text-xs text-muted">+92 {host.phone}</span>
                  </div>
                </div>
              </td>
              <td className={cellClass}>{areaName(host.areaId)}</td>
              <td className={`${cellClass} text-muted`}>{host.locationType ? hostsCopy.location[host.locationType] : "-"}</td>
              <td className={`${cellClass} text-muted`}>{formatDateTime(host.submittedAt)}</td>
              <td className={cellClass}>
                <Badge variant={statusBadge[host.status]} showDot>
                  {hostsCopy.status[host.status]}
                </Badge>
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
