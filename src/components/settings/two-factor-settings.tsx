"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Copy } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { SettingsRow, SettingsSection } from "@/components/settings/settings-section";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { settingsCopy } from "@/content/settings";
import { adminApi, adminQuery } from "@/services/admin";
import type { TwoFactorSetup } from "@/types";

const copy = settingsCopy.security.twoFactor;

/** "ABCD EFGH IJKL ..." is easier to type into a phone than one long run. */
const grouped = (secret: string) => secret.match(/.{1,4}/g)?.join(" ") ?? secret;

/** Optional 2FA: set up with a key and a confirming code, or turn off with the password. */
export function TwoFactorSettings({ enabled }: { enabled: boolean }) {
  const client = useQueryClient();
  const [setup, setSetup] = useState<TwoFactorSetup | null>(null);
  const [code, setCode] = useState("");
  const [password, setPassword] = useState("");
  const refresh = () => client.invalidateQueries({ queryKey: adminQuery.me });
  const fail = (error: Error) => toast.error(error.message);

  const start = useMutation({ mutationFn: adminApi.setupTwoFactor, onSuccess: setSetup, onError: fail });
  const enable = useMutation({
    mutationFn: () => adminApi.enableTwoFactor(code),
    onSuccess: () => {
      toast.success(copy.enabled);
      setSetup(null);
      setCode("");
      refresh();
    },
    onError: fail,
  });
  const disable = useMutation({
    mutationFn: () => adminApi.disableTwoFactor(password),
    onSuccess: () => {
      toast.success(copy.disabled);
      setPassword("");
      refresh();
    },
    onError: fail,
  });

  const copyKey = async (secret: string) => {
    await navigator.clipboard.writeText(secret).catch(() => undefined);
    toast.success(copy.copied);
  };

  return (
    <SettingsSection title={copy.title} description={copy.description}>
      <SettingsRow label={copy.title}>
        <Badge variant={enabled ? "accent" : "neutral"} showDot>{enabled ? copy.on : copy.off}</Badge>
        {!enabled && !setup ? (
          <Button variant="secondary" size="sm" loading={start.isPending} onClick={() => start.mutate()}>{copy.start}</Button>
        ) : null}
      </SettingsRow>

      {setup && !enabled ? (
        <div className="grid gap-4 p-4">
          <ol className="grid list-decimal gap-1 pl-4 text-xs text-muted">
            {copy.steps.map(step => <li key={step}>{step}</li>)}
          </ol>
          <div className="grid gap-1.5">
            <span className="text-xs font-semibold text-fg">{copy.key}</span>
            <div className="flex flex-wrap items-center gap-2">
              <code className="rounded-sm border border-line bg-surface-muted px-2.5 py-1.5 font-mono text-[0.8125rem] tracking-wider text-heading select-all">
                {grouped(setup.secret)}
              </code>
              <Button variant="ghost" size="sm" leftIcon={<Copy />} onClick={() => copyKey(setup.secret)}>{copy.copyKey}</Button>
              <a href={setup.uri} className="text-xs font-medium text-accent hover:underline">{copy.openApp}</a>
            </div>
          </div>
          <div className="flex flex-wrap items-end gap-2">
            <Input
              label={copy.code}
              value={code}
              onChange={event => setCode(event.target.value.replace(/\D/g, "").slice(0, 6))}
              inputMode="numeric"
              autoComplete="one-time-code"
              className="font-mono tracking-[0.3em]"
              containerClassName="w-40"
            />
            <Button loading={enable.isPending} disabled={code.length !== 6} onClick={() => enable.mutate()}>{copy.enable}</Button>
            <Button variant="ghost" onClick={() => setSetup(null)}>{copy.cancel}</Button>
          </div>
        </div>
      ) : null}

      {enabled ? (
        <div className="flex flex-wrap items-end gap-2 p-4">
          <Input
            label={copy.disablePassword}
            type="password"
            autoComplete="current-password"
            value={password}
            onChange={event => setPassword(event.target.value)}
            containerClassName="w-56"
          />
          <Button variant="danger" loading={disable.isPending} disabled={!password} onClick={() => disable.mutate()}>
            {copy.disable}
          </Button>
        </div>
      ) : null}
    </SettingsSection>
  );
}
