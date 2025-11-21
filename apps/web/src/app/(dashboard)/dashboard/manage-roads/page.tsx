import PageLayout from "@/components/ui/page-layout";
import { hasMinimumRole } from "@/hooks/auth/useAuthServer";
import { USER_ROLES } from "api/src/modules/auth/auth.constants";
import UnauthorizedCard from "../../../../components/unauthorized-card";
import AllRoads from "./_components/manage-road/all-roads";

export default async function ManageRoadsPage() {
  const allowedAccess = await hasMinimumRole(USER_ROLES.OPERATOR);

  if (!allowedAccess) {
    return <UnauthorizedCard />;
  }

  return (
    <PageLayout title="Manage Roads" description="Manage your roads" contained>
      <div className="h-full max-h-full overflow-y-auto">
        <AllRoads />
      </div>
    </PageLayout>
  );
}
