import {
  PAVEMENT_TYPES,
  type AsphaltDamageData,
  type BlockDamageData,
  type ConcreteDamageData,
  type DamageAssessment,
  type PavementType,
  type UnpavedDamageData,
} from "@repo/shared";
import { desc, eq, inArray } from "drizzle-orm";
import { db } from "../../lib/db";
import { road } from "../road/road.schema";
import { segment, type ReadRoadSegmentType } from "../segment/segment.schema";
import {
  calculateDamageArea,
  calculateEdgeDamageArea,
  calculatePotholeArea,
} from "../shared/damage.schema";
import type {
  ConditionLengthStats,
  PavementTypePercentages,
  ReadResultRecord,
  SegmentCondition,
  SegmentResultSummary,
} from "./results.schema";
import { result } from "./results.schema";

type SectionContext = {
  length: number;
  width: number;
  area: number;
};

type SegmentSummaryMeta = {
  summary: SegmentResultSummary;
  lengthKm: number;
};

type ReportSegmentDetail = SegmentResultSummary & {
  segmentNumber: number | null;
  stationingFromM: number | null;
  stationingToM: number | null;
  segmentLengthM: number;
  inventory: {
    pavementType: string;
    pavementWidthM: number;
    carriagewayWidthM: number | null;
    rightOfWayWidthM: number;
    terrain: string;
    notPassable: boolean;
    leftShoulderType: string;
    leftShoulderWidthM: string;
    leftDrainageType: string;
    leftLandUseType: string;
    rightShoulderType: string;
    rightShoulderWidthM: string;
    rightDrainageType: string;
    rightLandUseType: string;
  } | null;
  damageAssessment: DamageAssessment | null;
};

interface GenerateResultsInput {
  roadId: string;
  userId: string;
  includeDetails?: boolean;
}

const CROSSFALL_CONDITION_VALUES: Record<
  UnpavedDamageData["crossfallCondition"],
  number
> = {
  ">5%": 7.5,
  "3-5%": 4,
  flat: 0,
  concave: 10,
};

class ResultService {
  private readonly asphaltWeights = {
    bleeding: 0.5,
    disintegration: 4,
    otherCrack: 2,
    reflectiveCrack: 2,
    pothole: 1.5,
    rutting: 1,
    edgeDamage: 1,
  } as const;

  private readonly concreteWeights = {
    cracking: 0.5,
    spalling: 1,
    structuralCracking: 2,
    faulting: 1,
    pumping: 15,
    cornerBreak: 1.5,
  } as const;

  private readonly blockWeights = {
    reflectiveCracking: 1,
    disintegration: 1,
    pothole: 0.5,
    rutting: 0.5,
    edgeDamage: 1,
  } as const;

  private readonly unpavedWeights = {
    crossfall: 0.05,
    depressions: 0.05,
    erosion: 0.05,
    potholes: 1.5,
    rutting: 1,
  } as const;

  private readonly conditionKeys: SegmentCondition[] = [
    "Good",
    "Fair",
    "Poor",
    "Bad",
  ];

  async generateResultsForRoad({
    roadId,
    userId,
    includeDetails = true,
  }: GenerateResultsInput) {
    await this.ensureRoadExists(roadId);

    const segments = await db
      .select()
      .from(segment)
      .where(eq(segment.roadId, roadId))
      .orderBy(segment.segmentNumber);

    if (segments.length === 0) {
      throw new Error("No segments available for this road");
    }

    const summariesWithMeta: SegmentSummaryMeta[] = segments.map(
      (segmentRecord) => ({
        summary: this.computeSegmentResult(segmentRecord, includeDetails),
        lengthKm: this.getSegmentLengthKm(segmentRecord),
      })
    );

    const segmentResults = summariesWithMeta.map((entry) => entry.summary);
    const pavementTypePercentages =
      this.computePavementTypePercentages(summariesWithMeta);
    const conditionLengthStats =
      this.computeConditionLengthStats(summariesWithMeta);

    const existingResult = await this.getResultRecordByRoadId(roadId);

    if (existingResult) {
      const [updated] = await db
        .update(result)
        .set({
          userId,
          segmentResults,
          pavementTypePercentages,
          conditionLengthStats,
          updatedAt: new Date(),
        })
        .where(eq(result.id, existingResult.id))
        .returning({ id: result.id });

      return {
        resultId: updated?.id ?? existingResult.id,
        segmentResults,
        pavementTypePercentages,
        conditionLengthStats,
      };
    }

    const [inserted] = await db
      .insert(result)
      .values({
        userId,
        roadId,
        segmentResults,
        pavementTypePercentages,
        conditionLengthStats,
      })
      .returning({ id: result.id });

    return {
      resultId: inserted.id,
      segmentResults,
      pavementTypePercentages,
      conditionLengthStats,
    };
  }

