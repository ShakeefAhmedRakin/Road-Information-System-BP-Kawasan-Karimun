import { z } from "zod";
import { operatorProcedure } from "../../lib/orpc";
import { roadService } from "./road.service";

export const roadRouter = {
  createRoad: operatorProcedure
    .input(
      z.object({
        name: z.string().min(1, "Road name is required"),
        number: z.string().min(1, "Road number is required"),
        totalLengthKm: z.number().positive("Total length must be positive"),
        segmentIntervalM: z
          .number()
          .int()
          .positive("Segment interval must be a positive integer"),
        pavementWidthM: z.number().positive("Pavement width must be positive"),
      })
    )
    .handler(async ({ context, input }) => {
      const { session } = context;
      const result = await roadService.createRoad(session.user.id, input);
      return { success: true, roadId: result.roadId };
    }),

  listAllRoads: operatorProcedure.handler(async () => {
    const roads = await roadService.listAllRoads();
    return { roads };
  }),
};

export type RoadRouter = typeof roadRouter;
