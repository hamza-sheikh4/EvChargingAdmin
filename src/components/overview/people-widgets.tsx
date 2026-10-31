import { CircleCheck } from "lucide-react";
import Link from "next/link";
import { BarChart } from "@/components/health/bar-chart";
import { dayBars } from "@/components/overview/ops-widgets";
import { Figure, Figures, Widget } from "@/components/overview/widget";
import { Badge } from "@/components/ui/badge";
import { overviewCopy as copy } from "@/content/overview";
import { formatAgo } from "@/lib/format";
import type { OverviewData } from "@/types";

/** What someone should act on now, from every page this admin can see. Each line links to its page. */
export function AttentionWidget({ data }: { data: OverviewData }) {
  const c = copy.attention;
  const items = [
    data.system && !data.system.database ? { key: "db", text: c.items.database(), href: "/health", danger: true } : null,
    data.hosts?.pending ? { key: "hosts", text: c.items.hosts(data.hosts.pending), href: "/hosts" } : null,
    data.bookings?.waitingForHost ? { key: "waiting", text: c.items.waiting(data.bookings.waitingForHost), href: "/bookings" } : null,
    data.system?.openErrors ? { key: "errors", text: c.items.errors(data.system.openErrors), href: "/health", danger: true } : null,
    data.system?.openBugReports ? { key: "bugs", text: c.items.bugs(data.system.openBugReports), href: "/health" } : null,
    data.listings?.quiet ? { key: "quiet", text: c.items.quiet(data.listings.quiet), href: "/listings" } : null,
  ].filter(item => item !== null);

  return (
    <Widget icon={c.icon} title={c.title}>
      {items.length === 0 ? (
        <p className="flex items-center gap-2 text-[0.8125rem] text-accent">
          <CircleCheck aria-hidden="true" className="size-4" />
          {c.allClear}
        </p>
      ) : (
        <ul className="grid gap-1">
          {items.map(item => (
            <li key={item.key}>
              <Link href={item.href} className="flex items-center gap-2.5 rounded-sm px-2 py-1.5 text-[0.8125rem] text-fg hover:bg-hover">
                <span aria-hidden="true" className={`size-1.5 shrink-0 rounded-full ${"danger" in item && item.danger ? "bg-danger" : "bg-warning"}`} />
                {item.text}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </Widget>
  );
}

export function UsersWidget({ users }: { users: NonNullable<OverviewData["users"]> }) {
  const c = copy.users;
  return (
    <Widget icon={c.icon} title={c.title} href="/users">
      <Figures>
        <Figure label={c.total} value={users.total} />
        <Figure label={c.new} value={users.new7d} tone={users.new7d ? "accent" : undefined} />
        <Figure label={c.drivers} value={users.drivers} />
        <Figure label={c.hosts} value={users.hosts} />
        <Figure label={c.suspended} value={users.suspended} tone={users.suspended ? "danger" : undefined} />
      </Figures>
      <BarChart title={c.chart} bars={dayBars(users.daily)} />
    </Widget>
  );
}

export function SystemWidget({ system }: { system: NonNullable<OverviewData["system"]> }) {
  const c = copy.system;
  return (
    <Widget icon={c.icon} title={c.title} href="/health">
      <div className="flex items-center justify-between text-[0.8125rem]">
        <span className="text-muted">{c.database}</span>
        <Badge variant={system.database ? "accent" : "danger"} showDot>{system.database ? c.up : c.down}</Badge>
      </div>
      <Figures>
        <Figure label={c.errors} value={system.openErrors} tone={system.openErrors ? "danger" : undefined} />
        <Figure label={c.bugs} value={system.openBugReports} tone={system.openBugReports ? "warning" : undefined} />
        <Figure label={c.crashes} value={system.crashes7d} tone={system.crashes7d ? "danger" : undefined} />
        <Figure label={c.security} value={system.security24h} />
      </Figures>
    </Widget>
  );
}

export function TeamWidget({ team }: { team: NonNullable<OverviewData["team"]> }) {
  const c = copy.team;
  return (
    <Widget icon={c.icon} title={c.title} href="/team">
      <Figures>
        <Figure label={c.superadmins} value={team.superadmins} />
        <Figure label={c.admins} value={team.admins} />
      </Figures>
      {team.recent.length ? (
        <div className="grid gap-1.5">
          <span className="text-xs font-semibold text-fg">{c.recent}</span>
          {team.recent.map(admin => (
            <span key={admin.id} className="flex justify-between gap-3 text-xs">
              <span className="truncate text-fg">
                {admin.fullName} <span className="text-muted">· {c.roles[admin.role]}</span>
              </span>
              <span className="shrink-0 text-muted">{formatAgo(admin.lastLoginAt)}</span>
            </span>
          ))}
        </div>
      ) : null}
    </Widget>
  );
}

export function ActivityWidget({ activity }: { activity: NonNullable<OverviewData["activity"]> }) {
  const c = copy.activity;
  return (
    <Widget icon={c.icon} title={c.title} href="/team">
      {activity.length === 0 ? <p className="text-xs text-muted">{c.empty}</p> : (
        <ol className="grid gap-2">
          {activity.map(entry => (
            <li key={entry.id} className="grid gap-0.5 text-xs">
              <span className="text-fg">
                <span className="font-medium">{entry.actor.split("@")[0]}</span> {c.actions[entry.action] ?? entry.action}
              </span>
              <span className="text-muted">{formatAgo(entry.at)}</span>
            </li>
          ))}
        </ol>
      )}
    </Widget>
  );
}
