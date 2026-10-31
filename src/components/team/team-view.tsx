"use client";

import { useState, type ReactNode } from "react";
import { EmptyState } from "@/components/shared/empty-state";
import { ErrorState } from "@/components/shared/error-state";
import { PageHeader } from "@/components/shared/page-header";
import { TableSkeleton } from "@/components/shared/table-skeleton";
import { MemberDrawer, type DrawerTarget } from "@/components/team/member-drawer";
import { TeamTable } from "@/components/team/team-table";
import { Button } from "@/components/ui/button";
import { teamCopy } from "@/content/team";
import { canDo, useAdminSession } from "@/hooks/use-admin-session";
import { useTeam } from "@/hooks/use-team";
import type { AdminProfile, TeamMember } from "@/types";

function Section({ title, description, children }: { title: string; description?: string; children: ReactNode }) {
  return (
    <section className="grid gap-2.5">
      <div className="grid gap-0.5">
        <h2 className="text-[0.9375rem] font-semibold text-heading">{title}</h2>
        {description ? <p className="text-xs text-muted">{description}</p> : null}
      </div>
      {children}
    </section>
  );
}

/** Super admins always on top, all of them; then the admins, or an empty state. */
function TeamBody({ me, onOpen }: { me: AdminProfile; onOpen: (member: TeamMember) => void }) {
  const team = useTeam(true);
  if (team.isPending) return <TableSkeleton columns={6} />;
  if (team.isError) return <ErrorState message={team.error.message} onRetry={() => team.refetch()} />;
  const superadmins = team.data.filter(member => member.role === "superadmin");
  const admins = team.data.filter(member => member.role !== "superadmin");
  const { sections } = teamCopy;

  return (
    <div className="grid gap-8">
      <Section title={`${sections.superadmins.title} (${superadmins.length})`}>
        <TeamTable members={superadmins} meId={me.id} onOpen={onOpen} />
      </Section>
      <Section title={`${sections.admins.title} (${admins.length})`} description={sections.admins.description}>
        {admins.length > 0 ? <TeamTable members={admins} meId={me.id} onOpen={onOpen} /> : <EmptyState {...teamCopy.empty} />}
      </Section>
    </div>
  );
}

/** The Team page: super admins and admins, and the right-hand drawer for adding and managing admins. */
export function TeamView() {
  const session = useAdminSession();
  const [target, setTarget] = useState<DrawerTarget | null>(null);
  const { label, icon: Icon } = teamCopy.add;
  const me = session.status === "ready" ? session.admin : null;
  const canView = me ? canDo(me, "team_view") : false;
  const canAdd = me ? canDo(me, "team_add") : false;

  return (
    <>
      <PageHeader
        {...teamCopy.page}
        actions={
          canAdd ? (
            <Button leftIcon={<Icon />} onClick={() => setTarget({ mode: "add" })}>
              {label}
            </Button>
          ) : undefined
        }
      />
      {session.status === "error" ? <ErrorState message={teamCopy.noAccess.description} onRetry={session.retry} /> : null}
      {!me && session.status !== "error" ? <TableSkeleton columns={6} /> : null}
      {me && !canView ? <EmptyState {...teamCopy.noAccess} /> : null}
      {me && canView ? <TeamBody me={me} onOpen={member => setTarget({ mode: "edit", member })} /> : null}
      {me ? <MemberDrawer target={target} me={me} onClose={() => setTarget(null)} /> : null}
    </>
  );
}
