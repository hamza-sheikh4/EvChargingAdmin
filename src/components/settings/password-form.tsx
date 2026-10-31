"use client";

import { useMutation } from "@tanstack/react-query";
import { useState, type FormEvent } from "react";
import { toast } from "sonner";
import { SettingsSection } from "@/components/settings/settings-section";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { settingsCopy } from "@/content/settings";
import { adminApi } from "@/services/admin";

const copy = settingsCopy.security.password;
const minLength = 10;

/** Change password. The backend signs out every other device and keeps this one signed in. */
export function PasswordForm() {
  const [current, setCurrent] = useState("");
  const [next, setNext] = useState("");
  const [repeat, setRepeat] = useState("");
  const [error, setError] = useState<string>();
  const change = useMutation({
    mutationFn: () => adminApi.changePassword(current, next),
    onSuccess: () => {
      toast.success(copy.saved);
      setCurrent("");
      setNext("");
      setRepeat("");
    },
    onError: (failure: Error) => setError(failure.message),
  });

  const submit = (event: FormEvent) => {
    event.preventDefault();
    if (next.length < minLength) return setError(copy.tooShort);
    if (next !== repeat) return setError(copy.mismatch);
    setError(undefined);
    change.mutate();
  };

  return (
    <SettingsSection title={copy.title} description={copy.description}>
      <form onSubmit={submit} noValidate className="grid gap-3 p-4">
        <Input label={copy.current} type="password" autoComplete="current-password" value={current} onChange={event => setCurrent(event.target.value)} />
        <div className="grid gap-3 sm:grid-cols-2">
          <Input label={copy.next} hint={copy.nextHint} type="password" autoComplete="new-password" value={next} onChange={event => setNext(event.target.value)} />
          <Input label={copy.confirm} type="password" autoComplete="new-password" value={repeat} onChange={event => setRepeat(event.target.value)} />
        </div>
        {error ? <p role="alert" className="text-xs font-medium text-danger">{error}</p> : null}
        <Button type="submit" variant="secondary" loading={change.isPending} disabled={!current || !next} className="justify-self-start">
          {copy.save}
        </Button>
      </form>
    </SettingsSection>
  );
}
