import { type InferInsertModel, type InferSelectModel, sql } from "drizzle-orm";
import {
  index,
  integer,
  numeric,
  pgEnum,
  pgTable,
  text,
  timestamp,
} from "drizzle-orm/pg-core";
import { user } from "../auth/auth.schema";

// Enum to control how the last segment is generated
export const segmentGenerationModeEnum = pgEnum("segment_generation_mode", [
  "exact", // Last segment matches exact road length (e.g., 800-840 for 840m road)
  "rounded", // Last segment rounds up to complete interval (e.g., 800-900 for 840m road)
]);

export const road = pgTable(
  "road",
  {
    id: text("id")
      .primaryKey()
      .default(sql`gen_random_uuid()`),
    name: text("name").notNull(),
    number: text("number").notNull().unique(),
    totalLengthKm: numeric("total_length_km", { precision: 10, scale: 2 })
      .notNull()
      .$type<number>(),
    // Fixed to 100m as per requirements - this is informational
    segmentIntervalM: integer("segment_interval_m").notNull().default(100),
    pavementWidthM: numeric("pavement_width_m", { precision: 10, scale: 2 })
      .notNull()
      .$type<number>(),
    // Controls how the last segment is generated when road length doesn't align with interval
    // "exact" - last segment ends at actual road length (e.g., 800-840 for 840m)
    // "rounded" - last segment rounds up to complete interval (e.g., 800-900 for 840m)
    segmentGenerationMode: segmentGenerationModeEnum("segment_generation_mode")
      .notNull()
      .default("rounded"),
    createdBy: text("created_by").references(() => user.id, {
      onDelete: "set null",
    }),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow(),
  },
  (table) => [
    index("road_name_idx").on(table.name),
    index("road_number_idx").on(table.number),
    index("road_created_by_idx").on(table.createdBy),
    index("road_created_at_idx").on(table.createdAt),
  ]
);

export type CreateRoadType = InferInsertModel<typeof road>;
export type ReadRoadType = InferSelectModel<typeof road>;
