"use client";

import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import { useConfirm } from "@/components/providers/confirm-provider";
import { ReasonForm } from "@/components/shared/reason-form";
import { Button } from "@/components/ui/button";
import { listingsCopy } from "@/content/listings";
import { useSetListed } from "@/hooks/use-listings";
import type { ListingDetail } from "@/types";

const copy = listingsCopy.actions;

/** Pause (always with a reason) or list again. Unverified chargers wait for Host verification. */
export function PauseBar({ listing }: { listing: ListingDetail }) {
  const setListed = useSetListed(listing.id);
  const confirm = useConfirm();
  const [pausing, setPausing] = useState(false);

  if (!listing.verifiedAt) return <p className="mr-auto text-xs text-muted">{copy.unverified}</p>;

  if (!listing.listed) {
    return (
      <Button
        leftIcon={<Eye />}
        loading={setListed.isPending}
        onClick={async () => {
          if (await confirm(copy.confirmRelist)) setListed.mutate({ listed: true });
        }}
      >
        {copy.relist}
      </Button>
    );
  }

  if (!pausing) {
    return (
      <Button variant="danger" leftIcon={<EyeOff />} onClick={() => setPausing(true)}>
        {copy.pause}
      </Button>
    );
  }

  return (
    <ReasonForm
      label={copy.reason}
      hint={copy.reasonHint}
      presetsLabel={copy.presetsLabel}
      presets={copy.presets}
      confirmLabel={copy.confirmPause}
      confirmIcon={<EyeOff />}
      cancelLabel={copy.cancel}
      loading={setListed.isPending}
      onConfirm={reason => setListed.mutate({ listed: false, reason }, { onSuccess: () => setPausing(false) })}
      onCancel={() => setPausing(false)}
    />
  );
}
