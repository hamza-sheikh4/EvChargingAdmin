"use client";

import { useState } from "react";
import { MemberActions } from "@/components/team/member-actions";
import { PermissionPicker } from "@/components/team/permission-picker";
import { TemporaryPassword } from "@/components/team/temporary-password";
import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Drawer } from "@/components/ui/drawer";
import { Input } from "@/components/ui/input";
import { allPermissions, defaultNewPermissions, type Permission } from "@/config/permissions";
import { teamCopy } from "@/content/team";
import { canDo } from "@/hooks/use-admin-session";
import { useTeamActions } from "@/hooks/use-team";
import { addMemberErrors, addMemberSchema, type AddMemberErrors } from "@/lib/validation";
import type { AdminProfile, TeamMember } from "@/types";

const copy = teamCopy.drawer;

/** add opens an empty form; a member opens their permissions and account actions. */
export type DrawerTarget = { mode: "add" } | { mode: "edit"; member: TeamMember };

type FormProps = { target: DrawerTarget; me: AdminProfile; onClose: () => void };

function MemberForm({ target, me, onClose }: FormProps) {
  const member = target.mode === "edit" ? target.member : null;
  const locked = member?.role === "superadmin" || member?.id === me.id;
  // Seeing someone's permissions is team_view; changing them is team_edit.
  const readOnly = locked || (member !== null && !canDo(me, "team_edit"));
  const grantable = (permission: Permission) => canDo(me, permission);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [permissions, setPermissions] = useState<Permission[]>(
    member?.permissions ?? defaultNewPermissions.filter(grantable),
  );
  const [errors, setErrors] = useState<AddMemberErrors>({});
  const [password, setPassword] = useState<string | null>(null);
  const actions = useTeamActions({ onDone: onClose, onPassword: setPassword });
  const name = member?.fullName ?? fullName;
  const isSuperadmin = member?.role === "superadmin";

  const submit = () => {
    if (member) {
      if (permissions.length === 0) return setErrors({ permissions: teamCopy.errors.permissions });
      return actions.update.mutate({ id: member.id, permissions });
    }
    const parsed = addMemberSchema.safeParse({ fullName, email, permissions });
    if (!parsed.success) return setErrors(addMemberErrors(parsed.error));
    setErrors({});
    actions.add.mutate({ fullName: parsed.data.fullName, email: parsed.data.email, permissions });
  };

  const footer = password || readOnly ? (
    <Button onClick={onClose}>{copy.close}</Button>
  ) : (
    <>
      <Button variant="ghost" onClick={onClose}>{copy.cancel}</Button>
      <Button onClick={submit} loading={actions.add.isPending || actions.update.isPending}>
        {member ? copy.save : copy.add}
      </Button>
    </>
  );

  return (
    <Drawer
      open
      onOpenChange={open => !open && onClose()}
      title={member ? member.fullName : copy.addTitle}
      description={member ? copy.editDescription : copy.addDescription}
      footer={footer}
    >
      <div className="grid gap-6">
        {password ? <TemporaryPassword name={name} password={password} /> : null}
        {member ? (
          <div className="flex items-center gap-3">
            <Avatar name={member.fullName} />
            <span className="text-[0.8125rem] text-muted">{member.email}</span>
          </div>
        ) : password ? null : (
          <div className="grid gap-3">
            <Input
              label={copy.name}
              placeholder={copy.namePlaceholder}
              value={fullName}
              onChange={event => setFullName(event.target.value)}
              error={errors.fullName}
              autoComplete="off"
            />
            <Input
              label={copy.email}
              type="email"
              placeholder={copy.emailPlaceholder}
              value={email}
              onChange={event => setEmail(event.target.value)}
              error={errors.email}
              autoComplete="off"
            />
          </div>
        )}
        {password && !member ? null : (
          <div className="grid gap-2">
            <div className="flex items-baseline justify-between">
              <h3 className="text-[0.8125rem] font-semibold text-heading">{copy.permissions}</h3>
              <span className="text-xs text-muted">
                {teamCopy.access(isSuperadmin ? allPermissions.length : permissions.length, allPermissions.length)}
              </span>
            </div>
            {locked && !isSuperadmin ? <p className="text-xs text-muted">{copy.selfNote}</p> : null}
            {member && !locked && readOnly ? <p className="text-xs text-muted">{copy.noEdit}</p> : null}
            {!readOnly ? <p className="text-xs text-muted">{copy.needsView}</p> : null}
            {!readOnly && me.role !== "superadmin" ? <p className="text-xs text-muted">{copy.notYours}</p> : null}
            {errors.permissions ? <p role="alert" className="text-xs font-medium text-danger">{errors.permissions}</p> : null}
            <PermissionPicker
              value={isSuperadmin ? allPermissions : permissions}
              onChange={setPermissions}
              disabled={readOnly || actions.busy}
              grantable={grantable}
            />
          </div>
        )}
        {member && !locked ? <MemberActions member={member} me={me} actions={actions} /> : null}
      </div>
    </Drawer>
  );
}

/** The right-hand panel for adding an admin or managing one. */
export function MemberDrawer({ target, me, onClose }: { target: DrawerTarget | null; me: AdminProfile; onClose: () => void }) {
  if (!target) return null;
  // A new key per target, so the form starts fresh each time it opens.
  const key = target.mode === "edit" ? target.member.id : "add";
  return <MemberForm key={key} target={target} me={me} onClose={onClose} />;
}
