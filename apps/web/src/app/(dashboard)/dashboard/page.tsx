import { USER_ROLES } from "api/src/modules/auth/auth.constants";
import PageLayout from "../../../components/ui/page-layout";
import UnauthorizedCard from "../../../components/unauthorized-card";
import { hasMinimumRole, useAuthServer } from "../../../hooks/auth/useAuthServer";
import { RoadsTable } from "./_components/roads-table";

export default async function Home() {
  const allowedAccess = await hasMinimumRole(USER_ROLES.OPERATOR);
  const { user } = await useAuthServer();

  if (!allowedAccess || !user) {
    return <UnauthorizedCard />;
  }

  return (
    <PageLayout
      title="Roads"
      description='Road inventory with surface types and condition by length. Roads without reports show "Reports pending".'
    >
      <div className="space-y-4">
        <RoadsTable />
      </div>
    </PageLayout>
  );
}
