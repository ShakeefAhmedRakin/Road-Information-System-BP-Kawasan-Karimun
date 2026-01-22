"use client";

import PageLayout from "@/components/ui/page-layout";
import { useTranslation } from "@/i18n/hooks/useTranslation";
import type { User } from "better-auth";
import UsersTableContainer from "../manage-users/_components/users-table-container";

export default function ManageUsersPageContent({ user }: { user: User }) {
  const { t } = useTranslation("pageHeaders");

  return (
    <PageLayout
      title={t("manageUsers.title")}
      description={t("manageUsers.description")}
      contained
    >
      <div className="h-full max-h-full">
        <UsersTableContainer user={user} />
      </div>
    </PageLayout>
  );
}
