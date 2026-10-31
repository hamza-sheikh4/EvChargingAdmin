import type { Metadata } from "next";
import { ListingsView } from "@/components/listings/listings-view";
import { listingsCopy } from "@/content/listings";

export const metadata: Metadata = { title: listingsCopy.page.title };

export default function ListingsPage() {
  return <ListingsView />;
}
