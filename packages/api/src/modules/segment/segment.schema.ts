import type { DamageAssessment } from "@repo/shared";
import { createDrizzleEnums } from "@repo/shared";
import { type InferInsertModel, type InferSelectModel, sql } from "drizzle-orm";
import {
  boolean,
  index,
  integer,
  jsonb,
  numeric,
  pgTable,
  text,
  timestamp,
} from "drizzle-orm/pg-core";
import { road } from "../road/road.schema";

const drizzleEnums = createDrizzleEnums();

// Segments table for storing stationing/chainage data
// Stationing stored as numeric values in meters from the start of the road
// Frontend will display in "km+m" format (e.g., 10100m displays as "10+100")
// Automatically generated based on road length with 100m intervals
// Can be manually edited for special cases (e.g., last segment 800-840 instead of 800-900)
export const segment = pgTable(
  "segment",
  {
    id: text("id")
      .primaryKey()
      .default(sql`gen_random_uuid()`),
    roadId: text("road_id")
      .notNull()
      .references(() => road.id, { onDelete: "cascade" }),
    segmentNumber: integer("segment_number").notNull(),
    // Stationing values in meters from the start (e.g., 0, 100, 10100)
    // Display format: "km+m" where km = floor(meters/1000), m = meters % 1000
    stationingFromM: numeric("stationing_from_m", { precision: 10, scale: 2 })
      .notNull()
      .$type<number>(),
    stationingToM: numeric("stationing_to_m", { precision: 10, scale: 2 })
      .notNull()
      .$type<number>(),
    // Pavement Inventory (copied from road creation)
    pavementType: drizzleEnums.pavementTypeEnum("pavement_type").notNull(),
    pavementWidthM: numeric("pavement_width_m", { precision: 10, scale: 2 })
      .notNull()
      .$type<number>(),
    carriagewayWidthM: numeric("carriageway_width_m", {
      precision: 10,
      scale: 2,
    }).$type<number>(),
    rightOfWayWidthM: numeric("right_of_way_width_m", {
      precision: 10,
      scale: 2,
    })
      .notNull()
      .$type<number>(),
    terrain: drizzleEnums.terrainTypeEnum("terrain").notNull(),
    notPassable: boolean("not_passable").notNull(),
    // Left side attributes
    leftShoulderType: drizzleEnums
      .shoulderTypeEnum("left_shoulder_type")
      .notNull(),
    leftShoulderWidthM: drizzleEnums
      .shoulderWidthEnum("left_shoulder_width_m")
      .notNull(),
    leftDrainageType: drizzleEnums
      .drainageTypeEnum("left_drainage_type")
      .notNull(),
    leftLandUseType: drizzleEnums
      .landUseTypeEnum("left_land_use_type")
      .notNull(),
    // Right side attributes
    rightShoulderType: drizzleEnums
      .shoulderTypeEnum("right_shoulder_type")
      .notNull(),
    rightShoulderWidthM: drizzleEnums
      .shoulderWidthEnum("right_shoulder_width_m")
      .notNull(),
    rightDrainageType: drizzleEnums
      .drainageTypeEnum("right_drainage_type")
      .notNull(),
    rightLandUseType: drizzleEnums
      .landUseTypeEnum("right_land_use_type")
      .notNull(),
    // Damage assessment data stored as JSONB based on pavement type
    damageAssessment: jsonb("damage_assessment").$type<DamageAssessment>(),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow(),
  },
  (table) => [
    index("road_segment_road_id_idx").on(table.roadId),
    index("road_segment_number_idx").on(table.segmentNumber),
  ]
);

export type CreateRoadSegmentType = InferInsertModel<typeof segment>;
export type ReadRoadSegmentType = InferSelectModel<typeof segment>;