  async getResultsByRoadId(roadId: string): Promise<ReadResultRecord[]> {
    return db
      .select()
      .from(result)
      .where(eq(result.roadId, roadId))
      .orderBy(desc(result.createdAt));
  }

  async getResultById(resultId: string): Promise<ReadResultRecord | null> {
    const [record] = await db
      .select()
      .from(result)
      .where(eq(result.id, resultId))
      .limit(1);

    return record ?? null;
  }

  async getResultStatusByRoadId(roadId: string) {
    const existing = await this.getResultRecordByRoadId(roadId);

    return {
      hasReport: Boolean(existing),
      resultId: existing?.id ?? null,
      updatedAt: existing?.updatedAt ?? null,
    };
  }

  async getReportByRoadId(roadId: string) {
    const roadRecord = await this.fetchRoadSummary(roadId);

    if (!roadRecord) {
      throw new Error("Road not found");
    }

    const existingResult = await this.getResultRecordByRoadId(roadId);

    if (!existingResult) {
      throw new Error("No report generated for this road");
    }

    const segmentIds = existingResult.segmentResults.map(
      (segmentResult) => segmentResult.segmentId
    );

    const segmentMetadata = segmentIds.length
      ? await db
          .select({
            id: segment.id,
            segmentNumber: segment.segmentNumber,
            stationingFromM: segment.stationingFromM,
            stationingToM: segment.stationingToM,
            // Inventory attributes
            pavementType: segment.pavementType,
            pavementWidthM: segment.pavementWidthM,
            carriagewayWidthM: segment.carriagewayWidthM,
            rightOfWayWidthM: segment.rightOfWayWidthM,
            terrain: segment.terrain,
            notPassable: segment.notPassable,
            // Left side attributes
            leftShoulderType: segment.leftShoulderType,
            leftShoulderWidthM: segment.leftShoulderWidthM,
            leftDrainageType: segment.leftDrainageType,
            leftLandUseType: segment.leftLandUseType,
            // Right side attributes
            rightShoulderType: segment.rightShoulderType,
            rightShoulderWidthM: segment.rightShoulderWidthM,
            rightDrainageType: segment.rightDrainageType,
            rightLandUseType: segment.rightLandUseType,
            // Damage assessment
            damageAssessment: segment.damageAssessment,
          })
          .from(segment)
          .where(inArray(segment.id, segmentIds))
      : [];

    const segmentMetadataMap = new Map(
      segmentMetadata.map((meta) => [meta.id, meta])
    );

    const segments: ReportSegmentDetail[] = existingResult.segmentResults.map(
      (summary, index) => {
        const meta = segmentMetadataMap.get(summary.segmentId);
        const stationingFrom = this.toNullableNumber(meta?.stationingFromM);
        const stationingTo = this.toNullableNumber(meta?.stationingToM);
        const segmentLengthM =
          stationingFrom !== null && stationingTo !== null
            ? this.round(Math.max(stationingTo - stationingFrom, 0))
            : 0;

        return {
          ...summary,
          segmentNumber: meta?.segmentNumber ?? index + 1,
          stationingFromM: stationingFrom,
          stationingToM: stationingTo,
          segmentLengthM,
          // Include full segment inventory and damage assessment data
          inventory: meta
            ? {
                pavementType: meta.pavementType,
                pavementWidthM: this.toNumber(meta.pavementWidthM),
                carriagewayWidthM: this.toNullableNumber(
                  meta.carriagewayWidthM
                ),
                rightOfWayWidthM: this.toNumber(meta.rightOfWayWidthM),
                terrain: meta.terrain,
                notPassable: meta.notPassable,
                leftShoulderType: meta.leftShoulderType,
                leftShoulderWidthM: meta.leftShoulderWidthM,
                leftDrainageType: meta.leftDrainageType,
                leftLandUseType: meta.leftLandUseType,
                rightShoulderType: meta.rightShoulderType,
                rightShoulderWidthM: meta.rightShoulderWidthM,
                rightDrainageType: meta.rightDrainageType,
                rightLandUseType: meta.rightLandUseType,
              }
            : null,
          damageAssessment: meta?.damageAssessment ?? null,
        };
      }
    );

    return {
      road: {
        id: roadRecord.id,
        name: roadRecord.name,
        number: roadRecord.number,
        totalLengthKm: this.toNumber(roadRecord.totalLengthKm),
        pavementWidthM: this.toNumber(roadRecord.pavementWidthM),
        segmentIntervalM: roadRecord.segmentIntervalM,
      },
      report: {
        id: existingResult.id,
        updatedAt: existingResult.updatedAt,
        pavementTypePercentages: existingResult.pavementTypePercentages,
        conditionLengthStats: existingResult.conditionLengthStats,
        segments,
      },
    };
  }

