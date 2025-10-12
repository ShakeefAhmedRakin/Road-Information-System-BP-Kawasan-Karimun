import type { User } from "better-auth";
import DashboardDesktopNavigation from "./dashboard-desktop-navigation";

import { AppLogo } from "@/components/branding/app-logo";
import type { UserRole } from "api/src/modules/auth/auth.constants";
import { ThemeToggleButton } from "../../../components/theme-toggle";
import { DashboardMobileNavigation } from "./dashboard-mobile-navigation";

export default function DashboardNavigation({
  user,
  userRole,
}: {
  user: User | null;
  userRole: UserRole | null;
}) {
  return (
    <nav>
      <div className="bg-background/50 flex items-center justify-between border-b p-3 backdrop-blur-lg xl:hidden">
        <AppLogo />

        <span>
          <DashboardMobileNavigation user={user} userRole={userRole} />
          <ThemeToggleButton />
        </span>
      </div>

      <div className="hidden h-full xl:block">
        <DashboardDesktopNavigation user={user} userRole={userRole} />
      </div>
    </nav>
  );
}
