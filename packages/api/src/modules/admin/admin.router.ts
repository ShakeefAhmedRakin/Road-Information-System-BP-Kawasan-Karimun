import { z } from "zod";
import { adminProcedure } from "../../lib/orpc";
import { adminService } from "./admin.service";

export const adminRouter = {
  getUsers: adminProcedure
    .input(
      z.object({
        limit: z.number().optional(),
        offset: z.number().optional(),
        searchValue: z.string().optional(),
        roleFilter: z.string().optional(),
        bannedFilter: z.boolean().optional(),
        sortBy: z.enum(["name", "createdAt", "updatedAt"]).optional(),
        sortOrder: z.enum(["asc", "desc"]).optional(),
      })
    )
    .handler(async ({ input }) => {
      const data = await adminService.listUsers({
        limit: input.limit ?? 10,
        offset: input.offset ?? 0,
        searchValue: input.searchValue ?? "",
        roleFilter: input.roleFilter,
        bannedFilter: input.bannedFilter,
        sortBy: input.sortBy ?? "createdAt",
        sortOrder: input.sortOrder ?? "desc",
      });

      return { users: data.users, total: data.total };
    }),
};
export type AdminRouter = typeof adminRouter;
