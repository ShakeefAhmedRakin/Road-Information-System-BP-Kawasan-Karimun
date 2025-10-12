import { ORPCError, os } from "@orpc/server";
import { USER_ROLES } from "../modules/auth/auth.constants";
import { authService } from "../modules/auth/auth.service";
import type { Context } from "./context";

export const o = os.$context<Context>();

export const publicProcedure = o;

const requireAuth = o.middleware(async ({ context, next }) => {
  if (!context.session?.user) {
    throw new ORPCError("UNAUTHORIZED");
  }
  return next({
    context: {
      session: context.session,
    },
  });
});

const cleanupExpiredBans = o.middleware(async ({ context, next }) => {
  // Clean up expired bans on every API call
  try {
    await authService.unbanExpiredUsers();
  } catch (error) {
    console.error("Error cleaning up expired bans:", error);
    // Don't block the request if cleanup fails
  }

  return next();
});

export const protectedProcedure = publicProcedure
  .use(requireAuth)
  .use(cleanupExpiredBans);

// Role-based middlewares
const requireAdmin = o.middleware(async ({ context, next }) => {
  if (!context.session?.user) {
    throw new ORPCError("UNAUTHORIZED");
  }

  const hasAccess = await authService.hasMinimumRole(
    context.session.user.id,
    USER_ROLES.ADMIN
  );

  if (!hasAccess) {
    throw new ORPCError("FORBIDDEN");
  }

  return next({
    context: {
      session: context.session,
    },
  });
});

const requireOperator = o.middleware(async ({ context, next }) => {
  if (!context.session?.user) {
    throw new ORPCError("UNAUTHORIZED");
  }

  const hasAccess = await authService.hasMinimumRole(
    context.session.user.id,
    USER_ROLES.OPERATOR
  );

  if (!hasAccess) {
    throw new ORPCError("FORBIDDEN");
  }

  return next({
    context: {
      session: context.session,
    },
  });
});

const requireVisitor = o.middleware(async ({ context, next }) => {
  if (!context.session?.user) {
    throw new ORPCError("UNAUTHORIZED");
  }

  const hasAccess = await authService.hasMinimumRole(
    context.session.user.id,
    USER_ROLES.VISITOR
  );

  if (!hasAccess) {
    throw new ORPCError("FORBIDDEN");
  }

  return next({
    context: {
      session: context.session,
    },
  });
});

// Role-based procedures
export const adminProcedure = protectedProcedure.use(requireAdmin);
export const operatorProcedure = protectedProcedure.use(requireOperator);
export const visitorProcedure = protectedProcedure.use(requireVisitor);
