import { protectedProcedure } from "../lib/orpc";
import { adminRouter } from "./admin/admin.router";
import { authRouter } from "./auth/auth.router";
import { authService } from "./auth/auth.service";

export const appRouter = {
  admin: adminRouter,
  auth: authRouter,

  cleanupExpiredBans: protectedProcedure.handler(async () => {
    const unbannedCount = await authService.unbanExpiredUsers();
    return {
      success: true,
      unbannedUsers: unbannedCount,
    };
  }),
};
export type AppRouter = typeof appRouter;
