import { ExternalLink, ImageOff } from "lucide-react";
import { hostsCopy } from "@/content/hosts";

const copy = hostsCopy.detail.documents;

/**
 * A document or charger photo from a signed link (valid for an hour). Clicking opens it full size.
 * A plain img on purpose: the links are private and short-lived, so next/image must not cache them.
 */
export function PhotoTile({ src, label }: { src: string | null; label: string }) {
  if (!src) {
    return (
      <div className="grid aspect-[4/3] place-items-center gap-1 rounded-md border border-dashed border-line-strong bg-surface-muted text-xs text-muted">
        <span className="grid justify-items-center gap-1">
          <ImageOff aria-hidden="true" className="size-4" />
          {label}: {copy.missing}
        </span>
      </div>
    );
  }
  return (
    <a
      href={src}
      target="_blank"
      rel="noreferrer noopener"
      className="group relative block overflow-hidden rounded-md border border-line bg-surface-muted"
      aria-label={`${label}: ${copy.open}`}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={src} alt={label} className="aspect-[4/3] w-full object-cover" referrerPolicy="no-referrer" />
      <span className="absolute inset-x-0 bottom-0 flex items-center justify-between bg-linear-to-t from-[rgb(0_0_0/0.6)] to-transparent px-2.5 pt-6 pb-2 text-xs font-medium text-white">
        {label}
        <ExternalLink aria-hidden="true" className="size-3.5 opacity-70 group-hover:opacity-100" />
      </span>
    </a>
  );
}
