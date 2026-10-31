import type { Metadata } from "next";
import { HostsView } from "@/components/hosts/hosts-view";
import { hostsCopy } from "@/content/hosts";

export const metadata: Metadata = { title: hostsCopy.page.title };

export default function HostsPage() {
  return <HostsView />;
}
