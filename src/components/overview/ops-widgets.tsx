import { BarChart } from "@/components/health/bar-chart";
import { Figure, Figures, Widget } from "@/components/overview/widget";
import { areaName } from "@/content/areas";
import { overviewCopy as copy } from "@/content/overview";
import { formatAgo, formatPercent } from "@/lib/format";
import type { DayCount, OverviewData } from "@/types";

const dayLabel = (day: string) => new Date(`${day}T12:00:00`).toLocaleDateString("en-PK", { day: "numeric", month: "short" });
export const dayBars = (days: DayCount[]) => days.map(d => ({ key: d.day, label: dayLabel(d.day), value: d.count }));

export function HostsWidget({ hosts }: { hosts: NonNullable<OverviewData["hosts"]> }) {
  const c = copy.hosts;
  return (
    <Widget icon={c.icon} title={c.title} href="/hosts">
      <Figures>
        <Figure label={c.pending} value={hosts.pending} tone={hosts.pending ? "warning" : undefined} />
        <Figure label={c.approved} value={hosts.approved7d} />
        <Figure label={c.rejected} value={hosts.rejected7d} />
      </Figures>
      {hosts.oldest.length ? (
        <div className="grid gap-1.5">
          <span className="text-xs font-semibold text-fg">{c.oldest}</span>
          {hosts.oldest.map(host => (
            <span key={host.id} className="flex justify-between gap-3 text-xs">
              <span className="truncate text-fg">
                {host.fullName || "-"} <span className="text-muted">· {areaName(host.areaId)}</span>
              </span>
              <span className="shrink-0 text-muted">{c.waiting(formatAgo(host.waitingSince).replace(" ago", ""))}</span>
            </span>
          ))}
        </div>
      ) : null}
    </Widget>
  );
}

export function ListingsWidget({ listings }: { listings: NonNullable<OverviewData["listings"]> }) {
  const c = copy.listings;
  return (
    <Widget icon={c.icon} title={c.title} href="/listings">
      <Figures>
        <Figure label={c.live} value={listings.live} tone="accent" />
        <Figure label={c.paused} value={listings.paused} />
        <Figure label={c.inReview} value={listings.inReview} tone={listings.inReview ? "warning" : undefined} />
        <Figure label={c.quiet} value={listings.quiet} tone={listings.quiet ? "warning" : undefined} />
        <Figure label={c.emergency} value={listings.emergency} />
      </Figures>
    </Widget>
  );
}

/** Where chargers and demand are: listed chargers and bookings per area, busiest first. */
export function AreasWidget({ areas }: { areas: NonNullable<OverviewData["listings"]>["areas"] }) {
  const c = copy.areas;
  const max = Math.max(1, ...areas.map(a => a.chargers));
  return (
    <Widget icon={c.icon} title={c.title} href="/listings">
      {areas.length === 0 ? <p className="text-xs text-muted">{c.empty}</p> : (
        <table className="w-full text-xs">
          <thead className="text-muted">
            <tr>
              <th className="pb-1.5 text-left font-medium" />
              <th className="pb-1.5 text-right font-medium">{c.chargers}</th>
              <th className="pb-1.5 text-right font-medium">{c.bookings}</th>
            </tr>
          </thead>
          <tbody className="tabular-nums">
            {areas.map(area => (
              <tr key={area.areaId} className="border-t border-line">
                <th scope="row" className="py-1.5 text-left font-medium text-fg">
                  {areaName(area.areaId)}
                  {/* A thin bar for charger count, so busy areas stand out at a glance. */}
                  <span aria-hidden="true" className="mt-1 block h-1 rounded-full bg-accent/70" style={{ width: `${(area.chargers / max) * 100}%` }} />
                </th>
                <td className="py-1.5 text-right">{area.chargers}</td>
                <td className="py-1.5 text-right text-muted">{area.bookings7d}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </Widget>
  );
}

export function BookingsWidget({ bookings }: { bookings: NonNullable<OverviewData["bookings"]> }) {
  const c = copy.bookings;
  return (
    <Widget icon={c.icon} title={c.title} href="/bookings">
      <Figures>
        <Figure label={c.upcoming} value={bookings.today.upcoming} />
        <Figure label={c.charging} value={bookings.today.charging} tone={bookings.today.charging ? "accent" : undefined} />
        <Figure label={c.ended} value={bookings.today.ended} />
        <Figure label={c.closed} value={bookings.today.closed} />
        <Figure label={c.waiting} value={bookings.waitingForHost} tone={bookings.waitingForHost ? "warning" : undefined} />
        <Figure label={c.busy} value={bookings.busyChargers} />
      </Figures>
      <BarChart title={c.chart} bars={dayBars(bookings.daily)} />
    </Widget>
  );
}

export function ChargingNowWidget({ sessions }: { sessions: NonNullable<OverviewData["bookings"]>["chargingNow"] }) {
  const c = copy.live;
  return (
    <Widget icon={c.icon} title={c.title} href="/bookings">
      {sessions.length === 0 ? <p className="text-xs text-muted">{c.empty}</p> : (
        <ul className="grid gap-2">
          {sessions.map(s => (
            <li key={s.id} className="flex items-center justify-between gap-3 text-xs">
              <span className="flex min-w-0 items-center gap-2">
                <span aria-hidden="true" className={`size-1.5 shrink-0 rounded-full ${s.state === "interrupted" ? "bg-warning" : "bg-accent"}`} />
                <span className="truncate text-fg">
                  {s.driver || "-"} {c.at} {s.host || "-"} <span className="text-muted">· {areaName(s.areaId)}</span>
                </span>
              </span>
              <span className="shrink-0 text-muted">{s.state === "interrupted" ? c.paused : formatAgo(s.since)}</span>
            </li>
          ))}
        </ul>
      )}
    </Widget>
  );
}

export function ResponseWidget({ bookings }: { bookings: NonNullable<OverviewData["bookings"]> }) {
  const c = copy.response;
  const avg = bookings.avgResponseSeconds7d;
  const time = avg === null ? "-" : avg < 60 ? `${avg} ${copy.time.seconds}` : `${Math.round(avg / 60)} ${copy.time.minutes}`;
  const low = bookings.acceptanceRate7d !== null && bookings.acceptanceRate7d < 0.6;
  return (
    <Widget icon={c.icon} title={c.title} href="/bookings">
      <Figures>
        <Figure label={c.acceptance} value={formatPercent(bookings.acceptanceRate7d)} tone={low ? "warning" : undefined} />
        <Figure label={c.average} value={time} />
      </Figures>
      <p className="text-xs text-muted">{c.hint}</p>
    </Widget>
  );
}
