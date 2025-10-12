import { StaticRoutes } from "@/config/static-routes";
import { LayoutDashboardIcon, UserIcon } from "lucide-react";

export const DashboardRoutes = [
  {
    title: "Home",
    path: StaticRoutes.DASHBOARD,
    icon: <LayoutDashboardIcon />,
  },
  {
    title: "Account",
    path: StaticRoutes.ACCOUNTS,
    icon: <UserIcon />,
  },
];
