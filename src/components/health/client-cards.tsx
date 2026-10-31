import { HealthCard, Stat, Stats } from "@/components/health/health-card";
import { healthCopy } from "@/content/health";
import { formatDateTime, formatPercent } from "@/lib/format";
import { cn } from "@/lib/utils";
import type { HealthOverview } from "@/types";

const l = healthCopy.labels;
const c = healthCopy.cards;

/** The last 24 hours of checks as a strip: green up, red down, with each check's time on hover. */
export function LandingCard({ landing }: { landing: HealthOverview["landing"] }) {
  const last = landing.last;
  return (
    <HealthCard icon={c.landing.icon} title={c.landing.title} ok={last ? last.up : undefined} meta={last?.ms ? `${last.ms} ${l.ms}` : undefined}>
      {!last ? <p className="text-xs text-muted">{l.landingOff}</p> : (
        <>
          <Stats>
            <Stat label={`${l.uptime} (24 h)`} value={formatPercent(landing.uptime24h)} tone={landing.uptime24h !== null && landing.uptime24h < 0.99 ? "warning" : undefined} />
            <Stat label={l.errors7d} value={landing.errors7d} />
          </Stats>
          <div className="grid gap-1">
            <span className="text-xs text-muted">{l.last24}</span>
            <div className="flex h-6 items-stretch gap-px" role="img" aria-label={`${l.uptime} ${formatPercent(landing.uptime24h)}`}>
              {landing.checks.map(check => (
                <span
                  key={check.at}
                  title={`${formatDateTime(check.at)}: ${check.up ? l.up : l.down}${check.ms ? `, ${check.ms} ms` : ""}${check.status ? `, HTTP ${check.status}` : ""}`}
                  className={cn("flex-1 rounded-[1px]", check.up ? "bg-accent/70" : "bg-danger")}
                />
              ))}
            </div>
          </div>
        </>
      )}
    </HealthCard>
  );
}

/** Opens, crash-free rate, versions in use, network trouble and the latest crashes; native crashes locked. */
export function MobileCard({ mobile }: { mobile: HealthOverview["mobile"] }) {
  const lowCrashFree = mobile.crashFreeRate !== null && mobile.opens7d >= 20 && mobile.crashFreeRate < 0.95;
  return (
    <HealthCard icon={c.mobile.icon} title={c.mobile.title} className="lg:col-span-2">
      <Stats wide>
        <Stat label={l.opens} value={mobile.opens7d} />
        <Stat label={l.crashFree} value={formatPercent(mobile.crashFreeRate)} tone={lowCrashFree ? "warning" : undefined} />
        <Stat label={l.crashes} value={mobile.crashes7d} tone={mobile.crashes7d ? "danger" : undefined} />
        <Stat label={l.network} value={mobile.networkProblems24h} tone={mobile.networkProblems24h > 20 ? "warning" : undefined} />
      </Stats>
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="grid content-start gap-1.5">
          <span className="text-xs font-semibold text-fg">{l.versions}</span>
          {mobile.versions.length === 0 ? <span className="text-xs text-muted">{l.noneYet}</span> : null}
          {mobile.versions.map(v => (
            <span key={`${v.version}-${v.platform}`} className="flex justify-between gap-2 text-xs">
              <span className="text-fg">{v.version} · {v.platform}</span>
              <span className="text-muted tabular-nums">{v.opens}</span>
            </span>
          ))}
        </div>
        <div className="grid content-start gap-1.5">
          <span className="text-xs font-semibold text-fg">{l.latestCrashes}</span>
          {mobile.latestCrashes.length === 0 ? <span className="text-xs text-muted">{l.noneYet}</span> : null}
          {mobile.latestCrashes.map(crash => (
            <span key={crash.id} className="flex justify-between gap-2 text-xs">
              <span className="truncate text-fg">{crash.title}</span>
              <span className="shrink-0 text-muted tabular-nums">×{crash.count}</span>
            </span>
          ))}
        </div>
      </div>
      <div aria-disabled="true" className="flex items-center gap-3 rounded-md border border-dashed border-line-strong bg-surface-muted px-3.5 py-3 opacity-80">
        <c.native.icon aria-hidden="true" className="size-4 shrink-0 text-muted" />
        <div className="grid gap-0.5">
          <span className="text-xs font-semibold text-fg">{c.native.title}</span>
          <span className="text-xs text-muted">{c.native.note}</span>
        </div>
      </div>
    </HealthCard>
  );
}

/** The admin site's own errors, and open problems across the system. */
export function TotalsCard({ totals }: { totals: HealthOverview["totals"] }) {
  return (
    <HealthCard icon={c.admin.icon} title={c.admin.title}>
      <Stats>
        <Stat label={l.adminErrors} value={totals.adminErrors7d} />
        <Stat label={l.openErrors} value={totals.openErrors} tone={totals.openErrors ? "danger" : undefined} />
        <Stat label={l.openBugs} value={totals.openBugReports} tone={totals.openBugReports ? "warning" : undefined} />
        <Stat label={l.security} value={totals.security24h} />
      </Stats>
    </HealthCard>
  );
}
