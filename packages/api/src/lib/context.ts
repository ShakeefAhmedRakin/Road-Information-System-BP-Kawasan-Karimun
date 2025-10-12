import type { NextRequest } from "next/server";
import { auth } from "../modules/auth/auth.adapter";
import { authService } from "../modules/auth/auth.service";

export async function createContext(req: NextRequest) {
  // Clean up expired bans before getting session
  try {
    await authService.unbanExpiredUsers();
  } catch (error) {
    console.error("Error cleaning up expired bans in context:", error);
    // Don't block the request if cleanup fails
  }

  const session = await auth.api.getSession({
    headers: req.headers,
  });
  return {
    session,
  };
}

export type Context = Awaited<ReturnType<typeof createContext>>;
