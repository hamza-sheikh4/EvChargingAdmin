"use client";

import { HostCharger } from "@/components/hosts/host-charger";
import { HostHistory, HostIdentity } from "@/components/hosts/host-identity";
import { ReviewBar } from "@/components/hosts/review-bar";
import { ErrorState } from "@/components/shared/error-state";
import { Badge } from "@/components/ui/badge";
import { Drawer } from "@/components/ui/drawer";
import { Skeleton } from "@/components/ui/skeleton";
import { hostsCopy } from "@/content/hosts";
import { useHost } from "@/hooks/use-hosts";

export const statusBadge = { pending: "warning", verified: "accent", rejected: "danger" } as const;

function DetailSkeleton() {
  return (
    <div className="grid gap-6" aria-busy="true" aria-label={hostsCopy.detail.loading}>
      <Skeleton className="h-44 w-full rounded-md" />
      <div className="grid gap-3 sm:grid-cols-2">
        <Skeleton className="aspect-[4/3] rounded-md" />
        <Skeleton className="aspect-[4/3] rounded-md" />
      </div>
      <Skeleton className="h-72 w-full rounded-md" />
    </div>
  );
}

type HostDrawerProps = {
  hostId: string | null;
  /** What the signed-in admin may do here. */
  review: { approve: boolean; reject: boolean };
  onClose: () => void;
};

/** One host's application: identity and CNIC, the charger, earlier decisions, and the review bar. */
export function HostDrawer({ hostId, review, onClose }: HostDrawerProps) {
  const query = useHost(hostId);
  const host = query.data;

  return (
    <Drawer
      open={hostId !== null}
      onOpenChange={open => !open && onClose()}
      size="wide"
      title={host?.fullName || hostsCopy.detail.loading}
      description={host ? hostsCopy.status[host.status] : undefined}
      footer={
        host ? (
          review.approve || review.reject ? (
            <ReviewBar key={host.id + host.status} host={host} allowed={review} onDone={onClose} />
          ) : (
            <p className="mr-auto text-xs text-muted">{hostsCopy.review.viewOnly}</p>
          )
        ) : undefined
      }
    >
      {query.isPending ? <DetailSkeleton /> : null}
      {query.isError ? <ErrorState message={query.error.message} onRetry={() => query.refetch()} /> : null}
      {host ? (
        <div className="grid gap-7">
          <Badge variant={statusBadge[host.status]} showDot className="justify-self-start">
            {hostsCopy.status[host.status]}
          </Badge>
          <HostIdentity host={host} />
          {host.chargers.map((charger, index) => (
            <HostCharger key={charger.id} charger={charger} index={index} />
          ))}
          <HostHistory history={host.history} />
        </div>
      ) : null}
    </Drawer>
  );
}