  private async ensureRoadExists(roadId: string) {
    const roadRecord = await this.fetchRoadSummary(roadId);

    if (!roadRecord) {
      throw new Error("Road not found");
    }
  }

  private async fetchRoadSummary(roadId: string) {
    const [record] = await db
      .select({
        id: road.id,
        name: road.name,
        number: road.number,
        totalLengthKm: road.totalLengthKm,
        pavementWidthM: road.pavementWidthM,
        segmentIntervalM: road.segmentIntervalM,
      })
      .from(road)
      .where(eq(road.id, roadId))
      .limit(1);

    return record ?? null;
  }

  private computeSegmentResult(
    segmentRecord: ReadRoadSegmentType,
    includeDetails: boolean
  ): SegmentResultSummary {
    const context = this.createSectionContext(segmentRecord);
    const damageAssessment =
      segmentRecord.damageAssessment as DamageAssessment | null;

    if (!damageAssessment) {
      return this.buildSummary({
        segment: segmentRecord,
        pavementType: segmentRecord.pavementType,
        context,
        weightedDistress: 0,
        includeDetails,
      });
    }

    switch (damageAssessment.pavementType) {
      case "asphalt":
        return this.computeAsphaltSummary(
          segmentRecord,
          damageAssessment.data,
          context,
          includeDetails
        );

      case "concrete":
        return this.computeConcreteSummary(
          segmentRecord,
          damageAssessment.data,
          context,
          includeDetails
        );

      case "block":
        return this.computeBlockSummary(
          segmentRecord,
          damageAssessment.data,
          context,
          includeDetails
        );

      case "unpaved":
      case "gravel":
        return this.computeUnpavedSummary(
          segmentRecord,
          damageAssessment.data,
          context,
          includeDetails,
          damageAssessment.pavementType
        );

      default:
        return this.buildSummary({
          segment: segmentRecord,
          pavementType: segmentRecord.pavementType,
          context,
          weightedDistress: 0,
          includeDetails,
        });
    }
  }

  private async getResultRecordByRoadId(
    roadId: string
  ): Promise<ReadResultRecord | null> {
    const [existing] = await db
      .select()
      .from(result)
      .where(eq(result.roadId, roadId))
      .limit(1);

    return existing ?? null;
  }

