import { protectedProcedure } from "../lib/orpc";
import { adminRouter } from "./admin/admin.router";
import { authRouter } from "./auth/auth.router";
import { authService } from "./auth/auth.service";
import { resultRouter } from "./results/results.router";
import { roadRouter } from "./road/road.router";
import { segmentRouter } from "./segment/segment.router";

export const appRouter = {
  admin: adminRouter,
  auth: authRouter,
  road: roadRouter,
  result: resultRouter,
  segment: segmentRouter,

  cleanupExpiredBans: protectedProcedure.handler(async () => {
    const unbannedCount = await authService.unbanExpiredUsers();
    return {
      success: true,
      unbannedUsers: unbannedCount,
    };
  }),
};
export type AppRouter = typeof appRouter;
