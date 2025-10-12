import { StaticRoutes } from "@/config/static-routes";
import { Shield, Users } from "lucide-react";

export const AdminRoutes = [
  {
    title: "Manage Users",
    path: StaticRoutes.MANAGE_USERS,
    icon: <Users />,
  },
  {
    title: "Manage Permissions",
    path: StaticRoutes.MANAGE_PERMISSIONS,
    icon: <Shield />,
  },
];
