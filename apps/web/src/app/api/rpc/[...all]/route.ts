import { createContext } from "api";
import { appRouter } from "api";
import { RPCHandler } from "@orpc/server/fetch";
import { NextRequest } from "next/server";

const handler = new RPCHandler(appRouter);

async function handleRequest(req: NextRequest) {
  const { response } = await handler.handle(req, {
    prefix: "/api/rpc",
    context: await createContext(req),
  });

  return response ?? new Response("Not found", { status: 404 });
}

export const GET = handleRequest;
export const POST = handleRequest;
export const PUT = handleRequest;
export const PATCH = handleRequest;
export const DELETE = handleRequest;
