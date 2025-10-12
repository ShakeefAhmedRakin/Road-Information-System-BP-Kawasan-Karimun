import PageLayout from "@/components/ui/page-layout";
import { Separator } from "@/components/ui/separator";
import UnauthorizedCard from "@/components/unauthorized-card";
import { useAuthServer } from "@/hooks/auth/useAuthServer";
import { auth } from "api";
import { headers } from "next/headers";
import AccountsNameUpdate from "./_components/accounts-name-update";
import AccountsSessions from "./_components/accounts-sessions";
import AccountsUserCard from "./_components/accounts-user-card";
import PasswordInfoCard from "./_components/password-info-card";

export default async function AccountsPage() {
  const { user, userRole, session: currentSession } = await useAuthServer();

  if (!user) {
    return <UnauthorizedCard />;
  }

  const sessions = await auth.api.listSessions({
    headers: await headers(),
    params: { userId: user.id },
  });

  return (
    <PageLayout
      title="Account"
      description="Manage your user account information"
    >
      <div className="max-w-5xl space-y-4 lg:max-w-2xl">
        <AccountsUserCard user={user} userRole={userRole} />
        <Separator />

        <AccountsNameUpdate user={user} />

        <PasswordInfoCard />

        <AccountsSessions
          sessions={sessions}
          currentSession={currentSession!}
        />
      </div>
    </PageLayout>
  );
}
