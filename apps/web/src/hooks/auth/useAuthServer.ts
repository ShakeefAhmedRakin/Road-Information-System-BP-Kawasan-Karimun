// Server-side auth utilities - use in Server Components and API routes

import { StaticRoutes } from "@/config/static-routes";
import {
  ROLE_HIERARCHY,
  USER_ROLES,
  type UserRole,
} from "api/src/modules/auth/auth.constants";
import type { User } from "better-auth";
import { getCookieCache } from "better-auth/cookies";
import { cookies } from "next/headers";
import { cache } from "react";

// Cache the session for the request lifecycle to avoid multiple fetches
// Use getCookieCache for instant cookie-based session lookup (no DB call)
const getCachedSession = cache(async () => {
  try {
    // Create a request-like object for getCookieCache
    const cookieStore = await cookies();
    const cookieString = cookieStore
      .getAll()
      .map((c) => `${c.name}=${c.value}`)
      .join("; ");

    // Read directly from cookie cache (instant, no DB call)
    const session = await getCookieCache({
      headers: {
        get: (name: string) => {
          if (name === "cookie") return cookieString;
          return null;
        },
      },
    } as any);

    return session;
  } catch (error) {
    console.error("Error getting server session:", error);
    return null;
  }
});

// Server-side session utilities
export async function getServerSession() {
  return getCachedSession();
}

export async function getServerUser(): Promise<User | null> {
  const session = await getServerSession();
  return session?.user || null;
}

// Get user role directly from cached session (no DB call)
export async function getUserRole(): Promise<UserRole | null> {
  const session = await getServerSession();
  return (session?.user?.role as UserRole) || null;
}

// Server-side role checking utilities (using cached session)
export async function hasRole(role: UserRole): Promise<boolean> {
  const userRole = await getUserRole();
  return userRole === role;
}

export async function hasMinimumRole(minRole: UserRole): Promise<boolean> {
  const userRole = await getUserRole();
  if (!userRole) return false;

  const userRoleLevel = ROLE_HIERARCHY[userRole];
  const minRoleLevel = ROLE_HIERARCHY[minRole];
  return userRoleLevel >= minRoleLevel;
}

export async function isAdmin(): Promise<boolean> {
  return hasRole(USER_ROLES.ADMIN);
}

export async function isOperator(): Promise<boolean> {
  return hasRole(USER_ROLES.OPERATOR);
}

export async function isVisitor(): Promise<boolean> {
  return hasRole(USER_ROLES.VISITOR);
}

// Main server-side auth hook (cached, no DB calls)
export async function useAuthServer() {
  const session = await getServerSession();
  const user = session?.user || null;
  const userRole = (user?.role as UserRole) || null;

  return {
    session: session?.session,
    user,
    userRole,
    isAuthenticated: !!user,
    isAdmin: userRole === USER_ROLES.ADMIN,
    isOperator: userRole === USER_ROLES.OPERATOR,
    isVisitor: userRole === USER_ROLES.VISITOR,
  };
}

// Higher-order functions for role-based protection
export function withRoleCheck(requiredRole: UserRole, redirectTo?: string) {
  return async function roleProtectedHandler() {
    const hasRequiredRole = await hasMinimumRole(requiredRole);

    if (!hasRequiredRole) {
      throw new Error(`Access denied. Required role: ${requiredRole}`);
    }
  };
}

export function withAdminCheck(redirectTo?: string) {
  return withRoleCheck(USER_ROLES.ADMIN, redirectTo || StaticRoutes.SIGN_IN);
}

export function withOperatorCheck(redirectTo?: string) {
  return withRoleCheck(USER_ROLES.OPERATOR, redirectTo || StaticRoutes.SIGN_IN);
}

export function withVisitorCheck(redirectTo?: string) {
  return withRoleCheck(USER_ROLES.VISITOR, redirectTo || StaticRoutes.SIGN_IN);
}
