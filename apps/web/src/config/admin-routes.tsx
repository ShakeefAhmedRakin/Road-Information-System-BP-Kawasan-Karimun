import { StaticRoutes } from "@/config/static-routes";
import { Users } from "lucide-react";

export const AdminRoutes = [
  {
    title: "Manage Users",
    path: StaticRoutes.MANAGE_USERS,
    icon: <Users />,
  },
];
