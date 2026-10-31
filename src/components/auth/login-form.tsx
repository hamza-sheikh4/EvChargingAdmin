"use client";

import { useQueryClient } from "@tanstack/react-query";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { loginCopy as copy } from "@/content/login";
import { usePreferences } from "@/lib/preferences";
import { adminApi, adminQuery } from "@/services/admin";
import type { LoginResponse } from "@/types";

/** Email and password, then the authenticator code when 2FA is on. */
export function LoginForm() {
  const router = useRouter();
  const client = useQueryClient();
  const { landingPage } = usePreferences();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [code, setCode] = useState("");
  const [challenge, setChallenge] = useState<string | null>(null);
  const [error, setError] = useState<string>();
  const [busy, setBusy] = useState(false);

  const handle = async (call: () => Promise<LoginResponse>) => {
    setBusy(true);
    setError(undefined);
    try {
      const result = await call();
      if (result.twoFactor) {
        setChallenge(result.challenge);
        setBusy(false);
        return;
      }
      client.setQueryData(adminQuery.me, result.admin);
      router.replace(landingPage);
    } catch (failure) {
      setError(failure instanceof Error ? failure.message : String(failure));
      setBusy(false);
    }
  };

  const submit = (event: FormEvent) => {
    event.preventDefault();
    if (challenge) {
      if (!/^\d{6}$/.test(code)) return setError(copy.errors.code);
      return handle(() => adminApi.twoFactor(challenge, code));
    }
    if (!email.trim()) return setError(copy.errors.email);
    if (!password) return setError(copy.errors.password);
    handle(() => adminApi.login(email, password));
  };

  const restart = () => {
    setChallenge(null);
    setCode("");
    setPassword("");
    setError(undefined);
  };

  return (
    <form onSubmit={submit} noValidate className="grid gap-5">
      <div className="grid gap-1">
        <h1 className="text-lg font-semibold text-heading">{challenge ? copy.twoFactor.title : copy.title}</h1>
        <p className="text-[0.8125rem] text-muted">{challenge ? copy.twoFactor.description : copy.description}</p>
      </div>

      {challenge ? (
        <Input
          key="code"
          label={copy.twoFactor.code}
          value={code}
          onChange={event => setCode(event.target.value.replace(/\D/g, "").slice(0, 6))}
          inputMode="numeric"
          autoComplete="one-time-code"
          autoFocus
          className="font-mono tracking-[0.4em]"
        />
      ) : (
        <div className="grid gap-3">
          <Input
            label={copy.email}
            type="email"
            placeholder={copy.emailPlaceholder}
            value={email}
            onChange={event => setEmail(event.target.value)}
            autoComplete="username"
            autoFocus
          />
          <Input
            label={copy.password}
            type="password"
            value={password}
            onChange={event => setPassword(event.target.value)}
            autoComplete="current-password"
          />
        </div>
      )}

      {error ? (
        <p role="alert" className="rounded-sm border border-danger/30 bg-danger-soft px-3 py-2 text-xs font-medium text-danger">
          {error}
        </p>
      ) : null}

      <Button type="submit" fullWidth loading={busy}>
        {challenge ? copy.twoFactor.submit : copy.submit}
      </Button>

      {challenge ? (
        <Button variant="ghost" size="sm" leftIcon={<ArrowLeft />} onClick={restart} className="justify-self-center">
          {copy.twoFactor.back}
        </Button>
      ) : (
        <p className="text-center text-xs text-muted">{copy.forgot}</p>
      )}
    </form>
  );
}
