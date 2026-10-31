import { CircleAlert, RotateCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { errorCopy, layoutCopy } from "@/content/layout";

type ErrorStateProps = {
  message: string;
  onRetry: () => void;
};

/** A failed load, with the server's message and a retry. */
export function ErrorState({ message, onRetry }: ErrorStateProps) {
  return (
    <Card className="grid justify-items-center gap-3 py-12 text-center">
      <span aria-hidden="true" className="grid size-11 place-items-center rounded-md bg-danger-soft text-danger">
        <CircleAlert className="size-5" />
      </span>
      <div className="grid gap-1" role="alert">
        <h2 className="font-semibold text-heading">{errorCopy.title}</h2>
        <p className="max-w-sm text-sm text-muted">{message}</p>
      </div>
      <Button variant="secondary" size="sm" leftIcon={<RotateCw />} onClick={onRetry}>
        {layoutCopy.retry}
      </Button>
    </Card>
  );
}
