import { StaticRoutes } from "@/config/static-routes";
import { LayoutDashboardIcon, UserIcon } from "lucide-react";

export const DashboardRoutes = [
  {
    titleKey: "navigation.routes.home",
    path: StaticRoutes.DASHBOARD,
    icon: <LayoutDashboardIcon />,
  },
  {
    titleKey: "navigation.routes.account",
    path: StaticRoutes.ACCOUNTS,
    icon: <UserIcon />,
  },
];
