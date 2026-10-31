"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import type { Permission } from "@/config/permissions";
import { ApiError } from "@/services/api";
import { adminApi, adminQuery } from "@/services/admin";
import type { AdminProfile } from "@/types";

export type AdminSession =
  | { status: "loading" }
  | { status: "signed-out" }
  | { status: "error"; retry: () => void }
  | { status: "ready"; admin: AdminProfile };

/** Who is signed in, from GET /admin/me. A 401 means signed out. */
export function useAdminSession(): AdminSession {
  const query = useQuery({
    queryKey: adminQuery.me,
    queryFn: adminApi.me,
    // A 401 is an answer, not a failure to retry.
    retry: (count, error) => !(error instanceof ApiError && error.status === 401) && count < 1,
  });

  if (query.isPending) return { status: "loading" };
  if (query.isError) {
    if (query.error instanceof ApiError && query.error.status === 401) return { status: "signed-out" };
    return { status: "error", retry: () => query.refetch() };
  }
  return { status: "ready", admin: query.data };
}

/** True when the signed-in admin may do this. The super admin may do everything. */
export function canDo(admin: AdminProfile, permission: Permission | undefined): boolean {
  return !permission || admin.role === "superadmin" || admin.permissions.includes(permission);
}

/** canDo for the signed-in admin; false until they are known. */
export function useCan(): (permission: Permission) => boolean {
  const session = useAdminSession();
  return permission => session.status === "ready" && canDo(session.admin, permission);
}

/** Ends this browser's login, forgets every cached answer, and goes to the sign-in screen. */
export function useSignOut(everywhere = false) {
  const client = useQueryClient();
  const router = useRouter();
  return useMutation({
    mutationFn: everywhere ? adminApi.signOutEverywhere : adminApi.logout,
    onSuccess: () => {
      client.clear();
      router.replace("/login");
    },
  });
}
