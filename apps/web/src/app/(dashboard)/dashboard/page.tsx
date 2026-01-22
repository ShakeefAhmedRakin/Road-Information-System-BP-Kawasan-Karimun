import { USER_ROLES } from "api/src/modules/auth/auth.constants";
import UnauthorizedCard from "../../../components/unauthorized-card";
import { hasMinimumRole, useAuthServer } from "../../../hooks/auth/useAuthServer";
import HomePageContent from "./_components/home-page-content";

export default async function Home() {
  const { user } = await useAuthServer();

  if (!user) {
    return <UnauthorizedCard />;
  }

  const isOperatorOrAbove = await hasMinimumRole(USER_ROLES.OPERATOR);

  return <HomePageContent isOperatorOrAbove={isOperatorOrAbove} />;
}
