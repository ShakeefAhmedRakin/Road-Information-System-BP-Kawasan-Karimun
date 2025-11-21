import { createDrizzleEnums } from "@repo/shared";
import { type InferInsertModel, type InferSelectModel, sql } from "drizzle-orm";
import {
  boolean,
  index,
  integer,
  numeric,
  pgTable,
  text,
  timestamp,
} from "drizzle-orm/pg-core";
import { user } from "../auth/auth.schema";

const drizzleEnums = createDrizzleEnums();

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
    segmentIntervalM: integer("segment_interval_m").notNull(),
    pavementWidthM: numeric("pavement_width_m", { precision: 10, scale: 2 })
      .notNull()
      .$type<number>(),
    // Controls how the last segment is generated when road length doesn't align with interval
    // "exact" - last segment ends at actual road length (e.g., 800-840 for 840m)
    // "rounded" - last segment rounds up to complete interval (e.g., 800-900 for 840m)
    segmentGenerationMode: drizzleEnums
      .segmentGenerationModeEnum("segment_generation_mode")
      .notNull(),
    createdBy: text("created_by").references(() => user.id, {
      onDelete: "set null",
    }),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    isVisibleByVisitors: boolean("is_visible_by_visitors")
      .notNull()
      .default(false),
    updatedAt: timestamp("updated_at")
      .notNull()
      .defaultNow()
      .$onUpdate(() => new Date()),
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
