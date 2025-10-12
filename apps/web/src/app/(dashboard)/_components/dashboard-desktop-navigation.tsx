import SignOutButton from "@/app/(dashboard)/_components/sign-out-button";
import { AppLogo } from "@/components/branding/app-logo";
import { Separator } from "@/components/ui/separator";
import { type UserRole } from "api/src/modules/auth/auth.constants";
import type { User } from "better-auth";
import { ThemeToggleButton } from "../../../components/theme-toggle";
import { Card, CardContent, CardFooter } from "../../../components/ui/card";
import { getRoutesForRole } from "../../../config/route-helpers";
import DashboardNavigationItem from "./dashboard-navigation-item";
import DashboardUserCard from "./dashboard-user-card";

const SIDEBAR_WIDTH = "17rem";

export default function DashboardDesktopNavigation({
  user,
  userRole,
}: {
  user: User | null;
  userRole: UserRole | null;
}) {
  return (
    <div
      style={{ width: SIDEBAR_WIDTH }}
      className="flex h-full flex-col gap-y-3"
    >
      <div className="flex items-center justify-between gap-2 pt-3 pl-3">
        <AppLogo />
        <ThemeToggleButton />
      </div>

      <Separator />

      <ul className="flex w-full flex-col gap-2">
        {getRoutesForRole(userRole).map((route) => (
          <DashboardNavigationItem key={route.title} {...route} />
        ))}
      </ul>

      {/* BOTTOM  */}
      <div className="flex w-full flex-1 items-end">
        {user && (
          <Card className="w-full !p-4">
            <CardContent className="!px-0 !py-0">
              <DashboardUserCard user={user} />
            </CardContent>
            <CardFooter className="!px-0 !py-0">
              <SignOutButton />
            </CardFooter>
          </Card>
        )}
      </div>
    </div>
  );
}
