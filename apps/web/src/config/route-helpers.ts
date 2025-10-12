import {
  ROLE_HIERARCHY,
  USER_ROLES,
  type UserRole,
} from "api/src/modules/auth/auth.constants";
import { AdminRoutes } from "./admin-routes";
import { DashboardRoutes } from "./dashboard-routes";
import { OperatorRoutes } from "./operator-routes";

export function getRoutesForRole(userRole: UserRole | null) {
  const routes = [...DashboardRoutes]; // Everyone gets dashboard routes

  if (!userRole) return routes;

  const roleLevel = ROLE_HIERARCHY[userRole];

  // Operators and Admins get operator routes
  if (roleLevel >= ROLE_HIERARCHY[USER_ROLES.OPERATOR]) {
    routes.push(...OperatorRoutes);
  }

  // Only Admins get admin routes
  if (roleLevel >= ROLE_HIERARCHY[USER_ROLES.ADMIN]) {
    routes.push(...AdminRoutes);
  }

  return routes;
}

// Helper to check if user can access a specific route
export function canAccessRoute(
  userRole: UserRole | null,
  routePath: string
): boolean {
  const allowedRoutes = getRoutesForRole(userRole);
  return allowedRoutes.some((route) => route.path === routePath);
}
