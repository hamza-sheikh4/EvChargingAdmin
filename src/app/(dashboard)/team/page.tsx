import type { Metadata } from "next";
import { TeamView } from "@/components/team/team-view";
import { teamCopy } from "@/content/team";

export const metadata: Metadata = { title: teamCopy.page.title };

export default function TeamPage() {
  return <TeamView />;
}
