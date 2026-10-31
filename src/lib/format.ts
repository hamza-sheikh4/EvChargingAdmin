const locale = "en-PK";

/** Money is stored in paisa. 12550 becomes "Rs 125.50". */
export function formatRupees(paisa: number): string {
  return `Rs ${(paisa / 100).toLocaleString(locale, { minimumFractionDigits: 0, maximumFractionDigits: 2 })}`;
}

export function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString(locale, { day: "numeric", month: "short", year: "numeric" });
}

export function formatDateTime(iso: string): string {
  return new Date(iso).toLocaleString(locale, {
    day: "numeric",
    month: "short",
    hour: "numeric",
    minute: "2-digit",
  });
}


/** A readable browser and OS from the user agent, such as "Chrome on Windows". */
export function browserName(userAgent: string): string {
  // Order matters: Edge also says Chrome, and Chrome also says Safari.
  const browsers: [RegExp, string][] = [[/Edg\//, "Edge"], [/Firefox\//, "Firefox"], [/Chrome\//, "Chrome"], [/Safari\//, "Safari"]];
  const systems: [RegExp, string][] = [[/Windows/, "Windows"], [/Android/, "Android"], [/iPhone|iPad/, "iOS"], [/Mac OS/, "macOS"], [/Linux/, "Linux"]];
  const browser = browsers.find(([pattern]) => pattern.test(userAgent))?.[1] ?? "Browser";
  const os = systems.find(([pattern]) => pattern.test(userAgent))?.[1];
  return os ? `${browser} on ${os}` : browser;
}

/** 1536 becomes "1.5 KB". */
export function formatBytes(bytes: number): string {
  const units = ["B", "KB", "MB", "GB"];
  let value = bytes;
  let unit = 0;
  while (value >= 1024 && unit < units.length - 1) {
    value /= 1024;
    unit += 1;
  }
  return `${value.toFixed(value < 10 && unit > 0 ? 1 : 0)} ${units[unit]}`;
}

/** 93784 seconds becomes "1d 2h". */
export function formatUptime(seconds: number): string {
  const days = Math.floor(seconds / 86400);
  const hours = Math.floor((seconds % 86400) / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  if (days) return `${days}d ${hours}h`;
  if (hours) return `${hours}h ${minutes}m`;
  return `${minutes}m`;
}

/** 0.0234 becomes "2.3%". Null shows a dash. */
export function formatPercent(ratio: number | null): string {
  return ratio === null ? "-" : `${(Math.round(ratio * 1000) / 10).toString()}%`;
}

/** How long ago, short: "just now", "12 min ago", "3 h ago", "2 days ago". */
export function formatAgo(iso: string, now = Date.now()): string {
  const minutes = Math.max(0, Math.round((now - new Date(iso).getTime()) / 60000));
  if (minutes < 1) return "just now";
  if (minutes < 60) return `${minutes} min ago`;
  const hours = Math.round(minutes / 60);
  if (hours < 48) return `${hours} h ago`;
  return `${Math.round(hours / 24)} days ago`;
}
