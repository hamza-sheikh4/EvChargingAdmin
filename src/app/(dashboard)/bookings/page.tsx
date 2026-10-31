import type { Metadata } from "next";
import { BookingsView } from "@/components/bookings/bookings-view";
import { bookingsCopy } from "@/content/bookings";

export const metadata: Metadata = { title: bookingsCopy.page.title };

export default function BookingsPage() {
  return <BookingsView />;
}
