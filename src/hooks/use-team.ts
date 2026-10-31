"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import type { Permission } from "@/config/permissions";
import { teamCopy } from "@/content/team";
import { adminApi, adminQuery } from "@/services/admin";
import type { AddMemberRequest, TeamMember } from "@/types";

export function useTeam(enabled: boolean) {
  return useQuery({ queryKey: adminQuery.team, queryFn: adminApi.team, enabled });
}

/**
 * Every Team change. Each refreshes the list and shows a toast; failures show the server's message.
 * add and resetPassword hand the one-time temporary password to onPassword.
 */
export function useTeamActions(handlers: { onDone: () => void; onPassword: (password: string) => void }) {
  const client = useQueryClient();
  const refresh = () => client.invalidateQueries({ queryKey: adminQuery.team });
  const fail = (error: Error) => toast.error(error.message);
  const done = (message: string) => {
    toast.success(message);
    refresh();
    handlers.onDone();
  };

  const add = useMutation({
    mutationFn: (body: AddMemberRequest) => adminApi.addMember(body),
    onSuccess: ({ member, temporaryPassword }) => {
      toast.success(teamCopy.toast.added(member.fullName));
      refresh();
      handlers.onPassword(temporaryPassword);
    },
    onError: fail,
  });
  const update = useMutation({
    mutationFn: ({ id, ...body }: { id: string; permissions?: Permission[]; status?: TeamMember["status"] }) =>
      adminApi.updateMember(id, body),
    onSuccess: member => done(teamCopy.toast.updated(member.fullName)),
    onError: fail,
  });
  const resetPassword = useMutation({
    mutationFn: (id: string) => adminApi.resetPassword(id),
    onSuccess: ({ temporaryPassword }) => {
      refresh();
      handlers.onPassword(temporaryPassword);
    },
    onError: fail,
  });
  const resetTwoFactor = useMutation({
    mutationFn: (id: string) => adminApi.resetTwoFactor(id),
    onSuccess: member => done(teamCopy.toast.twoFactorOff(member.fullName)),
    onError: fail,
  });
  const remove = useMutation({
    mutationFn: (id: string) => adminApi.removeMember(id),
    onSuccess: () => done(teamCopy.toast.removed),
    onError: fail,
  });

  const all = [add, update, resetPassword, resetTwoFactor, remove];
  return { add, update, resetPassword, resetTwoFactor, remove, busy: all.some(action => action.isPending) };
}