  private computeAsphaltSummary(
    segmentRecord: ReadRoadSegmentType,
    data: AsphaltDamageData,
    context: SectionContext,
    includeDetails: boolean
  ): SegmentResultSummary {
    const areas = {
      bleeding: calculateDamageArea(
        data.bleeding,
        context.length,
        context.width
      ),
      disintegration: calculateDamageArea(
        data.disintegration,
        context.length,
        context.width
      ),
      otherCrack: calculateDamageArea(
        data.otherCrackArea,
        context.length,
        context.width
      ),
      reflectiveCrack: calculateDamageArea(
        data.reflectiveCracking,
        context.length,
        context.width
      ),
      pothole: calculatePotholeArea(
        data.potholeArea,
        context.length,
        context.width
      ),
      rutting: calculateDamageArea(data.rutting, context.length, context.width),
      edgeDamageLeft: calculateEdgeDamageArea(
        data.edgeDamageLeft,
        context.length
      ),
      edgeDamageRight: calculateEdgeDamageArea(
        data.edgeDamageRight,
        context.length
      ),
    };

    const weightedComponents = {
      bleeding: areas.bleeding * this.asphaltWeights.bleeding,
      disintegration: areas.disintegration * this.asphaltWeights.disintegration,
      otherCrack: areas.otherCrack * this.asphaltWeights.otherCrack,
      reflectiveCrack:
        areas.reflectiveCrack * this.asphaltWeights.reflectiveCrack,
      pothole: areas.pothole * this.asphaltWeights.pothole,
      rutting: areas.rutting * this.asphaltWeights.rutting,
      edgeDamageLeft: areas.edgeDamageLeft * this.asphaltWeights.edgeDamage,
      edgeDamageRight: areas.edgeDamageRight * this.asphaltWeights.edgeDamage,
    };

    const weightedDistress = this.sumRecord(weightedComponents);

    return this.buildSummary({
      segment: segmentRecord,
      pavementType: "asphalt",
      context,
      weightedDistress,
      includeDetails,
      distressAreas: areas,
      weightedComponents,
    });
  }

  private computeConcreteSummary(
    segmentRecord: ReadRoadSegmentType,
    data: ConcreteDamageData,
    context: SectionContext,
    includeDetails: boolean
  ): SegmentResultSummary {
    const areas = {
      cracking: calculateDamageArea(
        data.cracking,
        context.length,
        context.width
      ),
      spalling: calculateDamageArea(
        data.spalling,
        context.length,
        context.width
      ),
      structuralCracking: calculateDamageArea(
        data.structuralCracking,
        context.length,
        context.width
      ),
      faulting: calculateDamageArea(
        data.faulting,
        context.length,
        context.width
      ),
    };

    const pumpingCount = this.yesNoToCount(data.pumping);
    const cornerBreakCount = this.yesNoToCount(data.cornerBreak);

    const weightedComponents = {
      cracking: areas.cracking * this.concreteWeights.cracking,
      spalling: areas.spalling * this.concreteWeights.spalling,
      structuralCracking:
        areas.structuralCracking * this.concreteWeights.structuralCracking,
      faulting: areas.faulting * this.concreteWeights.faulting,
      pumping: pumpingCount * this.concreteWeights.pumping,
      cornerBreak: cornerBreakCount * this.concreteWeights.cornerBreak,
    };

    const weightedDistress = this.sumRecord(weightedComponents);

    const combinedAreas = {
      ...areas,
      pumping: pumpingCount,
      cornerBreak: cornerBreakCount,
    };

    return this.buildSummary({
      segment: segmentRecord,
      pavementType: "concrete",
      context,
      weightedDistress,
      includeDetails,
      distressAreas: combinedAreas,
      weightedComponents,
    });
  }

  private computeBlockSummary(
    segmentRecord: ReadRoadSegmentType,
    data: BlockDamageData,
    context: SectionContext,
    includeDetails: boolean
  ): SegmentResultSummary {
    const areas = {
      reflectiveCracking: calculateDamageArea(
        data.reflectiveCracking,
        context.length,
        context.width
      ),
      disintegration: calculateDamageArea(
        data.disintegration,
        context.length,
        context.width
      ),
      pothole: calculateDamageArea(
        data.potholeArea,
        context.length,
        context.width
      ),
      rutting: calculateDamageArea(data.rutting, context.length, context.width),
      edgeDamageLeft: calculateEdgeDamageArea(
        data.edgeDamageLeft,
        context.length
      ),
      edgeDamageRight: calculateEdgeDamageArea(
        data.edgeDamageRight,
        context.length
      ),
    };

    const weightedComponents = {
      reflectiveCracking:
        areas.reflectiveCracking * this.blockWeights.reflectiveCracking,
      disintegration: areas.disintegration * this.blockWeights.disintegration,
      pothole: areas.pothole * this.blockWeights.pothole,
      rutting: areas.rutting * this.blockWeights.rutting,
      edgeDamageLeft: areas.edgeDamageLeft * this.blockWeights.edgeDamage,
      edgeDamageRight: areas.edgeDamageRight * this.blockWeights.edgeDamage,
    };

    const weightedDistress = this.sumRecord(weightedComponents);

    return this.buildSummary({
      segment: segmentRecord,
      pavementType: "block",
      context,
      weightedDistress,
      includeDetails,
      distressAreas: areas,
      weightedComponents,
    });
  }

