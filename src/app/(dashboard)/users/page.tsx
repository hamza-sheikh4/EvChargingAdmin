import type { Metadata } from "next";
import { UsersView } from "@/components/users/users-view";
import { usersCopy } from "@/content/users";

export const metadata: Metadata = { title: usersCopy.page.title };

export default function UsersPage() {
  return <UsersView />;
}
