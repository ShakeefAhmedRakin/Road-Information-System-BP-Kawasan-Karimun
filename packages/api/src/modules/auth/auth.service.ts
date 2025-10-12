import { and, eq, inArray, isNotNull, lt } from "drizzle-orm";
import { headers } from "next/headers";
import { db } from "../../lib/db";
import { auth } from "./auth.adapter";
import { ROLE_HIERARCHY, USER_ROLES, type UserRole } from "./auth.constants";
import { user as userTable } from "./auth.schema";

class AuthService {
  async getUserRole(userId: string): Promise<UserRole> {
    const [user] = await db
      .select()
      .from(userTable)
      .where(eq(userTable.id, userId));

    if (!user) {
      throw new Error("User not found");
    }

    return user.role;
  }

  async isUserAdmin(userId: string): Promise<boolean> {
    const user = await this.getUserRole(userId);
    return user === USER_ROLES.ADMIN;
  }

  async isUserOperator(userId: string): Promise<boolean> {
    const user = await this.getUserRole(userId);
    return user === USER_ROLES.OPERATOR;
  }

  async isUserVisitor(userId: string): Promise<boolean> {
    const user = await this.getUserRole(userId);
    return user === USER_ROLES.VISITOR;
  }

  async hasMinimumRole(userId: string, minRole: UserRole): Promise<boolean> {
    const userRole = await this.getUserRole(userId);
    const userRoleLevel = ROLE_HIERARCHY[userRole];
    const minRoleLevel = ROLE_HIERARCHY[minRole];
    return userRoleLevel >= minRoleLevel;
  }

  /**
   * Check if a user is currently banned (considering ban expiration)
   */
  async isUserBanned(userId: string): Promise<boolean> {
    const [result] = await db
      .select({
        banned: userTable.banned,
        banExpires: userTable.banExpires,
      })
      .from(userTable)
      .where(eq(userTable.id, userId));

    if (!result) {
      return false; // User not found, consider as not banned
    }

    // If user is not banned, return false
    if (!result.banned) {
      return false;
    }

    // If banned but no expiration date, user is permanently banned
    if (!result.banExpires) {
      return true;
    }

    // If ban has expired, automatically unban the user
    const now = new Date();
    if (result.banExpires < now) {
      await auth.api.unbanUser({ body: { userId } });
      return false;
    }

    // Ban is still active
    return true;
  }

  /**
   * Automatically unban users whose ban has expired
   */
  async unbanExpiredUsers(): Promise<number> {
    const now = new Date();

    console.log(now);
    console.log("unbanExpiredUsers");
    // First, get all users with expired bans
    const expiredUsers = await db
      .select({ id: userTable.id })
      .from(userTable)
      .where(
        and(
          eq(userTable.banned, true),
          // banExpires is not null and is less than current time
          and(isNotNull(userTable.banExpires), lt(userTable.banExpires, now))
        )
      );

    const result = await db
      .update(userTable)
      .set({
        banned: false,
        banReason: null,
        banExpires: null,
        updatedAt: now,
      })
      .where(
        inArray(
          userTable.id,
          expiredUsers.map((user) => user.id)
        )
      );

    return result.rowCount || 0;
  }

  async updateAvatar(userId: string, file: File): Promise<void> {
    // Step 0: Fetch user
    const [user] = await db
      .select()
      .from(userTable)
      .where(eq(userTable.id, userId));

    if (!user) throw new Error("User not found");

    const apiKey = process.env.IMG_HIPPO_API_KEY!;
    if (!apiKey) throw new Error("IMG_HIPPO_API_KEY is not set");

    // Step 2: Upload new avatar
    const formData = new FormData();
    formData.append("api_key", apiKey);
    formData.append("file", file);
    formData.append("title", `${user.name}-avatar`);

    const uploadResponse = await fetch("https://api.imghippo.com/v1/upload", {
      method: "POST",
      body: formData,
    }).then((res) => res.json());

    if (!uploadResponse?.data?.url) {
      console.error("Upload response:", uploadResponse);
      throw new Error("Failed to upload new avatar");
    }

    const newImageUrl = uploadResponse.data.url;

    // Step 3: Update user record
    await auth.api.updateUser({
      headers: await headers(),
      body: { image: newImageUrl },
    });

    console.log(`Avatar updated for user ${userId}: ${newImageUrl}`);
  }
}

export const authService = new AuthService();
