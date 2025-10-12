import { db } from "../../lib/db";
import { road, type ReadRoadType } from "./road.schema";

export interface CreateRoadInput {
  name: string;
  number: string;
  totalLengthKm: number;
  segmentIntervalM: number;
  pavementWidthM: number;
}

class RoadService {
  async createRoad(userId: string, input: CreateRoadInput) {
    const [result] = await db
      .insert(road)
      .values({
        name: input.name,
        number: input.number,
        totalLengthKm: input.totalLengthKm,
        segmentIntervalM: input.segmentIntervalM,
        pavementWidthM: input.pavementWidthM,
        createdBy: userId,
      })
      .returning({ id: road.id });

    return { roadId: result.id };
  }

  async listAllRoads(): Promise<ReadRoadType[]> {
    const roads = await db.select().from(road);
    return roads;
  }
}

export const roadService = new RoadService();
