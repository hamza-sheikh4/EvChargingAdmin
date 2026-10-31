import { ExternalLink } from "lucide-react";
import { hostsCopy } from "@/content/hosts";
import { listingsCopy } from "@/content/listings";

/** How far around the pin the map shows, in degrees (about 400 m). */
const SPAN = 0.002;

/**
 * The exact pin on an OpenStreetMap embed: free, no key and no package. Admin-only;
 * drivers only ever see the approximate point until the host accepts.
 */
export function PinMap({ latitude, longitude }: { latitude: number; longitude: number }) {
  const bbox = [longitude - SPAN, latitude - SPAN, longitude + SPAN, latitude + SPAN].join(",");
  const src = `https://www.openstreetmap.org/export/embed.html?bbox=${bbox}&layer=mapnik&marker=${latitude},${longitude}`;
  const google = `https://www.google.com/maps/search/?api=1&query=${latitude},${longitude}`;

  return (
    <section className="grid gap-2">
      <div className="flex items-baseline justify-between gap-3">
        <h3 className="text-[0.8125rem] font-semibold text-heading">{listingsCopy.detail.map.title}</h3>
        <a href={google} target="_blank" rel="noreferrer noopener" className="inline-flex items-center gap-1 text-xs font-medium text-accent hover:underline">
          {hostsCopy.detail.charger.openMap}
          <ExternalLink aria-hidden="true" className="size-3" />
        </a>
      </div>
      <iframe
        title={listingsCopy.detail.map.label}
        src={src}
        loading="lazy"
        referrerPolicy="no-referrer"
        className="aspect-[16/9] w-full rounded-md border border-line bg-surface-muted"
      />
    </section>
  );
}
