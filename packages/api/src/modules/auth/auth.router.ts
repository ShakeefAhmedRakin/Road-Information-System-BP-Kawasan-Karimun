import z from "zod";
import { protectedProcedure } from "../../lib/orpc";
import { authService } from "./auth.service";

export const authRouter = {
  updateAvatar: protectedProcedure
    .input(z.object({ file: z.file().max(1024 * 1024 * 5) }))
    .handler(async ({ context, input }) => {
      const { session } = context;
      const { file } = input;
      await authService.updateAvatar(session.user.id, file);
      return { success: true };
    }),
};
export type AuthRouter = typeof authRouter;
