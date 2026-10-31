import { BarChart } from "@/components/health/bar-chart";
import { HealthCard, Stat, Stats } from "@/components/health/health-card";
import { healthCopy } from "@/content/health";
import { formatPercent, formatUptime } from "@/lib/format";
import type { HealthOverview, RouteStat } from "@/types";

const l = healthCopy.labels;
const hourLabel = (iso: string) => new Date(iso).toLocaleTimeString("en-PK", { hour: "numeric" });

/** Uptime, traffic, speed and errors, with requests and failures per hour as two separate charts. */
export function ApiCard({ api }: { api: HealthOverview["api"] }) {
  const windows = [
    [l.window15, api.last15],
    [l.window60, api.last60],
    [l.window24, api.last24h],
  ] as const;
  const failing = api.last15.requests >= 20 && api.last15.errorRate > 0.02;

  return (
    <HealthCard icon={healthCopy.cards.api.icon} title={healthCopy.cards.api.title} ok meta={`${l.uptime} ${formatUptime(api.uptimeSeconds)}`} className="lg:col-span-2">
      <Stats wide>
        <Stat label={l.perMinute} value={api.last15.perMinute} />
        <Stat label={`${l.errorRate} (15 min)`} value={formatPercent(api.last15.errorRate)} tone={failing ? "danger" : undefined} />
        <Stat label={l.rateLimited} value={api.rateLimited} />
        <Stat label={l.memory} value={`${api.memoryMb} MB`} />
        <Stat label={l.cpu} value={`${api.cpuSeconds} ${l.seconds}`} />
      </Stats>
      <table className="w-full text-xs">
        <thead className="text-muted">
          <tr>
            <th className="py-1 text-left font-medium" />
            <th className="py-1 text-right font-medium">{l.p50}</th>
            <th className="py-1 text-right font-medium">{l.p95}</th>
            <th className="py-1 text-right font-medium">{l.errorRate}</th>
          </tr>
        </thead>
        <tbody className="tabular-nums">
          {windows.map(([name, w]) => (
            <tr key={name} className="border-t border-line">
              <th scope="row" className="py-1.5 text-left font-medium text-muted">{name}</th>
              <td className="py-1.5 text-right">{w.p50 ?? "-"} {l.ms}</td>
              <td className="py-1.5 text-right">{w.p95 ?? "-"} {l.ms}</td>
              <td className="py-1.5 text-right">{formatPercent(w.errorRate)}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="grid gap-4 sm:grid-cols-2">
        <BarChart
          title={l.requestsChart}
          bars={api.hourly.map(h => ({ key: h.hour, label: hourLabel(h.hour), value: h.requests, detail: h.p95 ? `p95 ${h.p95} ms` : undefined }))}
        />
        <BarChart title={l.errorsChart} tone="danger" bars={api.hourly.map(h => ({ key: h.hour, label: hourLabel(h.hour), value: h.errors }))} />
      </div>
    </HealthCard>
  );
}

function RouteList({ title, rows, metric }: { title: string; rows: RouteStat[]; metric: (row: RouteStat) => string }) {
  return (
    <div className="grid gap-1.5">
      <span className="text-xs font-semibold text-fg">{title}</span>
      {rows.length === 0 ? <span className="text-xs text-muted">{l.noneYet}</span> : null}
      <ol className="grid gap-1">
        {rows.map(row => (
          <li key={row.route} className="flex items-baseline justify-between gap-3 text-xs">
            <code className="truncate font-mono text-fg">{row.route}</code>
            <span className="shrink-0 text-muted tabular-nums">{metric(row)}</span>
          </li>
        ))}
      </ol>
    </div>
  );
}

/** The 5 slowest and 5 most-failing routes over 24 hours. */
export function RoutesCard({ routes }: { routes: HealthOverview["api"]["routes"] }) {
  return (
    <HealthCard icon={healthCopy.cards.routes.icon} title={healthCopy.cards.routes.title}>
      <RouteList title={l.slowest} rows={routes.slowest} metric={row => `${row.p95 ?? "-"} ${l.ms} p95`} />
      <RouteList title={l.failing} rows={routes.failing} metric={row => `${row.errors} / ${row.count}`} />
    </HealthCard>
  );
}