  private computeUnpavedSummary(
    segmentRecord: ReadRoadSegmentType,
    data: UnpavedDamageData,
    context: SectionContext,
    includeDetails: boolean,
    pavementType: PavementType
  ): SegmentResultSummary {
    const crossfallConditionPercent = this.getCrossfallConditionPercent(
      data.crossfallCondition
    );
    const crossfallConditionArea =
      (crossfallConditionPercent / 100) * context.area;
    const crossfallAreaFromPercent = calculateDamageArea(
      data.crossfallArea,
      context.length,
      context.width
    );
    const crossfallArea = Math.max(
      crossfallConditionArea,
      crossfallAreaFromPercent
    );

    const areas = {
      crossfall: crossfallArea,
      depressions: calculateDamageArea(
        data.settlement,
        context.length,
        context.width
      ),
      erosion: calculateDamageArea(data.erosion, context.length, context.width),
      potholes: calculatePotholeArea(
        data.potholeArea,
        context.length,
        context.width
      ),
      rutting: calculateDamageArea(data.rutting, context.length, context.width),
    };

    const weightedComponents = {
      crossfall: areas.crossfall * this.unpavedWeights.crossfall,
      depressions: areas.depressions * this.unpavedWeights.depressions,
      erosion: areas.erosion * this.unpavedWeights.erosion,
      potholes: areas.potholes * this.unpavedWeights.potholes,
      rutting: areas.rutting * this.unpavedWeights.rutting,
    };

    const weightedDistress = this.sumRecord(weightedComponents);

    return this.buildSummary({
      segment: segmentRecord,
      pavementType,
      context,
      weightedDistress,
      includeDetails,
      distressAreas: areas,
      weightedComponents,
    });
  }

  private computePavementTypePercentages(
    summaries: SegmentSummaryMeta[]
  ): PavementTypePercentages {
    const totalSegments = summaries.length || 1;
    const counts = Object.fromEntries(
      PAVEMENT_TYPES.map((type) => [type, 0])
    ) as Record<PavementType, number>;

    for (const entry of summaries) {
      counts[entry.summary.pavementType] += 1;
    }

    const percentages = {} as PavementTypePercentages;
    const rawPercentages: Array<{ type: PavementType; value: number }> = [];

    // Calculate raw percentages
    for (const pavementType of PAVEMENT_TYPES) {
      const count = counts[pavementType];
      const rawPercentage = (count / totalSegments) * 100;
      rawPercentages.push({ type: pavementType, value: rawPercentage });
    }

    // Round each percentage
    for (const { type, value } of rawPercentages) {
      percentages[type] = this.round(value);
    }

    // Normalize to ensure sum equals exactly 100%
    const sum = Object.values(percentages).reduce((acc, val) => acc + val, 0);
    const difference = 100 - sum;

    if (Math.abs(difference) > 0.001) {
      // Adjust the largest percentage to account for rounding differences
      const entries = Object.entries(percentages) as Array<
        [PavementType, number]
      >;
      const largestEntry = entries.reduce((max, entry) =>
        entry[1] > max[1] ? entry : max
      );
      percentages[largestEntry[0]] = this.round(
        largestEntry[1] + difference
      );
    }

    return percentages;
  }

  private computeConditionLengthStats(
    summaries: SegmentSummaryMeta[]
  ): ConditionLengthStats {
    const stats = {} as ConditionLengthStats;

    for (const condition of this.conditionKeys) {
      stats[condition] = { lengthKm: 0, percentage: 0 };
    }

    let totalLength = 0;

    for (const { summary, lengthKm } of summaries) {
      stats[summary.condition].lengthKm += lengthKm;
      totalLength += lengthKm;
    }

    const divisor = totalLength || 1;

    // Calculate and round percentages
    const rawPercentages: Array<{
      condition: SegmentCondition;
      percentage: number;
    }> = [];

    for (const condition of this.conditionKeys) {
      const entry = stats[condition];
      entry.lengthKm = this.round(entry.lengthKm);
      const rawPercentage = (entry.lengthKm / divisor) * 100;
      rawPercentages.push({ condition, percentage: rawPercentage });
    }

    // Round each percentage
    for (const { condition, percentage } of rawPercentages) {
      stats[condition].percentage = this.round(percentage);
    }

    // Normalize to ensure sum equals exactly 100%
    const sum = Object.values(stats).reduce(
      (acc, stat) => acc + stat.percentage,
      0
    );
    const difference = 100 - sum;

    if (Math.abs(difference) > 0.001) {
      // Adjust the largest percentage to account for rounding differences
      const entries = Object.entries(stats) as Array<
        [SegmentCondition, { lengthKm: number; percentage: number }]
      >;
      const largestEntry = entries.reduce((max, entry) =>
        entry[1].percentage > max[1].percentage ? entry : max
      );
      stats[largestEntry[0]].percentage = this.round(
        largestEntry[1].percentage + difference
      );
    }

    return stats;
  }

