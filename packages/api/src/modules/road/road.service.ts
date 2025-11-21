import type {
  DamageAssessment,
  DrainageType,
  LandUseType,
  PavementType,
  SegmentGenerationMode,
  ShoulderType,
  ShoulderWidth,
  TerrainType,
} from "@repo/shared";
import { eq } from "drizzle-orm";
import { db } from "../../lib/db";
import { segmentService } from "../segment/segment.service";
import { road, type ReadRoadType } from "./road.schema";

export interface CreateRoadInput {
  name: string;
  number: string;
  totalLengthKm: number;
  segmentIntervalM: number;
  pavementWidthM: number;
  segmentGenerationMode: SegmentGenerationMode;
  // Pavement Inventory (will be applied to all segments)
  pavementType: PavementType;
  carriagewayWidthM: number;
  rightOfWayWidthM: number;
  terrain: TerrainType;
  notPassable: boolean;
  // Left side attributes (will be applied to all segments)
  leftShoulderType: ShoulderType;
  leftShoulderWidthM: ShoulderWidth;
  leftDrainageType: DrainageType;
  leftLandUseType: LandUseType;
  // Right side attributes (will be applied to all segments)
  rightShoulderType: ShoulderType;
  rightShoulderWidthM: ShoulderWidth;
  rightDrainageType: DrainageType;
  rightLandUseType: LandUseType;
  // Required: Damage assessment data
  damageAssessment: DamageAssessment;
  isVisibleByVisitors: boolean;
}

class RoadService {
  async createRoad(userId: string, input: CreateRoadInput) {
    // Create the road with only road-level data
    const [result] = await db
      .insert(road)
      .values({
        name: input.name,
        number: input.number,
        totalLengthKm: input.totalLengthKm,
        segmentIntervalM: input.segmentIntervalM,
        pavementWidthM: input.pavementWidthM,
        segmentGenerationMode: input.segmentGenerationMode,
        createdBy: userId,
        isVisibleByVisitors: input.isVisibleByVisitors,
      })
      .returning({ id: road.id });

    const roadId = result.id;

    // Automatically generate segments for the road
    // All segments will have the same attributes initially (from road creation form)
    await segmentService.generateSegments({
      roadId,
      totalLengthKm: input.totalLengthKm,
      segmentIntervalM: input.segmentIntervalM,
      segmentGenerationMode: input.segmentGenerationMode,
      // Pass pavement inventory
      pavementType: input.pavementType,
      pavementWidthM: input.pavementWidthM,
      carriagewayWidthM: input.carriagewayWidthM,
      rightOfWayWidthM: input.rightOfWayWidthM,
      terrain: input.terrain,
      notPassable: input.notPassable,
      // Pass left side attributes
      leftShoulderType: input.leftShoulderType,
      leftShoulderWidthM: input.leftShoulderWidthM,
      leftDrainageType: input.leftDrainageType,
      leftLandUseType: input.leftLandUseType,
      // Pass right side attributes
      rightShoulderType: input.rightShoulderType,
      rightShoulderWidthM: input.rightShoulderWidthM,
      rightDrainageType: input.rightDrainageType,
      rightLandUseType: input.rightLandUseType,
      // Pass damage assessment data
      customDamageAssessment: input.damageAssessment,
    });

    return { roadId };
  }

  async getRoadById(roadId: string): Promise<ReadRoadType | null> {
    const [roadRecord] = await db
      .select()
      .from(road)
      .where(eq(road.id, roadId));

    return roadRecord ?? null;
  }

  async listAllRoads(): Promise<ReadRoadType[]> {
    const roads = await db.select().from(road);
    return roads;
  }
}

export const roadService = new RoadService();
