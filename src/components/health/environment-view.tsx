import { Check, X } from "lucide-react";
import { DetailRow, DetailSection } from "@/components/shared/detail-list";
import { environment as adminEnvironment } from "@/config/environment";
import { healthCopy } from "@/content/health";
import { formatDateTime } from "@/lib/format";
import type { HealthOverview } from "@/types";

const e = healthCopy.environment;

const Mark = ({ ok, warn }: { ok: boolean; warn?: boolean }) =>
  ok && !warn ? <Check aria-hidden="true" className="inline size-3.5 text-accent" /> : <X aria-hidden="true" className="inline size-3.5 text-danger" />;

/** Each part of PakVolt's setup: versions, addresses, config checks and which secrets are set. Never a secret's value. */
export function EnvironmentView({ overview }: { overview: HealthOverview }) {
  const api = overview.environment;
  const latestApp = overview.mobile.versions[0];

  return (
    <div className="grid gap-7 lg:grid-cols-2">
      <DetailSection title={e.api}>
        <DetailRow label={e.name}>{api.name}</DetailRow>
        <DetailRow label={e.versions}>
          {Object.entries(api.versions).map(([name, version]) => (
            <span key={name} className="mr-3 inline-block">
              {name} <code className="font-mono text-xs">{version ?? "-"}</code>
            </span>
          ))}
        </DetailRow>
        <DetailRow label={e.commit}>{api.commit ? <code className="font-mono text-xs">{api.commit}</code> : <span className="text-muted">{e.notSet}</span>}</DetailRow>
        <DetailRow label={e.timezone}>{api.timezone}</DetailRow>
        <DetailRow label={e.platform}>{api.platform}</DetailRow>
        {api.checks.map(check => (
          <DetailRow key={check.id} label={e.checkNames[check.id] ?? check.id}>
            <span className="inline-flex items-center gap-1.5">
              <Mark ok={check.ok} warn={check.warn && api.name === "production"} />
              {check.value}
            </span>
          </DetailRow>
        ))}
        <DetailRow label={e.secrets}>
          <span className="flex flex-wrap gap-x-3 gap-y-1">
            {api.secrets.map(secret => (
              <span key={secret.name} className="inline-flex items-center gap-1 text-xs">
                <Mark ok={secret.set} />
                <code className="font-mono">{secret.name}</code>
                <span className="text-muted">{secret.set ? e.set : e.missing}</span>
              </span>
            ))}
          </span>
        </DetailRow>
      </DetailSection>

      <div className="grid content-start gap-7">
        <DetailSection title={e.admin}>
          <DetailRow label={e.name}>{adminEnvironment.appEnv}</DetailRow>
          <DetailRow label={e.apiAddress}>
            <code className="font-mono text-xs break-all">{adminEnvironment.apiUrl}</code>
          </DetailRow>
          <DetailRow label={e.addresses}>{api.addresses.admin ?? e.notSet}</DetailRow>
        </DetailSection>

        <DetailSection title={e.mobile}>
          <DetailRow label={e.versions}>
            {latestApp ? `${latestApp.version} (${latestApp.platform})` : healthCopy.labels.noneYet}
          </DetailRow>
          <DetailRow label={e.builtFor}>{latestApp ? overview.mobile.versions.map(v => v.platform).filter((p, i, all) => all.indexOf(p) === i).join(", ") : "-"}</DetailRow>
        </DetailSection>

        <DetailSection title={e.landing}>
          <DetailRow label={e.addresses}>{api.addresses.landing ?? e.notSet}</DetailRow>
          <DetailRow label={e.lastCheck}>
            {overview.landing.last ? `${formatDateTime(overview.landing.last.at)} · ${overview.landing.last.up ? healthCopy.labels.up : healthCopy.labels.down}` : healthCopy.labels.landingOff}
          </DetailRow>
        </DetailSection>
      </div>
    </div>
  );
}
