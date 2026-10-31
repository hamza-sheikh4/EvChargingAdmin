"use client";

import { useState, type ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

type ReasonFormProps = {
  label: string;
  hint: string;
  presetsLabel: string;
  /** Common reasons; tapping one fills the box, which stays editable. */
  presets: readonly string[];
  confirmLabel: string;
  confirmIcon?: ReactNode;
  cancelLabel: string;
  loading: boolean;
  onConfirm: (reason: string) => void;
  onCancel: () => void;
};

const MIN_LENGTH = 5;

/** A required reason for a hard action (reject, pause, suspend), with tap-to-fill common reasons. */
export function ReasonForm(props: ReasonFormProps) {
  const [reason, setReason] = useState("");
  const trimmed = reason.trim();

  return (
    <div className="grid w-full gap-3">
      <div className="grid gap-1.5">
        <span className="text-xs font-semibold text-fg">{props.presetsLabel}</span>
        <div className="flex flex-wrap gap-1.5">
          {props.presets.map(preset => (
            <button
              key={preset}
              type="button"
              aria-pressed={reason === preset}
              onClick={() => setReason(preset)}
              title={preset}
              className="max-w-full truncate rounded-sm border border-line-strong px-2 py-1 text-left text-xs text-fg transition-colors hover:bg-hover aria-pressed:border-danger aria-pressed:bg-danger-soft aria-pressed:text-danger"
            >
              {preset.split(".")[0]}
            </button>
          ))}
        </div>
      </div>
      <Textarea label={props.label} hint={props.hint} value={reason} onChange={event => setReason(event.target.value)} maxLength={500} />
      <div className="flex justify-end gap-2">
        <Button variant="ghost" onClick={props.onCancel} disabled={props.loading}>
          {props.cancelLabel}
        </Button>
        <Button
          variant="danger"
          leftIcon={props.confirmIcon}
          loading={props.loading}
          disabled={trimmed.length < MIN_LENGTH}
          onClick={() => props.onConfirm(trimmed)}
        >
          {props.confirmLabel}
        </Button>
      </div>
    </div>
  );
}
