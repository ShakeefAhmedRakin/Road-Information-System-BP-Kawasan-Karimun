import { USER_ROLES } from "api/src/modules/auth/auth.constants";
import PageLayout from "../../../components/ui/page-layout";
import UnauthorizedCard from "../../../components/unauthorized-card";
import { hasMinimumRole, useAuthServer } from "../../../hooks/auth/useAuthServer";
import { RoadsTable } from "./_components/roads-table";

export default async function Home() {
  const { user } = await useAuthServer();

  if (!user) {
    return <UnauthorizedCard />;
  }

  const isOperatorOrAbove = await hasMinimumRole(USER_ROLES.OPERATOR);

  return (
    <PageLayout
      title="Home"
      description="Overview of roads and reports"
    >
      {isOperatorOrAbove ? (
        <div className="space-y-4">
          <RoadsTable />
        </div>
      ) : (
        <h1>Pending</h1>
      )}
    </PageLayout>
  );
}
