"use client";

import { LogOut } from "lucide-react";
import { useSyncExternalStore } from "react";
import { toast } from "sonner";
import { useConfirm } from "@/components/providers/confirm-provider";
import { PasswordForm } from "@/components/settings/password-form";
import { SettingsRow, SettingsSection } from "@/components/settings/settings-section";
import { TwoFactorSettings } from "@/components/settings/two-factor-settings";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { settingsCopy } from "@/content/settings";
import { useAdminSession, useSignOut } from "@/hooks/use-admin-session";
import { browserName } from "@/lib/format";

const copy = settingsCopy.security.sessions;
const noSubscribe = () => () => {};

/**
 * Password, optional 2FA, and signing out. Logins are signed cookies rather than stored
 * sessions, so other devices cannot be listed; "everywhere" ends all of them at once.
 */
export function SecuritySettings() {
  const session = useAdminSession();
  const signOut = useSignOut();
  const everywhere = useSignOut(true);
  const confirm = useConfirm();
  const browser = useSyncExternalStore(noSubscribe, () => browserName(navigator.userAgent), () => "");

  if (session.status !== "ready") {
    return (
      <div className="grid gap-6" aria-busy="true">
        <Skeleton className="h-44 w-full rounded-md" />
        <Skeleton className="h-24 w-full rounded-md" />
      </div>
    );
  }

  return (
    <div className="grid gap-7">
      <PasswordForm />
      <TwoFactorSettings enabled={session.admin.twoFactorEnabled} />
      <SettingsSection title={copy.title}>
        <SettingsRow label={copy.browser} description={browser}>
          <Button variant="secondary" size="sm" leftIcon={<LogOut />} loading={signOut.isPending} onClick={() => signOut.mutate()}>
            {copy.signOut}
          </Button>
        </SettingsRow>
        <SettingsRow label={copy.everywhere} description={copy.everywhereHint}>
          <Button
            variant="danger"
            size="sm"
            loading={everywhere.isPending}
            onClick={async () => {
              if (!(await confirm({ ...copy.confirm, tone: "danger" }))) return;
              everywhere.mutate(undefined, { onError: (error: Error) => toast.error(error.message) });
            }}
          >
            {copy.everywhere}
          </Button>
        </SettingsRow>
      </SettingsSection>
    </div>
  );
}
