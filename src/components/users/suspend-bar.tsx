"use client";

import { UserCheck, UserX } from "lucide-react";
import { useState } from "react";
import { useConfirm } from "@/components/providers/confirm-provider";
import { ReasonForm } from "@/components/shared/reason-form";
import { Button } from "@/components/ui/button";
import { usersCopy } from "@/content/users";
import { useSuspension } from "@/hooks/use-users";
import type { UserDetail } from "@/types";

const copy = usersCopy.actions;

/** Suspend (with a reason) or lift a suspension. */
export function SuspendBar({ user }: { user: UserDetail }) {
  const suspension = useSuspension(user.id);
  const confirm = useConfirm();
  const [suspending, setSuspending] = useState(false);

  if (user.suspendedAt) {
    return (
      <Button
        leftIcon={<UserCheck />}
        loading={suspension.unsuspend.isPending}
        onClick={async () => {
          if (await confirm(copy.confirmUnsuspend)) suspension.unsuspend.mutate();
        }}
      >
        {copy.unsuspend}
      </Button>
    );
  }

  if (!suspending) {
    return (
      <Button variant="danger" leftIcon={<UserX />} onClick={() => setSuspending(true)}>
        {copy.suspend}
      </Button>
    );
  }

  return (
    <ReasonForm
      label={copy.reason}
      hint={copy.reasonHint}
      presetsLabel={copy.presetsLabel}
      presets={copy.presets}
      confirmLabel={copy.confirmSuspend}
      confirmIcon={<UserX />}
      cancelLabel={copy.cancel}
      loading={suspension.suspend.isPending}
      onConfirm={reason => suspension.suspend.mutate(reason, { onSuccess: () => setSuspending(false) })}
      onCancel={() => setSuspending(false)}
    />
  );
}
