import { Zap } from "lucide-react";
import Link from "next/link";
import { environment } from "@/config/environment";
import { siteConfig } from "@/config/site";
import { layoutCopy } from "@/content/layout";
import { cn } from "@/lib/utils";

const envLabel = environment.appEnv === "production" ? layoutCopy.environment.production : layoutCopy.environment.development;

/** Brand mark, wordmark and Dev/Live tag, linking to the overview. Same mark as the landing site. */
export function Logo({ className }: { className?: string }) {
  return (
    <Link
      href="/"
      aria-label={`${siteConfig.title} ${layoutCopy.homeLabel}`}
      className={cn("inline-flex items-center gap-2 rounded-sm text-[0.8125rem] font-semibold text-heading", className)}
    >
      <span aria-hidden="true" className="grid size-6 place-items-center rounded-sm bg-forest text-mint dark:bg-mint dark:text-forest">
        <Zap className="size-3.5" fill="currentColor" strokeWidth={1.5} />
      </span>
      {siteConfig.name}
      <span className="rounded-xs border border-line px-1.5 text-[0.6875rem] font-medium text-muted">{envLabel}</span>
    </Link>
  );
}
