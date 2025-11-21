import { createRoadInputSchema } from "@repo/shared";
import z from "zod";
import { operatorProcedure } from "../../lib/orpc";
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
};

export type RoadRouter = typeof roadRouter;
