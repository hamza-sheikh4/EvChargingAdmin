import { DetailRow, DetailSection } from "@/components/shared/detail-list";
import { PhotoTile } from "@/components/hosts/photo-tile";
import { hostsCopy } from "@/content/hosts";
import { formatDate, formatDateTime } from "@/lib/format";
import type { HostDetail } from "@/types";

const copy = hostsCopy.detail;

/** Who the host is: contact details, the CNIC number and both CNIC photos, side by side to compare. */
export function HostIdentity({ host }: { host: HostDetail }) {
  return (
    <>
      <DetailSection title={copy.identity.title}>
        <DetailRow label={copy.identity.phone}>+92 {host.phone}</DetailRow>
        {host.email ? <DetailRow label={copy.identity.email}>{host.email}</DetailRow> : null}
        <DetailRow label={copy.identity.cnic}>
          {host.cnic ? (
            <span className="font-mono tracking-wide select-all">{host.cnic}</span>
          ) : (
            <span className="text-muted">{host.documents ? "-" : copy.documents.noAccess}</span>
          )}
        </DetailRow>
        <DetailRow label={copy.identity.address}>{host.address || "-"}</DetailRow>
        <DetailRow label={copy.identity.member}>{formatDate(host.memberSince)}</DetailRow>
        {host.submittedAt ? <DetailRow label={copy.identity.submitted}>{formatDateTime(host.submittedAt)}</DetailRow> : null}
      </DetailSection>

      <section className="grid gap-2">
        <h3 className="text-[0.8125rem] font-semibold text-heading">{copy.documents.title}</h3>
        {host.documents ? (
          <div className="grid gap-3 sm:grid-cols-2">
            <PhotoTile src={host.documents.front} label={copy.documents.front} />
            <PhotoTile src={host.documents.back} label={copy.documents.back} />
          </div>
        ) : (
          <p className="rounded-md border border-dashed border-line-strong px-4 py-3 text-xs text-muted">{copy.documents.noAccess}</p>
        )}
      </section>
    </>
  );
}

/** Earlier approvals and rejections, newest first, with the reason given. */
export function HostHistory({ history }: { history: HostDetail["history"] }) {
  if (history.length === 0) return null;
  return (
    <section className="grid gap-2">
      <h3 className="text-[0.8125rem] font-semibold text-heading">{copy.history.title}</h3>
      <ol className="divide-y divide-line rounded-md border border-line bg-surface">
        {history.map(entry => (
          <li key={`${entry.at}-${entry.action}`} className="grid gap-0.5 px-4 py-2.5 text-[0.8125rem]">
            <span className="text-fg">
              <span className={entry.action === "approved" ? "font-medium text-accent" : "font-medium text-danger"}>
                {copy.history[entry.action]}
              </span>{" "}
              {copy.history.by} {entry.by}
            </span>
            <span className="text-xs text-muted">{formatDateTime(entry.at)}</span>
            {entry.reason ? <span className="text-xs text-fg">{entry.reason}</span> : null}
          </li>
        ))}
      </ol>
    </section>
  );
}
