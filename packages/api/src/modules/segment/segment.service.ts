import type {
  AsphaltDamageData,
  BlockDamageData,
  ConcreteDamageData,
  DamageAssessment,
  DrainageType,
  LandUseType,
  PavementType,
  SegmentGenerationMode,
  ShoulderType,
  ShoulderWidth,
  TerrainType,
  UnpavedDamageData,
} from "@repo/shared";
import { eq } from "drizzle-orm";
import { db } from "../../lib/db";
import { segment, type ReadRoadSegmentType } from "./segment.schema";

export interface GenerateSegmentsInput {
  roadId: string;
  totalLengthKm: number;
  segmentIntervalM: number;
  segmentGenerationMode: SegmentGenerationMode;
  // Pavement Inventory (copied to all segments)
  pavementType: PavementType;
  pavementWidthM: number;
  carriagewayWidthM: number;
  rightOfWayWidthM: number;
  terrain: TerrainType;
  notPassable: boolean;
  // Left side attributes (copied to all segments)
  leftShoulderType: ShoulderType;
  leftShoulderWidthM: ShoulderWidth;
  leftDrainageType: DrainageType;
  leftLandUseType: LandUseType;
  // Right side attributes (copied to all segments)
  rightShoulderType: ShoulderType;
  rightShoulderWidthM: ShoulderWidth;
  rightDrainageType: DrainageType;
  rightLandUseType: LandUseType;
  // Required: Damage assessment data
  customDamageAssessment: DamageAssessment;
}

class SegmentService {
  /**
   * Create default damage assessment data based on pavement type
   * @param pavementType - The type of pavement
   * @returns Default damage assessment data
   */
  private createDefaultDamageAssessment(
    pavementType: PavementType
  ): DamageAssessment {
    switch (pavementType) {
      case "asphalt":
        return {
          pavementType: "asphalt",
          data: {
            surfaceCondition: "good",
            bleeding: "0%",
            disintegration: "0%",
            crackType: "none",
            averageCrackWidth: "none",
            otherCrackArea: "0%",
            reflectiveCracking: "0%",
            numberOfPotholes: "0",
            potholeSize: "none",
            potholeArea: "0%",
            rutting: "0%",
            averageRutDepth: "none",
            edgeDamageLeft: "none",
            edgeDamageRight: "none",
          } as AsphaltDamageData,
        };

      case "concrete":
        return {
          pavementType: "concrete",
          data: {
            cracking: "0%",
            spalling: "0%",
            structuralCracking: "0%",
            faulting: "0%",
            pumping: "no",
            cornerBreak: "no",
          } as ConcreteDamageData,
        };

      case "block":
        return {
          pavementType: "block",
          data: {
            reflectiveCracking: "0%",
            disintegration: "0%",
            edgeDamageLeft: "none",
            edgeDamageRight: "none",
            potholeArea: "0%",
            rutting: "0%",
          } as BlockDamageData,
        };

      case "unpaved":
        return {
          pavementType: "unpaved",
          data: {
            crossfallCondition: "flat",
            crossfallArea: "0%",
            settlement: "0%",
            erosion: "0%",
            largestParticleSize: "none",
            gravelThickness: "none",
            gravelArea: "0%",
            gravelDistribution: "none",
            corrugation: "0%",
            numberOfPotholes: "0",
            potholeSize: "none",
            potholeArea: "0%",
            rutting: "0%",
            averageRutDepth: "none",
          } as UnpavedDamageData,
        };

      case "gravel":
        // Gravel uses the same data structure as unpaved
        return {
          pavementType: "gravel",
          data: {
            crossfallCondition: "flat",
            crossfallArea: "0%",
            settlement: "0%",
            erosion: "0%",
            largestParticleSize: "none",
            gravelThickness: "none",
            gravelArea: "0%",
            gravelDistribution: "none",
            corrugation: "0%",
            numberOfPotholes: "0",
            potholeSize: "none",
            potholeArea: "0%",
            rutting: "0%",
            averageRutDepth: "none",
          } as UnpavedDamageData,
        };

      default:
        throw new Error(`Unknown pavement type: ${pavementType}`);
    }
  }

