"use client";

import PageLayout from "@/components/ui/page-layout";
import { Separator } from "@/components/ui/separator";
import { useTranslation } from "@/i18n/hooks/useTranslation";
import type { Session } from "better-auth";
import type { User } from "better-auth";
import type { UserRole } from "api/src/modules/auth/auth.constants";
import AccountsNameUpdate from "./accounts-name-update";
import AccountsSessions from "./accounts-sessions";
import AccountsUserCard from "./accounts-user-card";
import PasswordInfoCard from "./password-info-card";

export default function AccountPageContent({
  user,
  userRole,
  sessions,
  currentSession,
}: {
  user: User;
  userRole: UserRole;
  sessions: Session[];
  currentSession: Session;
}) {
  const { t } = useTranslation("account");

  return (
    <PageLayout
      title={t("page.title")}
      description={t("page.description")}
    >
      <div className="max-w-5xl space-y-4 lg:max-w-2xl">
        <AccountsUserCard user={user} userRole={userRole} />
        <Separator />

        <AccountsNameUpdate user={user} />

        <PasswordInfoCard />

        <AccountsSessions
          sessions={sessions}
          currentSession={currentSession}
        />
      </div>
    </PageLayout>
  );
}
