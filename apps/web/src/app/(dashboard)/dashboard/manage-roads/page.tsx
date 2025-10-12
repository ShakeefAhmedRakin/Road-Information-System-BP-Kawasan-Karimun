import PageLayout from "@/components/ui/page-layout";
import { hasMinimumRole } from "@/hooks/auth/useAuthServer";
import { USER_ROLES } from "api/src/modules/auth/auth.constants";
import UnauthorizedCard from "../../../../components/unauthorized-card";

export default async function ManageRoadsPage() {
  const allowedAccess = await hasMinimumRole(USER_ROLES.OPERATOR);

  if (!allowedAccess) {
    return <UnauthorizedCard />;
  }

  return (
    <PageLayout title="Manage Roads" description="Manage your roads" contained>
      2
    </PageLayout>
  );
}
