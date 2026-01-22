import {
  createRoadInputSchema,
  damageAssessmentSchema,
  DRAINAGE_TYPES,
  LAND_USE_TYPES,
  PAVEMENT_TYPES,
  SEGMENT_GENERATION_MODES,
  SHOULDER_TYPES,
  SHOULDER_WIDTHS,
  TERRAIN_TYPES,
} from "@repo/shared";
import z from "zod";
import { operatorProcedure, visitorProcedure } from "../../lib/orpc";
import { segmentService } from "../segment/segment.service";
import { roadService } from "./road.service";

export const roadRouter = {
  createRoad: operatorProcedure
    .input(createRoadInputSchema)
    .handler(async ({ context, input }) => {
      const { session } = context;
      const result = await roadService.createRoad(session.user.id, input);
      return { success: true, roadId: result.roadId };
    }),

  getRoadAndSegmentsByRoadId: operatorProcedure
    .input(z.object({ roadId: z.string() }))
    .handler(async ({ input }) => {
      const roadRecord = await roadService.getRoadById(input.roadId);
      if (!roadRecord) {
        throw new Error("Road not found");
      }
      const segments = await segmentService.getSegmentsByRoadId(input.roadId);
      return { success: true, road: roadRecord, segments };
    }),

  listAllRoads: operatorProcedure.handler(async () => {
    const roads = await roadService.listAllRoads();
    return { roads };
  }),

  deleteRoad: operatorProcedure
    .input(z.object({ roadId: z.string() }))
    .handler(async ({ input }) => {
      const result = await roadService.deleteRoad(input.roadId);
      return result;
    }),

  updateRoad: operatorProcedure
    .input(
      z.object({
        roadId: z.string(),
        name: z.string().optional(),
        number: z.string().optional(),
        totalLengthKm: z.number().positive().optional(),
        segmentGenerationMode: z.enum(["exact", "rounded"]).optional(),
        isVisibleByVisitors: z.boolean().optional(),
      })
    )
    .handler(async ({ input }) => {
      const { roadId, ...updates } = input;
      const result = await roadService.updateRoad(roadId, updates);
      return result;
    }),

  getInitialSegmentData: operatorProcedure
    .input(z.object({ roadId: z.string() }))
    .handler(async ({ input }) => {
      const data = await roadService.getInitialSegmentDataForRegeneration(
        input.roadId
      );
      return data;
    }),

  regenerateSegmentsForRoad: operatorProcedure
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
          .positive("Carriageway width must be positive")
          .optional()
          .nullable(),
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
        damageAssessment: damageAssessmentSchema,
      })
    )
    .handler(async ({ input }) => {

      console.log(input);
      const payload: import("../segment/segment.service").GenerateSegmentsInput =
        {
          roadId: input.roadId,
          totalLengthKm: input.totalLengthKm,
          segmentIntervalM: input.segmentIntervalM,
          segmentGenerationMode: input.segmentGenerationMode,
          // Pavement inventory
          pavementType: input.pavementType,
          pavementWidthM: input.pavementWidthM,
          carriagewayWidthM: input.carriagewayWidthM ?? 0,
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
          customDamageAssessment: input.damageAssessment,
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

  // Visitor endpoints
  listVisibleRoadsForVisitors: visitorProcedure.handler(async () => {
    const roads = await roadService.listVisibleRoadsForVisitors();
    return { roads };
  }),
};

export type RoadRouter = typeof roadRouter;
