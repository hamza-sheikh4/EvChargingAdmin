import type { Metadata } from "next";
import { OverviewView } from "@/components/overview/overview-view";
import { overviewCopy } from "@/content/overview";

export const metadata: Metadata = { title: overviewCopy.title };

export default function OverviewPage() {
  return <OverviewView />;
}
