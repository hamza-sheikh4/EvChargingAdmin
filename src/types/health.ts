/** What GET /admin/health and /admin/health/events send. Everything here is about the system, not users. */

export type Check<T> = ({ ok: true; ms: number } & T) | { ok: false; ms: number; error: string };

export type Window = { requests: number; errors: number; errorRate: number; perMinute: number; p50: number | null; p95: number | null };
export type RouteStat = { route: string; count: number; errors: number; p95: number | null };
export type Job = { runs: number; failures: number; lastRunAt: string; lastMs: number; lastResult: Record<string, unknown> | null; lastError: string | null };
export type Banner = { level: "error" | "warn"; id: string; value?: string | number };

export type HealthOverview = {
  checkedAt: string;
  status: "normal" | "warning" | "degraded" | "down";
  banners: Banner[];
  api: {
    startedAt: string;
    uptimeSeconds: number;
    memoryMb: number;
    cpuSeconds: number;
    last15: Window;
    last60: Window;
    last24h: Window;
    hourly: { hour: string; requests: number; errors: number; p95: number | null }[];
    routes: { slowest: RouteStat[]; failing: RouteStat[] };
    rateLimited: number;
  };
  database: Check<{
    queryMs: number;
    sizeBytes: number;
    rows: Record<string, number>;
    migrations: { applied: number; pending: string[]; failed: string[]; latest: string | null };
    clockDriftMs: number;
    host: string;
  }>;
  storage: Check<{ bucket: string }>;
  realtime: Check<{ sockets: number; usersOnline: number }> & { eventsLastHour: number };
  environment: HealthEnvironment;
  jobs: Record<string, Job>;
  mobile: {
    opens7d: number;
    crashes7d: number;
    crashFreeRate: number | null;
    versions: { version: string; platform: string; opens: number; lastSeenAt: string }[];
    networkProblems24h: number;
    latestCrashes: { id: string; title: string; count: number; lastSeenAt: string; appVersion: string | null }[];
  };
  landing: { checks: { at: string; up: boolean; ms: number | null; status: number | null }[]; uptime24h: number | null; last: { at: string; up: boolean; ms: number | null; status: number | null } | null; errors7d: number };
  notifications: { sent: Record<string, number>; failed: number };
  totals: { openErrors: number; openBugReports: number; security24h: number; adminErrors7d: number };
  retentionDays: number;
};

export type HealthEnvironment = {
  name: string;
  versions: Record<string, string | null>;
  commit: string | null;
  timezone: string;
  platform: string;
  addresses: { apiPort: string | null; admin: string | null; landing: string | null };
  checks: { id: string; ok: boolean; value: string; warn?: boolean }[];
  secrets: { name: string; set: boolean }[];
};

export type EventKind = "error" | "crash" | "bug_report" | "event" | "security";
export type EventSource = "api" | "job" | "mobile" | "admin" | "landing";

export type SystemEventRow = {
  id: string;
  kind: EventKind;
  source: EventSource;
  level: "info" | "warn" | "error";
  title: string;
  count: number;
  firstSeenAt: string;
  lastSeenAt: string;
  status: "open" | "resolved";
  appVersion: string | null;
  platform: string | null;
};

export type SystemEventDetail = SystemEventRow & {
  message: string | null;
  stack: string | null;
  context: Record<string, unknown> | null;
  device: string | null;
  resolvedAt: string | null;
  resolvedBy: string | null;
  screenshotUrl: string | null;
  reporter: { fullName: string; phone: string } | null;
};

export type EventFilters = { source?: EventSource; status?: "open" | "resolved"; q?: string };
