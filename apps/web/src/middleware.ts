import {
  ROLE_HIERARCHY,
  USER_ROLES,
  type UserRole,
} from "api/src/modules/auth/auth.constants";
import { getCookieCache } from "better-auth/cookies";
import { NextResponse, type NextRequest } from "next/server";
import { StaticRoutes } from "./config/static-routes";

// Routes only accessible when NOT logged in
const authRoutes = [StaticRoutes.SIGN_IN];

// Routes only accessible when logged in
const protectedRoutes = [
  StaticRoutes.DASHBOARD,
  StaticRoutes.ACCOUNTS,
  StaticRoutes.MANAGE_USERS,
  StaticRoutes.MANAGE_PERMISSIONS,
  StaticRoutes.MANAGE_PROJECTS,
];

// Route permissions mapping (minimum role required)
const routePermissions: Record<string, UserRole> = {
  [StaticRoutes.MANAGE_USERS]: USER_ROLES.ADMIN,
  [StaticRoutes.MANAGE_PERMISSIONS]: USER_ROLES.ADMIN,
  [StaticRoutes.MANAGE_PROJECTS]: USER_ROLES.OPERATOR,
};

// Helper to check if user has minimum role required
function hasMinimumRole(userRole: UserRole, requiredRole: UserRole): boolean {
  const userLevel = ROLE_HIERARCHY[userRole];
  const requiredLevel = ROLE_HIERARCHY[requiredRole];
  return userLevel >= requiredLevel;
}

export default async function middleware(request: NextRequest) {
  const pathName = request.nextUrl.pathname;

  const isAuthRoute = authRoutes.includes(pathName);
  const isProtectedRoute = protectedRoutes.includes(pathName);

  // If not a route we care about, allow access
  if (!isAuthRoute && !isProtectedRoute) {
    return NextResponse.next();
  }

  // Get session from cookie cache (includes user role)
  const session = await getCookieCache(request);

  // Not logged in (no session)
  if (!session) {
    if (isAuthRoute) {
      return NextResponse.next(); // Allow access to login page
    }

    if (isProtectedRoute) {
      return NextResponse.redirect(new URL(StaticRoutes.SIGN_IN, request.url));
    }

    return NextResponse.next();
  }

  // Has session - redirect away from auth pages
  if (isAuthRoute) {
    return NextResponse.redirect(new URL(StaticRoutes.DASHBOARD, request.url));
  }

  // Check role-based permissions for protected routes
  if (isProtectedRoute) {
    const requiredRole = routePermissions[pathName];

    if (requiredRole) {
      const userRole = session.user?.role as UserRole;

      if (!userRole || !hasMinimumRole(userRole, requiredRole)) {
        // User doesn't have sufficient permissions - redirect to dashboard
        return NextResponse.redirect(
          new URL(StaticRoutes.DASHBOARD, request.url)
        );
      }
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)",
  ],
};
