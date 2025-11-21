import type { PavementType } from "@repo/shared";
import { type InferInsertModel, type InferSelectModel, sql } from "drizzle-orm";
import {
  index,
  jsonb,
  pgTable,
  text,
  timestamp,
  uniqueIndex,
} from "drizzle-orm/pg-core";
import { user } from "../auth/auth.schema";
import { road } from "../road/road.schema";

export type SegmentCondition = "Good" | "Fair" | "Poor" | "Bad";

export type SegmentResultSummary = {
  segmentId: string;
  pavementType: PavementType;
  sectionArea: number;
  weightedDistress: number;
  tti: number;
  condition: SegmentCondition;
  distressAreas?: Record<string, number>;
  weightedComponents?: Record<string, number>;
};

export type PavementTypePercentages = Record<PavementType, number>;

export type ConditionLengthStats = Record<
  SegmentCondition,
  {
    lengthKm: number;
    percentage: number;
  }
>;

export const result = pgTable(
  "result",
  {
    id: text("id")
      .primaryKey()
      .default(sql`gen_random_uuid()`),
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    roadId: text("road_id")
      .notNull()
      .references(() => road.id, { onDelete: "cascade" }),
    segmentResults: jsonb("segment_results")
      .notNull()
      .$type<SegmentResultSummary[]>(),
    pavementTypePercentages: jsonb("pavement_type_percentages")
      .notNull()
      .$type<PavementTypePercentages>(),
    conditionLengthStats: jsonb("condition_length_stats")
      .notNull()
      .$type<ConditionLengthStats>(),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at")
      .notNull()
      .defaultNow()
      .$onUpdate(() => new Date()),
  },
  (table) => [
    index("result_user_id_idx").on(table.userId),
    uniqueIndex("result_road_id_unique").on(table.roadId),
  ]
);

export type CreateResultRecord = InferInsertModel<typeof result>;
export type ReadResultRecord = InferSelectModel<typeof result>;
