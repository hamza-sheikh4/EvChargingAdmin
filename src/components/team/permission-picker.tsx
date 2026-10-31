"use client";

import { Switch } from "@/components/ui/switch";
import { permissionGroups, viewOf, type Permission } from "@/config/permissions";
import { permissionCopy, permissionGroupLabels } from "@/content/permissions";
import { teamCopy } from "@/content/team";

type PermissionPickerProps = {
  value: Permission[];
  onChange: (value: Permission[]) => void;
  disabled?: boolean;
  /** Permissions the signed-in admin may hand out. Others show but cannot be switched. */
  grantable?: (permission: Permission) => boolean;
};

type Group = (typeof permissionGroups)[number];

/**
 * One switch per permission, grouped by page, with an All switch per group. Every action in a
 * group needs that group's "See the page": turning an action on turns it on, turning it off
 * turns the whole group off. The backend applies the same rule.
 */
export function PermissionPicker({ value, onChange, disabled, grantable = () => true }: PermissionPickerProps) {
  const has = (permission: Permission) => value.includes(permission);

  const toggle = (group: Group, permission: Permission, on: boolean) => {
    const view = viewOf(group);
    if (on) return onChange([...new Set([...value, permission, view])]);
    const off: readonly Permission[] = permission === view ? group.permissions : [permission];
    onChange(value.filter(item => !off.includes(item)));
  };

  const toggleGroup = (group: Group, on: boolean) => {
    const mine = group.permissions.filter(grantable);
    onChange(on ? [...new Set([...value, ...mine])] : value.filter(item => !mine.includes(item)));
  };

  return (
    <div className="grid gap-3">
      {permissionGroups.map(group => {
        const allOn = group.permissions.every(has);
        const groupId = `perm-group-${group.id}`;
        return (
          <div key={group.id} role="group" aria-labelledby={groupId} className="rounded-md border border-line bg-surface-muted">
            <div className="flex items-center justify-between gap-3 border-b border-line px-3.5 py-2.5">
              <p id={groupId} className="text-xs font-semibold tracking-wide text-heading uppercase">
                {permissionGroupLabels[group.id]}
              </p>
              {group.permissions.length > 1 ? (
                <label className="flex items-center gap-2 text-xs text-muted">
                  {teamCopy.drawer.all}
                  <Switch
                    checked={allOn}
                    onCheckedChange={on => toggleGroup(group, on)}
                    label={`${teamCopy.drawer.all}: ${permissionGroupLabels[group.id]}`}
                    disabled={disabled}
                  />
                </label>
              ) : null}
            </div>
            {group.permissions.map((permission, index) => {
              const labelId = `perm-${permission}`;
              return (
                // Actions sit indented under "See the page".
                <div key={permission} className={index === 0 ? "flex items-center justify-between gap-4 px-3.5 py-3" : "flex items-center justify-between gap-4 py-3 pr-3.5 pl-7"}>
                  <div className="grid gap-0.5">
                    <span id={labelId} className="text-sm font-medium text-fg">{permissionCopy[permission].label}</span>
                    <span className="text-xs text-muted">{permissionCopy[permission].description}</span>
                  </div>
                  <Switch
                    checked={has(permission)}
                    onCheckedChange={on => toggle(group, permission, on)}
                    labelledBy={labelId}
                    disabled={disabled || !grantable(permission)}
                  />
                </div>
              );
            })}
          </div>
        );
      })}
    </div>
  );
}
