import { hasMinimumRole, useAuthServer } from "@/hooks/auth/useAuthServer";
import { USER_ROLES } from "api/src/modules/auth/auth.constants";
import UnauthorizedCard from "../../../../components/unauthorized-card";
import ManageUsersPageContent from "../_components/manage-users-page-content";

export default async function ManageUsersPage() {
  const allowedAccess = await hasMinimumRole(USER_ROLES.ADMIN);
  const { user } = await useAuthServer();

  if (!allowedAccess || !user) {
    return <UnauthorizedCard />;
  }

  return <ManageUsersPageContent user={user} />;
}
