import { StaticRoutes } from "@/config/static-routes";
import { Users } from "lucide-react";

export const AdminRoutes = [
  {
    titleKey: "navigation.routes.manageUsers",
    path: StaticRoutes.MANAGE_USERS,
    icon: <Users />,
  },
];
