import { z } from "zod";
import { damageAssessmentSchema } from "./damage-assessment";
import {
  DRAINAGE_TYPES,
  LAND_USE_TYPES,
  PAVEMENT_TYPES,
  SEGMENT_GENERATION_MODES,
  SHOULDER_TYPES,
  SHOULDER_WIDTHS,
  TERRAIN_TYPES,
} from "./enums";

export const createRoadInputSchema = z
  .object({
    name: z.string().min(1, "Road name is required"),
    number: z.string().min(1, "Road number is required"),
    totalLengthKm: z.number().positive("Total length must be positive"),
    segmentIntervalM: z
      .number()
      .int()
      .positive("Segment interval must be a positive integer"),
    pavementWidthM: z.number().positive("Pavement width must be positive"),
    segmentGenerationMode: z
      .enum(SEGMENT_GENERATION_MODES)
      .describe(
        "Controls how the last segment is generated. 'exact' ends at actual road length, 'rounded' completes the interval."
      ),
    // Pavement Inventory (will be copied to all segments)
    pavementType: z.enum(PAVEMENT_TYPES),
    carriagewayWidthM: z
      .number()
      .positive("Carriageway width must be positive"),
    rightOfWayWidthM: z
      .number()
      .positive("Right-of-way width must be positive"),
    terrain: z.enum(TERRAIN_TYPES),
    notPassable: z.boolean(),
    // Left side attributes (will be copied to all segments)
    leftShoulderType: z.enum(SHOULDER_TYPES),
    leftShoulderWidthM: z.enum(SHOULDER_WIDTHS),
    leftDrainageType: z.enum(DRAINAGE_TYPES),
    leftLandUseType: z.enum(LAND_USE_TYPES),
    // Right side attributes (will be copied to all segments)
    rightShoulderType: z.enum(SHOULDER_TYPES),
    rightShoulderWidthM: z.enum(SHOULDER_WIDTHS),
    rightDrainageType: z.enum(DRAINAGE_TYPES),
    rightLandUseType: z.enum(LAND_USE_TYPES),
    // Required: Damage assessment data
    damageAssessment: damageAssessmentSchema,
    isVisibleByVisitors: z.boolean().default(false),
  })
  .describe("Input schema for creating a new road");

export type CreateRoadInput = z.infer<typeof createRoadInputSchema>;
