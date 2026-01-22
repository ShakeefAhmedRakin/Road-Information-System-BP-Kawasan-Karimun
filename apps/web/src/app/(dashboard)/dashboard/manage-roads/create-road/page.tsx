import UnauthorizedCard from "@/components/unauthorized-card";
import { hasMinimumRole } from "@/hooks/auth/useAuthServer";
import { USER_ROLES } from "api/src/modules/auth/auth.constants";
import CreateRoadPageContent from "../../_components/create-road-page-content";

export default async function CreateRoadPage() {
  const allowedAccess = await hasMinimumRole(USER_ROLES.OPERATOR);

  if (!allowedAccess) {
    return <UnauthorizedCard />;
  }

  return <CreateRoadPageContent />;
}
