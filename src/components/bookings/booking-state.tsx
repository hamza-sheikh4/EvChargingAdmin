import { Badge } from "@/components/ui/badge";
import { bookingsCopy } from "@/content/bookings";
import type { BookingState as State } from "@/types";

export function BookingState({ state }: { state: State }) {
  const { label, tone } = bookingsCopy.states[state];
  return (
    <Badge variant={tone} showDot>
      {label}
    </Badge>
  );
}
