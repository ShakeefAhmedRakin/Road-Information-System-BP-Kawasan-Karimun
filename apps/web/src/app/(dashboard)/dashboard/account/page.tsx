import UnauthorizedCard from "@/components/unauthorized-card";
import { useAuthServer } from "@/hooks/auth/useAuthServer";
import { auth } from "api";
import { headers } from "next/headers";
import AccountPageContent from "./_components/account-page-content";

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
    <AccountPageContent
      user={user}
      userRole={userRole!}
      sessions={sessions}
      currentSession={currentSession!}
    />
  );
}
