import { hasMinimumRole } from "@/hooks/auth/useAuthServer";
import { USER_ROLES } from "api/src/modules/auth/auth.constants";
import UnauthorizedCard from "../../../../components/unauthorized-card";
import ManageRoadsPageContent from "../_components/manage-roads-page-content";

export default async function ManageRoadsPage() {
  const allowedAccess = await hasMinimumRole(USER_ROLES.OPERATOR);

  if (!allowedAccess) {
    return <UnauthorizedCard />;
  }

  return <ManageRoadsPageContent />;
}
