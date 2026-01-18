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
import { eq, inArray, sql } from "drizzle-orm";
import { db } from "../../lib/db";
import { segment } from "../segment/segment.schema";
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

  async listAllRoads(): Promise<
    Array<ReadRoadType & { segmentCount: number }>
  > {
    const roads = await db.select().from(road);

    // Get segment counts for each road
    const roadIds = roads.map((r) => r.id);
    const segmentCountsMap = new Map<string, number>();

    if (roadIds.length > 0) {
      const segmentCounts = await db
        .select({
          roadId: segment.roadId,
          count: sql<number>`count(*)::int`,
        })
        .from(segment)
        .where(inArray(segment.roadId, roadIds))
        .groupBy(segment.roadId);

      for (const { roadId, count } of segmentCounts) {
        segmentCountsMap.set(roadId, count);
      }
    }

    // Add segment counts to roads
    return roads.map((road) => ({
      ...road,
      segmentCount: segmentCountsMap.get(road.id) ?? 0,
    }));
  }

  async deleteRoad(roadId: string): Promise<{ success: boolean }> {
    // Segments will be automatically deleted due to cascade delete in the schema
    const result = await db.delete(road).where(eq(road.id, roadId));

    if (result.rowCount === 0) {
      throw new Error("Road not found");
    }

    return { success: true };
  }

  async updateRoad(
    roadId: string,
    updates: Partial<{
      name: string;
      number: string;
      totalLengthKm: number;
      segmentGenerationMode: SegmentGenerationMode;
    }>
  ): Promise<{ success: boolean; road: ReadRoadType }> {
    const updateData: Partial<ReadRoadType> = {};

    if (updates.name !== undefined) updateData.name = updates.name;
    if (updates.number !== undefined) updateData.number = updates.number;
    if (updates.totalLengthKm !== undefined)
      updateData.totalLengthKm = updates.totalLengthKm;
    if (updates.segmentGenerationMode !== undefined)
      updateData.segmentGenerationMode = updates.segmentGenerationMode;

    if (Object.keys(updateData).length === 0) {
      throw new Error("No fields to update");
    }

    const [updatedRoad] = await db
      .update(road)
      .set({
        ...updateData,
        updatedAt: new Date(),
      })
      .where(eq(road.id, roadId))
      .returning();

    if (!updatedRoad) {
      throw new Error("Road not found");
    }

    return { success: true, road: updatedRoad };
  }

  async getInitialSegmentDataForRegeneration(roadId: string) {
    const roadRecord = await this.getRoadById(roadId);
    if (!roadRecord) {
      throw new Error("Road not found");
    }

    // Get the first segment to use as a template for regeneration
    const [firstSegment] = await db
      .select()
      .from(segment)
      .where(eq(segment.roadId, roadId))
      .orderBy(segment.segmentNumber)
      .limit(1);

    if (!firstSegment) {
      throw new Error("No segments found for this road");
    }

    // Return the data needed for segment regeneration
    return {
      segmentIntervalM: roadRecord.segmentIntervalM,
      pavementWidthM: roadRecord.pavementWidthM,
      // From first segment
      pavementType: firstSegment.pavementType,
      carriagewayWidthM: this.toNullableNumber(firstSegment.carriagewayWidthM),
      rightOfWayWidthM: this.toNumber(firstSegment.rightOfWayWidthM),
      terrain: firstSegment.terrain,
      notPassable: firstSegment.notPassable,
      leftShoulderType: firstSegment.leftShoulderType,
      leftShoulderWidthM: firstSegment.leftShoulderWidthM,
      leftDrainageType: firstSegment.leftDrainageType,
      leftLandUseType: firstSegment.leftLandUseType,
      rightShoulderType: firstSegment.rightShoulderType,
      rightShoulderWidthM: firstSegment.rightShoulderWidthM,
      rightDrainageType: firstSegment.rightDrainageType,
      rightLandUseType: firstSegment.rightLandUseType,
      damageAssessment: firstSegment.damageAssessment,
    };
  }

  private toNumber(value: unknown): number {
    if (typeof value === "number") return value;
    if (typeof value === "string") {
      const parsed = parseFloat(value);
      return Number.isNaN(parsed) ? 0 : parsed;
    }
    return 0;
  }

  private toNullableNumber(value: unknown): number | null {
    if (value === null || value === undefined) return null;
    if (typeof value === "number") return value;
    if (typeof value === "string") {
      const parsed = parseFloat(value);
      return Number.isNaN(parsed) ? null : parsed;
    }
    return null;
  }
}

export const roadService = new RoadService();
