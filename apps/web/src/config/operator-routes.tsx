import { StaticRoutes } from "@/config/static-routes";
import { AudioWaveform } from "lucide-react";

export const OperatorRoutes = [
  {
    title: "Manage Projects",
    path: StaticRoutes.MANAGE_PROJECTS,
    icon: <AudioWaveform />,
  },
];
