"use client";

import { Copy, KeyRound } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { teamCopy } from "@/content/team";

const copy = teamCopy.temporary;

/** The one-time password after adding someone or resetting theirs. It is never shown again. */
export function TemporaryPassword({ name, password }: { name: string; password: string }) {
  const copyIt = async () => {
    await navigator.clipboard.writeText(password).catch(() => undefined);
    toast.success(copy.copied);
  };

  return (
    <div className="grid gap-3 rounded-md border border-line bg-surface-muted p-4">
      <div className="flex items-center gap-2 text-[0.8125rem] font-semibold text-heading">
        <KeyRound aria-hidden="true" className="size-4 text-accent" />
        {copy.title}
      </div>
      <div className="flex items-center gap-2">
        <code className="flex-1 rounded-sm border border-line bg-surface px-3 py-2 font-mono text-sm tracking-wider text-heading select-all">
          {password}
        </code>
        <Button variant="secondary" size="sm" leftIcon={<Copy />} onClick={copyIt}>
          {copy.copy}
        </Button>
      </div>
      <p className="text-xs text-muted">{copy.description(name)}</p>
    </div>
  );
}
