import { CheckError, HealthCard, Stat, Stats } from "@/components/health/health-card";
import { healthCopy } from "@/content/health";
import { formatBytes, formatDateTime } from "@/lib/format";
import type { HealthOverview } from "@/types";

const l = healthCopy.labels;
const c = healthCopy.cards;

/** Connection, speed, size, migrations, clock drift and rows per table. */
export function DatabaseCard({ database }: { database: HealthOverview["database"] }) {
  return (
    <HealthCard icon={c.database.icon} title={c.database.title} ok={database.ok} meta={`${database.ms} ${l.ms}`}>
      {!database.ok ? <CheckError error={database.error} /> : (
        <>
          <Stats>
            <Stat label={l.queryTime} value={`${database.queryMs} ${l.ms}`} tone={database.queryMs > 500 ? "warning" : undefined} />
            <Stat label={l.size} value={formatBytes(database.sizeBytes)} />
            <Stat label={l.clock} value={`${database.clockDriftMs} ${l.ms}`} tone={Math.abs(database.clockDriftMs) > 5000 ? "warning" : undefined} />
            <Stat label={l.migrations} value={database.migrations.applied} />
            <Stat label={l.pending} value={database.migrations.pending.length} tone={database.migrations.pending.length ? "warning" : undefined} />
          </Stats>
          <p className="truncate text-xs text-muted">
            {l.latest}: <code className="font-mono text-fg">{database.migrations.latest ?? "-"}</code> · {l.host}: {database.host}
          </p>
          <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-xs sm:grid-cols-3">
            {Object.entries(database.rows).map(([table, count]) => (
              <span key={table} className="flex justify-between gap-2">
                <code className="font-mono text-muted">{table}</code>
                <span className="tabular-nums text-fg">{count}</span>
              </span>
            ))}
          </div>
        </>
      )}
    </HealthCard>
  );
}

export function StorageCard({ storage }: { storage: HealthOverview["storage"] }) {
  return (
    <HealthCard icon={c.storage.icon} title={c.storage.title} ok={storage.ok} meta={`${storage.ms} ${l.ms}`}>
      {storage.ok ? (
        <Stats>
          <Stat label={l.bucket} value={storage.bucket} />
          <Stat label={l.roundTrip} value={`${storage.ms} ${l.ms}`} />
        </Stats>
      ) : (
        <CheckError error={storage.error} />
      )}
    </HealthCard>
  );
}

export function RealtimeCard({ realtime }: { realtime: HealthOverview["realtime"] }) {
  return (
    <HealthCard icon={c.realtime.icon} title={c.realtime.title} ok={realtime.ok}>
      {realtime.ok ? (
        <Stats>
          <Stat label={l.sockets} value={realtime.sockets} />
          <Stat label={l.online} value={realtime.usersOnline} />
          <Stat label={l.events} value={realtime.eventsLastHour} />
        </Stats>
      ) : (
        <CheckError error={realtime.error} />
      )}
    </HealthCard>
  );
}

/** Each job's last run, how long it took, what it did, and failures since the server started. */
export function JobsCard({ jobs }: { jobs: HealthOverview["jobs"] }) {
  const entries = Object.entries(jobs);
  return (
    <HealthCard icon={c.jobs.icon} title={c.jobs.title} ok={entries.every(([, job]) => !job.lastError || job.lastResult !== null)}>
      {entries.length === 0 ? <p className="text-xs text-muted">{l.noneYet}</p> : null}
      <ul className="grid gap-2.5">
        {entries.map(([name, job]) => (
          <li key={name} className="grid gap-0.5 text-xs">
            <span className="flex justify-between gap-2">
              <span className="font-medium text-fg">{healthCopy.jobs[name] ?? name}</span>
              <span className={job.failures ? "text-danger tabular-nums" : "text-muted tabular-nums"}>
                {job.runs} {l.runs.toLowerCase()} · {job.failures} {l.failures.toLowerCase()}
              </span>
            </span>
            <span className="text-muted">
              {l.lastRun} {formatDateTime(job.lastRunAt)} · {job.lastMs} {l.ms}
              {job.lastResult ? ` · ${Object.entries(job.lastResult).map(([k, v]) => `${k} ${v}`).join(", ")}` : ""}
            </span>
            {job.lastError && job.lastResult === null ? <span className="text-danger">{job.lastError}</span> : null}
          </li>
        ))}
      </ul>
    </HealthCard>
  );
}

export function NotificationsCard({ notifications }: { notifications: HealthOverview["notifications"] }) {
  const sent = Object.entries(notifications.sent);
  return (
    <HealthCard icon={c.notifications.icon} title={c.notifications.title} ok={notifications.failed === 0}>
      <Stats>
        <Stat label={l.sent} value={sent.reduce((total, [, n]) => total + n, 0)} />
        <Stat label={l.failed} value={notifications.failed} tone={notifications.failed ? "danger" : undefined} />
      </Stats>
      {sent.length ? (
        <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs">
          {sent.map(([kind, n]) => (
            <span key={kind} className="text-muted">
              <code className="font-mono">{kind}</code> <span className="tabular-nums text-fg">{n}</span>
            </span>
          ))}
        </div>
      ) : null}
    </HealthCard>
  );
}
