import { and, asc, count, desc, eq, ilike, or } from "drizzle-orm";
import { db } from "../../lib/db";
import { USER_ROLES } from "../auth/auth.constants";
import { user as userTable } from "../auth/auth.schema";

export interface ListUsersInput {
  limit?: number;
  offset?: number;
  searchValue?: string;
  roleFilter?: string;
  bannedFilter?: boolean;
  sortBy?: "name" | "createdAt" | "updatedAt";
  sortOrder?: "asc" | "desc";
}

class AdminService {
  async listUsers(input: ListUsersInput) {
    const {
      limit = 10,
      offset = 0,
      searchValue = "",
      roleFilter,
      bannedFilter,
      sortBy = "createdAt",
      sortOrder = "desc",
    } = input;

    // Build where conditions
    const conditions = [];

    // Add search condition (search by name or email)
    if (searchValue && searchValue.trim()) {
      conditions.push(
        or(
          ilike(userTable.name, `%${searchValue}%`),
          ilike(userTable.email, `%${searchValue}%`)
        )
      );
    }

    // Add role filter
    if (roleFilter && roleFilter.trim() !== "") {
      // Validate that the role value is one of the allowed values
      const validRoles = [
        USER_ROLES.OPERATOR,
        USER_ROLES.ADMIN,
        USER_ROLES.VISITOR,
      ];
      if (validRoles.includes(roleFilter as any)) {
        conditions.push(
          eq(
            userTable.role,
            roleFilter as (typeof USER_ROLES)[keyof typeof USER_ROLES]
          )
        );
      }
    }

    // Add banned filter
    if (bannedFilter !== undefined) {
      conditions.push(eq(userTable.banned, bannedFilter));
    }

    // Combine all conditions
    const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

    // Get total count
    const [{ total }] = await db
      .select({ total: count() })
      .from(userTable)
      .where(whereClause);

    // Determine sort column and direction
    const sortColumn =
      sortBy === "name"
        ? userTable.name
        : sortBy === "updatedAt"
          ? userTable.updatedAt
          : userTable.createdAt;

    const orderFn = sortOrder === "asc" ? asc : desc;

    // Get paginated users
    const users = await db
      .select({
        id: userTable.id,
        name: userTable.name,
        email: userTable.email,
        emailVerified: userTable.emailVerified,
        image: userTable.image,
        role: userTable.role,
        banned: userTable.banned,
        banReason: userTable.banReason,
        banExpires: userTable.banExpires,
        createdAt: userTable.createdAt,
        updatedAt: userTable.updatedAt,
      })
      .from(userTable)
      .where(whereClause)
      .limit(limit)
      .offset(offset)
      .orderBy(orderFn(sortColumn));

    return {
      users,
      total: Number(total),
    };
  }
}

export const adminService = new AdminService();
