import { z } from "zod";
import { operatorProcedure } from "../../lib/orpc";
import { roadService } from "../road/road.service";
import { resultService } from "./results.service";

export const resultRouter = {
  generateForRoad: operatorProcedure
    .input(
      z.object({
        roadId: z.string().min(1, "Road ID is required"),
        includeDetails: z.boolean().optional(),
      })
    )
    .handler(async ({ context, input }) => {
      const payload = await resultService.generateResultsForRoad({
        roadId: input.roadId,
        userId: context.session.user.id,
        includeDetails: input.includeDetails ?? true,
      });

      return {
        success: true,
        resultId: payload.resultId,
        segmentResults: payload.segmentResults,
        pavementTypePercentages: payload.pavementTypePercentages,
        conditionLengthStats: payload.conditionLengthStats,
      };
    }),

  listByRoadId: operatorProcedure
    .input(z.object({ roadId: z.string().min(1, "Road ID is required") }))
    .handler(async ({ input }) => {
      const results = await resultService.getResultsByRoadId(input.roadId);
      return { results };
    }),

  getById: operatorProcedure
    .input(z.object({ resultId: z.string().min(1, "Result ID is required") }))
    .handler(async ({ input }) => {
      const record = await resultService.getResultById(input.resultId);

      if (!record) {
        throw new Error("Result not found");
      }

      return { result: record };
    }),

  statusByRoadId: operatorProcedure
    .input(z.object({ roadId: z.string().min(1, "Road ID is required") }))
    .handler(async ({ input }) => {
      const status = await resultService.getResultStatusByRoadId(input.roadId);
      return status;
    }),

  getReportByRoadId: operatorProcedure
    .input(z.object({ roadId: z.string().min(1, "Road ID is required") }))
    .handler(async ({ input }) => {
      const report = await resultService.getReportByRoadId(input.roadId);
      return report;
    }),

  listRoadsWithReportSummary: operatorProcedure.handler(async () => {
    const roads = await roadService.listAllRoads();
    const items = await Promise.all(
      roads.map(async (road) => {
        const reportSummary =
          await resultService.getReportSummaryByRoadId(road.id);
        return { road, reportSummary };
      })
    );
    return { roads: items };
  }),
};

export type ResultRouter = typeof resultRouter;
