"use client";

import { useConfirm, type ConfirmOptions } from "@/components/providers/confirm-provider";
import { SettingsRow, SettingsSection } from "@/components/settings/settings-section";
import { Button } from "@/components/ui/button";
import { teamCopy } from "@/content/team";
import { canDo } from "@/hooks/use-admin-session";
import type { useTeamActions } from "@/hooks/use-team";
import type { AdminProfile, TeamMember } from "@/types";

const copy = teamCopy.actions;

type MemberActionsProps = {
  member: TeamMember;
  /** The signed-in admin: each action shows only with its own permission. */
  me: AdminProfile;
  actions: ReturnType<typeof useTeamActions>;
};

/** Suspend, reset password, turn off 2FA and remove. Each asks in a confirm dialog where it cannot be undone. */
export function MemberActions({ member, me, actions }: MemberActionsProps) {
  const confirm = useConfirm();
  const can = { suspend: canDo(me, "team_suspend"), reset: canDo(me, "team_reset"), remove: canDo(me, "team_remove") };
  if (!can.suspend && !can.reset && !can.remove) return null;

  const suspended = member.status === "suspended";
  const ask = async (options: ConfirmOptions, run: () => void) => {
    if (await confirm({ tone: "danger", ...options })) run();
  };
  const setStatus = (status: TeamMember["status"]) => actions.update.mutate({ id: member.id, status });

  return (
    <SettingsSection title={copy.title}>
      {can.suspend ? (
        <SettingsRow label={suspended ? copy.reactivate : copy.suspend} description={copy.suspendHint}>
          <Button
            variant={suspended ? "secondary" : "danger"}
            size="sm"
            disabled={actions.busy}
            onClick={() => (suspended ? setStatus("active") : ask(copy.confirmSuspend(member.fullName), () => setStatus("suspended")))}
          >
            {suspended ? copy.reactivate : copy.suspend}
          </Button>
        </SettingsRow>
      ) : null}
      {can.reset ? (
        <SettingsRow label={copy.resetPassword} description={copy.resetPasswordHint}>
          <Button
            variant="secondary"
            size="sm"
            loading={actions.resetPassword.isPending}
            disabled={actions.busy}
            onClick={() => ask(copy.confirmReset(member.fullName), () => actions.resetPassword.mutate(member.id))}
          >
            {copy.resetPassword}
          </Button>
        </SettingsRow>
      ) : null}
      {can.reset && member.twoFactorEnabled ? (
        <SettingsRow label={copy.resetTwoFactor} description={copy.resetTwoFactorHint}>
          <Button variant="secondary" size="sm" disabled={actions.busy} onClick={() => actions.resetTwoFactor.mutate(member.id)}>
            {copy.resetTwoFactor}
          </Button>
        </SettingsRow>
      ) : null}
      {can.remove ? (
        <SettingsRow label={copy.remove} description={copy.removeHint}>
          <Button
            variant="danger"
            size="sm"
            disabled={actions.busy}
            onClick={() => ask(copy.confirmRemove(member.fullName), () => actions.remove.mutate(member.id))}
          >
            {copy.remove}
          </Button>
        </SettingsRow>
      ) : null}
    </SettingsSection>
  );
}
