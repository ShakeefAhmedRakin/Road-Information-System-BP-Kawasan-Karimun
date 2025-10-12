import { auth } from "api";
import { authService } from "api/src/modules/auth/auth.service";
import { toNextJsHandler } from "better-auth/next-js";
import { NextRequest } from "next/server";

// Custom handler that cleans up expired bans before processing auth requests
async function handleAuthRequest(req: NextRequest, handler: any) {
  // Clean up expired bans before processing auth requests
  try {
    await authService.unbanExpiredUsers();
  } catch (error) {
    console.error("Error cleaning up expired bans in auth handler:", error);
    // Don't block the request if cleanup fails
  }

  // Call the original handler
  return handler(req);
}

const originalHandler = toNextJsHandler(auth.handler);

export async function GET(req: NextRequest) {
  return handleAuthRequest(req, originalHandler.GET);
}

export async function POST(req: NextRequest) {
  return handleAuthRequest(req, originalHandler.POST);
}