  private createSectionContext(
    segmentRecord: ReadRoadSegmentType
  ): SectionContext {
    const stationingFrom = this.toNumber(segmentRecord.stationingFromM);
    const stationingTo = this.toNumber(segmentRecord.stationingToM);
    const length = Math.max(stationingTo - stationingFrom, 0);
    const width = Math.max(this.toNumber(segmentRecord.pavementWidthM), 0);

    return {
      length,
      width,
      area: length * width,
    };
  }

  private getSegmentLengthKm(segmentRecord: ReadRoadSegmentType): number {
    const stationingFrom = this.toNumber(segmentRecord.stationingFromM);
    const stationingTo = this.toNumber(segmentRecord.stationingToM);
    const lengthM = Math.max(stationingTo - stationingFrom, 0);
    return lengthM / 1000;
  }

  private buildSummary({
    segment,
    pavementType,
    context,
    weightedDistress,
    includeDetails,
    distressAreas,
    weightedComponents,
  }: {
    segment: ReadRoadSegmentType;
    pavementType: PavementType;
    context: SectionContext;
    weightedDistress: number;
    includeDetails: boolean;
    distressAreas?: Record<string, number>;
    weightedComponents?: Record<string, number>;
  }): SegmentResultSummary {
    const sectionAreaRounded = this.round(context.area);
    const weightedDistressRounded = this.round(weightedDistress);

    // Special case: Unpaved roads always have a fixed TTI of 150
    const ttiRaw =
      pavementType === "unpaved"
        ? 150
        : context.area > 0
          ? (weightedDistress / context.area) * 100
          : 0;
    const tti = this.round(ttiRaw);

    return {
      segmentId: segment.id,
      pavementType,
      sectionArea: sectionAreaRounded,
      weightedDistress: weightedDistressRounded,
      tti,
      condition: this.mapCondition(tti),
      distressAreas:
        includeDetails && distressAreas
          ? this.roundRecord(distressAreas)
          : undefined,
      weightedComponents:
        includeDetails && weightedComponents
          ? this.roundRecord(weightedComponents)
          : undefined,
    };
  }

  private mapCondition(tti: number): SegmentResultSummary["condition"] {
    if (tti < 25) return "Good";
    if (tti < 75) return "Fair";
    if (tti <= 100) return "Poor";
    return "Bad";
  }

  private yesNoToCount(value: "yes" | "no"): number {
    return value === "yes" ? 1 : 0;
  }

  private getCrossfallConditionPercent(
    condition: UnpavedDamageData["crossfallCondition"]
  ): number {
    return CROSSFALL_CONDITION_VALUES[condition] ?? 0;
  }

  private sumRecord(record: Record<string, number>): number {
    return Object.values(record).reduce((acc, value) => acc + value, 0);
  }

  private roundRecord(record: Record<string, number>): Record<string, number> {
    return Object.fromEntries(
      Object.entries(record).map(([key, value]) => [key, this.round(value)])
    );
  }

  private round(value: number, precision = 2): number {
    const factor = 10 ** precision;
    return Math.round((value + Number.EPSILON) * factor) / factor;
  }

  private toNullableNumber(value: unknown): number | null {
    if (value === null || value === undefined) {
      return null;
    }
    const numericValue = Number(value);
    return Number.isFinite(numericValue) ? numericValue : null;
  }

  private toNumber(value: unknown): number {
    const numericValue = Number(value ?? 0);
    return Number.isFinite(numericValue) ? numericValue : 0;
  }
}

export const resultService = new ResultService();
