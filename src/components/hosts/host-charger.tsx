import { ExternalLink } from "lucide-react";
import { DetailRow, DetailSection } from "@/components/shared/detail-list";
import { PhotoTile } from "@/components/hosts/photo-tile";
import { areaName } from "@/content/areas";
import { hostsCopy } from "@/content/hosts";
import { formatRupees } from "@/lib/format";
import type { DayKey, HostCharger as Charger } from "@/types";

const copy = hostsCopy.detail.charger;
const days = Object.keys(hostsCopy.days) as DayKey[];

/** Google Maps at the exact pin. Only admins and, after acceptance, the driver ever see this. */
const mapLink = ({ latitude, longitude }: NonNullable<Charger["coordinates"]>) =>
  `https://www.google.com/maps/search/?api=1&query=${latitude},${longitude}`;

/** The charger as submitted: photos, place, price, connectors and weekly hours. The pin only with access to it. */
export function HostCharger({ charger, index }: { charger: Charger; index: number }) {
  return (
    <div className="grid gap-4">
      <div className="grid gap-3 sm:grid-cols-2">
        <PhotoTile src={charger.photos.charger} label={copy.photos.charger} />
        <PhotoTile src={charger.photos.connector} label={copy.photos.connector} />
      </div>
      <DetailSection title={index === 0 ? copy.title : `${copy.title} ${index + 1}`}>
        <DetailRow label={copy.place}>{hostsCopy.location[charger.locationType]}</DetailRow>
        <DetailRow label={copy.area}>{areaName(charger.areaId)}</DetailRow>
        {charger.coordinates ? (
          <DetailRow label={copy.pin}>
            <a
              href={mapLink(charger.coordinates)}
              target="_blank"
              rel="noreferrer noopener"
              className="inline-flex items-center gap-1 font-mono text-xs text-accent hover:underline"
            >
              {charger.coordinates.latitude.toFixed(5)}, {charger.coordinates.longitude.toFixed(5)}
              <ExternalLink aria-hidden="true" className="size-3" />
              <span className="sr-only">{copy.openMap}</span>
            </a>
          </DetailRow>
        ) : null}
        <DetailRow label={copy.rate}>
          {formatRupees(charger.ratePaisa)} {copy.perKwh}
        </DetailRow>
        <DetailRow label={copy.power}>{charger.powerKw} kW</DetailRow>
        <DetailRow label={copy.connectors}>{charger.connectors.map(c => hostsCopy.connectors[c]).join(", ")}</DetailRow>
        <DetailRow label={copy.meter}>{charger.reportsEnergy ? copy.yes : copy.no}</DetailRow>
        <DetailRow label={copy.emergency}>{charger.emergencyAvailability ? copy.yes : copy.no}</DetailRow>
        <DetailRow label={copy.hours}>
          <ul className="grid grid-cols-[3rem_1fr] gap-x-3 gap-y-0.5 text-xs">
            {days.map(day => {
              const hours = charger.hours[day];
              return (
                <li key={day} className="contents">
                  <span className="text-muted">{hostsCopy.days[day]}</span>
                  <span className="tabular-nums">{hours?.open ? `${hours.opensAt} - ${hours.closesAt}` : copy.closed}</span>
                </li>
              );
            })}
          </ul>
        </DetailRow>
        <DetailRow label={copy.instructions}>{charger.instructions || <span className="text-muted">{copy.none}</span>}</DetailRow>
      </DetailSection>
    </div>
  );
}