  /**
   * Generate segments for a road based on its length and generation mode
   * @param input - Road data for segment generation
   * @returns Array of generated segment IDs
   */
  async generateSegments(input: GenerateSegmentsInput): Promise<string[]> {
    const {
      roadId,
      totalLengthKm,
      segmentIntervalM,
      segmentGenerationMode,
      // Pavement inventory
      pavementType,
      pavementWidthM,
      carriagewayWidthM,
      rightOfWayWidthM,
      terrain,
      notPassable,
      // Left side attributes
      leftShoulderType,
      leftShoulderWidthM,
      leftDrainageType,
      leftLandUseType,
      // Right side attributes
      rightShoulderType,
      rightShoulderWidthM,
      rightDrainageType,
      rightLandUseType,
      // Damage assessment data
      customDamageAssessment,
    } = input;

    // Convert total length from km to meters
    const totalLengthM = totalLengthKm * 1000;

    // Calculate number of full segments
    const fullSegments = Math.floor(totalLengthM / segmentIntervalM);
    const remainder = totalLengthM % segmentIntervalM;

    const segmentsToInsert = [];

    // Generate full segments
    for (let i = 0; i < fullSegments; i++) {
      const fromM = i * segmentIntervalM;
      const toM = (i + 1) * segmentIntervalM;

      segmentsToInsert.push({
        roadId,
        segmentNumber: i + 1,
        stationingFromM: fromM,
        stationingToM: toM,
        // Copy pavement inventory
        pavementType,
        pavementWidthM,
        carriagewayWidthM,
        rightOfWayWidthM,
        terrain,
        notPassable,
        // Copy left side attributes
        leftShoulderType,
        leftShoulderWidthM,
        leftDrainageType,
        leftLandUseType,
        // Copy right side attributes
        rightShoulderType,
        rightShoulderWidthM,
        rightDrainageType,
        rightLandUseType,
        // Add damage assessment data
        damageAssessment: customDamageAssessment,
      });
    }

    // Handle the last segment based on generation mode
    if (remainder > 0) {
      const lastFromM = fullSegments * segmentIntervalM;
      let lastToM: number;

      if (segmentGenerationMode === "exact") {
        // Last segment ends at exact road length
        lastToM = totalLengthM;
      } else {
        // "rounded" - Last segment rounds up to complete interval
        lastToM = (fullSegments + 1) * segmentIntervalM;
      }

      segmentsToInsert.push({
        roadId,
        segmentNumber: fullSegments + 1,
        stationingFromM: lastFromM,
        stationingToM: lastToM,
        // Copy pavement inventory
        pavementType,
        pavementWidthM,
        carriagewayWidthM,
        rightOfWayWidthM,
        terrain,
        notPassable,
        // Copy left side attributes
        leftShoulderType,
        leftShoulderWidthM,
        leftDrainageType,
        leftLandUseType,
        // Copy right side attributes
        rightShoulderType,
        rightShoulderWidthM,
        rightDrainageType,
        rightLandUseType,
        // Add damage assessment data
        damageAssessment: customDamageAssessment,
      });
    }

    // Insert all segments at once
    const result = await db
      .insert(segment)
      .values(segmentsToInsert)
      .returning({ id: segment.id });

    return result.map((r) => r.id);
  }

  /**
   * Get all segments for a specific road
   * @param roadId - The road ID
   * @returns Array of segments ordered by segment number
   */
  async getSegmentsByRoadId(roadId: string): Promise<ReadRoadSegmentType[]> {
    const segments = await db
      .select()
      .from(segment)
      .where(eq(segment.roadId, roadId))
      .orderBy(segment.segmentNumber);

    return segments;
  }

  /**
   * Delete all segments for a specific road
   * @param roadId - The road ID
   * @returns Number of deleted segments
   */
  async deleteSegmentsByRoadId(roadId: string): Promise<number> {
    const result = await db.delete(segment).where(eq(segment.roadId, roadId));

    return result.rowCount || 0;
  }

  /**
   * Regenerates all segments for a road using the provided segment data.
   * This method deletes existing segments and creates new ones with the specified attributes.
   *
   * @param roadId - ID of the road to regenerate segments for
   * @param segmentData - Complete segment data including all attributes
   * @returns Array of new segment IDs
   */
  async regenerateSegments(
    roadId: string,
    segmentData: GenerateSegmentsInput
  ): Promise<string[]> {
    // Delete existing segments
    await this.deleteSegmentsByRoadId(roadId);

    // Generate new segments using the provided data
    return this.generateSegments(segmentData);
  }

  /**
   * Update a single segment by ID
   * @param segmentId - The segment ID
   * @param input - The update data
   * @returns The updated segment
   */
  async updateSegmentById(
    segmentId: string,
    input: Partial<ReadRoadSegmentType>
  ): Promise<ReadRoadSegmentType> {
    const [updatedSegment] = await db
      .update(segment)
      .set({
        ...input,
        updatedAt: new Date(),
      })
      .where(eq(segment.id, segmentId))
      .returning();

    if (!updatedSegment) {
      throw new Error("Segment not found");
    }

    return updatedSegment;
  }
}

export const segmentService = new SegmentService();
