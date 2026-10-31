"use client";

import { useDeferredValue, useState } from "react";
import { EmptyState } from "@/components/shared/empty-state";
import { ErrorState } from "@/components/shared/error-state";
import { FilterTabs } from "@/components/shared/filter-tabs";
import { PageHeader } from "@/components/shared/page-header";
import { TableSkeleton } from "@/components/shared/table-skeleton";
import { UserDrawer } from "@/components/users/user-drawer";
import { UsersTable } from "@/components/users/users-table";
import { Input } from "@/components/ui/input";
import { usersCopy as copy } from "@/content/users";
import { useCan } from "@/hooks/use-admin-session";
import { useUsers } from "@/hooks/use-users";
import type { UserFilter } from "@/types";

/** Every app account, filtered by role or suspension, with a search and the account drawer. */
export function UsersView() {
  const can = useCan();
  const [filter, setFilter] = useState<UserFilter>("all");
  const [search, setSearch] = useState("");
  const q = useDeferredValue(search.trim());
  const [openId, setOpenId] = useState<string | null>(null);
  const users = useUsers(filter, q);
  const allowed = { suspend: can("users_suspend"), unsuspend: can("users_unsuspend") };
  const { icon: SearchIcon } = copy.search;
  const rows = users.data?.users;

  return (
    <>
      <PageHeader {...copy.page} />
      <div className="flex flex-wrap items-center justify-between gap-3">
        <FilterTabs label={copy.page.title} tabs={copy.tabs} value={filter} onChange={setFilter} counts={users.data?.counts} />
        <Input
          label={copy.search.label}
          hideLabel
          placeholder={copy.search.placeholder}
          value={search}
          onChange={event => setSearch(event.target.value)}
          leftAddon={<SearchIcon />}
          containerClassName="w-full sm:w-64"
          type="search"
        />
      </div>

      {users.isPending ? <TableSkeleton columns={6} /> : null}
      {users.isError ? <ErrorState message={users.error.message} onRetry={() => users.refetch()} /> : null}
      {rows && rows.length > 0 ? <UsersTable users={rows} onOpen={setOpenId} /> : null}
      {rows && rows.length === 0 ? <EmptyState {...(q ? copy.empty.search : copy.empty[filter])} /> : null}

      <UserDrawer userId={openId} allowed={allowed} onClose={() => setOpenId(null)} />
    </>
  );
}
