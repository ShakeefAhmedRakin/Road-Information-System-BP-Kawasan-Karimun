"use client";

import { authClient } from "@/lib/auth-client";
import {
  ROLE_HIERARCHY,
  USER_ROLES,
  type UserRole,
} from "api/src/modules/auth/auth.constants";

// Client-side auth hook - use in Client Components
export function useAuth() {
  const { data: session, isPending, error } = authClient.useSession();
  const user = session?.user;

  return {
    user,
    isPending,
    error,
    isAuthenticated: !!user,

    // Role checking (based on user.role from session)
    hasRole: (role: UserRole) => user?.role === role,
    isAdmin: user?.role === USER_ROLES.ADMIN,
    isOperator: user?.role === USER_ROLES.OPERATOR,
    isVisitor: user?.role === USER_ROLES.VISITOR,

    // Role hierarchy checks
    isOperatorOrHigher:
      user?.role === USER_ROLES.OPERATOR || user?.role === USER_ROLES.ADMIN,
    isVisitorOrHigher: !!user?.role, // Any authenticated user

    // Permission helpers
    canAccessAdmin: user?.role === USER_ROLES.ADMIN,
    canAccessDashboard:
      user?.role === USER_ROLES.OPERATOR || user?.role === USER_ROLES.ADMIN,
    canAccessPublic: !!user?.role, // Any authenticated user
  };
}

// Individual role hooks for convenience
export function useIsAdmin() {
  const { isAdmin, isPending } = useAuth();
  return { isAdmin, isPending };
}

export function useIsOperator() {
  const { isOperator, isPending } = useAuth();
  return { isOperator, isPending };
}

export function useIsVisitor() {
  const { isVisitor, isPending } = useAuth();
  return { isVisitor, isPending };
}

export function useHasRole(role: UserRole) {
  const { hasRole, isPending } = useAuth();
  return { hasRole: hasRole(role), isPending };
}

export function useHasMinimumRole(minRole: UserRole) {
  const auth = useAuth();

  const hasMinimumRole = () => {
    if (!auth.user?.role) return false;

    const userRoleLevel = ROLE_HIERARCHY[auth.user.role as UserRole];
    const minRoleLevel = ROLE_HIERARCHY[minRole];

    return userRoleLevel >= minRoleLevel;
  };

  return { hasMinimumRole: hasMinimumRole(), isPending: auth.isPending };
}
