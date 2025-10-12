import PageLayout from "@/components/ui/page-layout";
import { hasMinimumRole, useAuthServer } from "@/hooks/auth/useAuthServer";
import { USER_ROLES } from "api/src/modules/auth/auth.constants";
import UnauthorizedCard from "../../../../components/unauthorized-card";
import UsersTableContainer from "./_components/users-table-container";

export default async function ManageUsersPage() {
  const allowedAccess = await hasMinimumRole(USER_ROLES.ADMIN);
  const { user } = await useAuthServer();

  if (!allowedAccess || !user) {
    return <UnauthorizedCard />;
  }

  return (
    <PageLayout title="Manage Users" description="Manage your users" contained>
      <div className="h-full max-h-full">
        <UsersTableContainer user={user} />
      </div>
    </PageLayout>
  );
}
