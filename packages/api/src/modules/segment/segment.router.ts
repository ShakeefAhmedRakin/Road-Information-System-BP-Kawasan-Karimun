import type { DamageAssessment } from "@repo/shared";
import {
  damageAssessmentSchema,
  DRAINAGE_TYPES,
  LAND_USE_TYPES,
  PAVEMENT_TYPES,
  SEGMENT_GENERATION_MODES,
  SHOULDER_TYPES,
  SHOULDER_WIDTHS,
  TERRAIN_TYPES,
} from "@repo/shared";
import { z } from "zod";
import { operatorProcedure } from "../../lib/orpc";
import { segmentService } from "./segment.service";

export const segmentRouter = {
  getSegmentsByRoadId: operatorProcedure
    .input(
      z.object({
        roadId: z.string().min(1, "Road ID is required"),
      })
    )
    .handler(async ({ input }) => {
      const segments = await segmentService.getSegmentsByRoadId(input.roadId);
      return { segments };
    }),

  regenerateSegments: operatorProcedure
    .input(
      z.object({
        roadId: z.string().min(1, "Road ID is required"),
        totalLengthKm: z.number().positive("Total length must be positive"),
        segmentIntervalM: z
          .number()
          .int()
          .positive("Segment interval must be a positive integer"),
        segmentGenerationMode: z.enum(SEGMENT_GENERATION_MODES),
        // Pavement Inventory
        pavementType: z.enum(PAVEMENT_TYPES),
        pavementWidthM: z.number().positive("Pavement width must be positive"),
        carriagewayWidthM: z
          .number()
          .positive("Carriageway width must be positive"),
        rightOfWayWidthM: z
          .number()
          .positive("Right-of-way width must be positive"),
        terrain: z.enum(TERRAIN_TYPES),
        notPassable: z.boolean(),
        // Left side attributes
        leftShoulderType: z.enum(SHOULDER_TYPES),
        leftShoulderWidthM: z.enum(SHOULDER_WIDTHS),
        leftDrainageType: z.enum(DRAINAGE_TYPES),
        leftLandUseType: z.enum(LAND_USE_TYPES),
        // Right side attributes
        rightShoulderType: z.enum(SHOULDER_TYPES),
        rightShoulderWidthM: z.enum(SHOULDER_WIDTHS),
        rightDrainageType: z.enum(DRAINAGE_TYPES),
        rightLandUseType: z.enum(LAND_USE_TYPES),
        // Required: Damage assessment data
        customDamageAssessment: damageAssessmentSchema,
      })
    )
    .handler(async ({ input }) => {
      const payload = {
        roadId: input.roadId,
        totalLengthKm: input.totalLengthKm,
        segmentIntervalM: input.segmentIntervalM,
        segmentGenerationMode: input.segmentGenerationMode,
        // Pavement inventory
        pavementType: input.pavementType,
        pavementWidthM: input.pavementWidthM,
        carriagewayWidthM: input.carriagewayWidthM,
        rightOfWayWidthM: input.rightOfWayWidthM,
        terrain: input.terrain,
        notPassable: input.notPassable,
        // Left side attributes
        leftShoulderType: input.leftShoulderType,
        leftShoulderWidthM: input.leftShoulderWidthM,
        leftDrainageType: input.leftDrainageType,
        leftLandUseType: input.leftLandUseType,
        // Right side attributes
        rightShoulderType: input.rightShoulderType,
        rightShoulderWidthM: input.rightShoulderWidthM,
        rightDrainageType: input.rightDrainageType,
        rightLandUseType: input.rightLandUseType,
        customDamageAssessment:
          input.customDamageAssessment as DamageAssessment,
      };

      const segmentIds = await segmentService.regenerateSegments(
        input.roadId,
        payload
      );

      return {
        success: true,
        message: `Successfully regenerated ${segmentIds.length} segments`,
        segmentCount: segmentIds.length,
      };
    }),

  updateSegment: operatorProcedure
    .input(
      z.object({
        segmentId: z.string().min(1, "Segment ID is required"),
        // Pavement Inventory
        pavementType: z.enum(PAVEMENT_TYPES).optional(),
        pavementWidthM: z.number().positive().optional(),
        carriagewayWidthM: z.number().positive().optional(),
        rightOfWayWidthM: z.number().positive().optional(),
        terrain: z.enum(TERRAIN_TYPES).optional(),
        notPassable: z.boolean().optional(),
        // Left side attributes
        leftShoulderType: z.enum(SHOULDER_TYPES).optional(),
        leftShoulderWidthM: z.enum(SHOULDER_WIDTHS).optional(),
        leftDrainageType: z.enum(DRAINAGE_TYPES).optional(),
        leftLandUseType: z.enum(LAND_USE_TYPES).optional(),
        // Right side attributes
        rightShoulderType: z.enum(SHOULDER_TYPES).optional(),
        rightShoulderWidthM: z.enum(SHOULDER_WIDTHS).optional(),
        rightDrainageType: z.enum(DRAINAGE_TYPES).optional(),
        rightLandUseType: z.enum(LAND_USE_TYPES).optional(),
        // Damage assessment data
        damageAssessment: damageAssessmentSchema.optional(),
      })
    )
    .handler(async ({ input }) => {
      const { segmentId, damageAssessment, ...rest } = input;
      const updateData: Record<string, unknown> = {};

      if (rest.pavementType !== undefined)
        updateData.pavementType = rest.pavementType;
      if (rest.pavementWidthM !== undefined)
        updateData.pavementWidthM = rest.pavementWidthM;
      if (rest.carriagewayWidthM !== undefined)
        updateData.carriagewayWidthM = rest.carriagewayWidthM;
      if (rest.rightOfWayWidthM !== undefined)
        updateData.rightOfWayWidthM = rest.rightOfWayWidthM;
      if (rest.terrain !== undefined) updateData.terrain = rest.terrain;
      if (rest.notPassable !== undefined)
        updateData.notPassable = rest.notPassable;
      if (rest.leftShoulderType !== undefined)
        updateData.leftShoulderType = rest.leftShoulderType;
      if (rest.leftShoulderWidthM !== undefined)
        updateData.leftShoulderWidthM = rest.leftShoulderWidthM;
      if (rest.leftDrainageType !== undefined)
        updateData.leftDrainageType = rest.leftDrainageType;
      if (rest.leftLandUseType !== undefined)
        updateData.leftLandUseType = rest.leftLandUseType;
      if (rest.rightShoulderType !== undefined)
        updateData.rightShoulderType = rest.rightShoulderType;
      if (rest.rightShoulderWidthM !== undefined)
        updateData.rightShoulderWidthM = rest.rightShoulderWidthM;
      if (rest.rightDrainageType !== undefined)
        updateData.rightDrainageType = rest.rightDrainageType;
      if (rest.rightLandUseType !== undefined)
        updateData.rightLandUseType = rest.rightLandUseType;
      if (damageAssessment !== undefined)
        updateData.damageAssessment = damageAssessment as DamageAssessment;

      const updatedSegment = await segmentService.updateSegmentById(
        segmentId,
        updateData as Partial<import("./segment.schema").ReadRoadSegmentType>
      );
      return {
        success: true,
        segment: updatedSegment,
      };
    }),
};
export type SegmentRouter = typeof segmentRouter;
