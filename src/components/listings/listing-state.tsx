import { Badge } from "@/components/ui/badge";
import { listingsCopy } from "@/content/listings";

/** Listed (green), Paused (grey) or In review (amber). */
export function ListingState({ listed, verified }: { listed: boolean; verified: boolean }) {
  if (!verified) return <Badge variant="warning" showDot>{listingsCopy.state.unverified}</Badge>;
  return listed ? (
    <Badge variant="accent" showDot>{listingsCopy.state.live}</Badge>
  ) : (
    <Badge variant="neutral" showDot>{listingsCopy.state.paused}</Badge>
  );
}
