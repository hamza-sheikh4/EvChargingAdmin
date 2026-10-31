import { Badge } from "@/components/ui/badge";
import { usersCopy } from "@/content/users";
import type { UserRole } from "@/types";

/** Driver (green) and Host (blue), matching the app's role colours. */
export function RoleBadges({ roles }: { roles: UserRole[] }) {
  if (roles.length === 0) return <span className="text-xs text-muted">-</span>;
  return (
    <span className="flex flex-wrap gap-1">
      {roles.map(role => (
        <Badge key={role} variant={role === "driver" ? "accent" : "host"}>
          {usersCopy.roles[role]}
        </Badge>
      ))}
    </span>
  );
}

export function AccountState({ suspended }: { suspended: boolean }) {
  return suspended ? (
    <Badge variant="danger" showDot>{usersCopy.status.suspended}</Badge>
  ) : (
    <Badge variant="neutral" showDot>{usersCopy.status.active}</Badge>
  );
}
