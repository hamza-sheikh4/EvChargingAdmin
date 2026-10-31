"use client";

import { Check, X } from "lucide-react";
import { useState } from "react";
import { useConfirm } from "@/components/providers/confirm-provider";
import { ReasonForm } from "@/components/shared/reason-form";
import { Button } from "@/components/ui/button";
import { hostsCopy } from "@/content/hosts";
import { useHostReview } from "@/hooks/use-hosts";
import type { HostDetail } from "@/types";

const copy = hostsCopy.review;

/**
 * The decision at the bottom of the drawer. Pending: approve or reject. Verified: revoke.
 * Rejected: approve after all. Rejecting always asks for a reason for the host.
 */
type ReviewBarProps = { host: HostDetail; allowed: { approve: boolean; reject: boolean }; onDone: () => void };

export function ReviewBar({ host, allowed, onDone }: ReviewBarProps) {
  const review = useHostReview(host.id, host.fullName, onDone);
  const confirm = useConfirm();
  const [rejecting, setRejecting] = useState(false);
  const verified = host.status === "verified";
  const rejectLabel = verified ? copy.revoke : copy.reject;

  if (rejecting) {
    return (
      <ReasonForm
        label={copy.reason}
        hint={copy.reasonHint}
        presetsLabel={copy.presetsLabel}
        presets={copy.presets}
        confirmLabel={verified ? copy.confirmRevoke : copy.confirmReject}
        confirmIcon={<X />}
        cancelLabel={copy.cancel}
        loading={review.reject.isPending}
        onConfirm={reason => review.reject.mutate(reason)}
        onCancel={() => setRejecting(false)}
      />
    );
  }

  return (
    <div className="flex w-full justify-end gap-2">
      {allowed.reject && host.status !== "rejected" ? (
        <Button variant="danger" leftIcon={<X />} onClick={() => setRejecting(true)} disabled={review.busy}>
          {rejectLabel}
        </Button>
      ) : null}
      {allowed.approve && !verified ? (
        <Button
          leftIcon={<Check />}
          loading={review.approve.isPending}
          disabled={review.busy}
          onClick={async () => {
            if (await confirm(copy.confirmApprove(host.fullName))) review.approve.mutate();
          }}
        >
          {host.status === "rejected" ? copy.reapprove : copy.approve}
        </Button>
      ) : null}
    </div>
  );
}
