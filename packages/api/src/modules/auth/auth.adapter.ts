import { betterAuth, type BetterAuthOptions } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { nextCookies } from "better-auth/next-js";
import { admin } from "better-auth/plugins";
import { db } from "../../lib/db";
import { USER_ROLES } from "./auth.constants";
import * as schema from "./auth.schema";

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: "pg",
    schema: schema,
  }),
  session: {
    cookieCache: {
      enabled: true,
      maxAge: 60 * 60 * 24, // 1 day
    },
  },
  trustedOrigins: [process.env.CORS_ORIGIN || ""],
  emailAndPassword: {
    minPasswordLength: 8,
    revokeSessionsOnPasswordReset: true,
    disableSignUp: true,
    enabled: true,
  },
  secret: process.env.BETTER_AUTH_SECRET,
  baseURL: process.env.BETTER_AUTH_URL,
  plugins: [
    admin({
      // Default role for users
      defaultRole: USER_ROLES.OPERATOR,
      // Roles for admins ( string to check against user.role)
      adminRoles: [USER_ROLES.ADMIN],
      // User IDs for admins ( string to check against user.id)
      adminUserIds: ["HmQ1D2my3k1cniZ0ltjGfan92Ntk4KrE"],
    }),
    // IMPORTANT: nextCookies() must be the last plugin
    // Automatically handles cookie setting for server actions
    nextCookies(),
  ],
} satisfies BetterAuthOptions);
