import type { Metadata } from "next";
import { HealthView } from "@/components/health/health-view";
import { healthCopy } from "@/content/health";

export const metadata: Metadata = { title: healthCopy.page.title };

export default function HealthPage() {
  return <HealthView />;
}
