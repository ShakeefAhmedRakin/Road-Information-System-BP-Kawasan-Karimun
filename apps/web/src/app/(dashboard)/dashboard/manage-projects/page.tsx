import { hasMinimumRole } from "@/hooks/auth/useAuthServer";
import { USER_ROLES } from "api/src/modules/auth/auth.constants";
import UnauthorizedCard from "../../../../components/unauthorized-card";
import PageHeader from "../_components/page-header";

export default async function ManageProjectsPage() {
  const allowedAccess = await hasMinimumRole(USER_ROLES.OPERATOR);

  if (!allowedAccess) {
    return <UnauthorizedCard />;
  }

  return (
    <>
      <PageHeader title="Manage Projects" description="Manage your projects" />
    </>
  );
}
