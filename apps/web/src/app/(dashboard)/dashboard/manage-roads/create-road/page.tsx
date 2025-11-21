import PageLayout from "@/components/ui/page-layout";
import UnauthorizedCard from "@/components/unauthorized-card";
import { hasMinimumRole } from "@/hooks/auth/useAuthServer";
import { USER_ROLES } from "api/src/modules/auth/auth.constants";
import RoadForm from "../_components/forms/road-form";

export default async function CreateRoadPage() {
  const allowedAccess = await hasMinimumRole(USER_ROLES.OPERATOR);

  if (!allowedAccess) {
    return <UnauthorizedCard />;
  }

  return (
    <PageLayout title="Create Road" description="Create a new road">
      <RoadForm />
    </PageLayout>
  );
}
