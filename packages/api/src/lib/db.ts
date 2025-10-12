import { Pool as NeonPool } from "@neondatabase/serverless";
import { drizzle as drizzleNeon } from "drizzle-orm/neon-serverless";
import { drizzle as drizzlePg } from "drizzle-orm/node-postgres";
import { Pool as PgPool } from "pg";

const isDevelopment = process.env.NODE_ENV !== "production";
const databaseUrl = process.env.DATABASE_URL || "";

export const db = isDevelopment
  ? drizzlePg(new PgPool({ connectionString: databaseUrl }))
  : drizzleNeon(new NeonPool({ connectionString: databaseUrl }));
