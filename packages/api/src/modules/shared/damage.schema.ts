import { z } from "zod";

// ============================================================================
// DAMAGE ASSESSMENT ENUMS - Single source of truth for all damage types
// ============================================================================

// Surface condition types
export const SURFACE_CONDITIONS = ["good", "rough"] as const;

// Percentage ranges for damage assessments
export const DAMAGE_PERCENTAGE_RANGES = [
  "0%",
  "0-5%",
  "5-10%",
  "10-20%",
  "20-30%",
  "30-40%",
  "40-50%",
  ">50%",
] as const;

// Pothole area percentage ranges for unpaved roads (different ranges)
export const POTHOLE_AREA_PERCENTAGE_RANGES = [
  "0%",
  "0-3%",
  "3-5%",
  "5-10%",
  "10-20%",
  "20-30%",
  "30-40%",
  "40-50%",
  ">50%",
] as const;

// Crack types
export const CRACK_TYPES = [
  "none",
  "not_connected",
  "interconnected_wide_area",
  "interconnected_narrow_area",
] as const;

// Crack width types
export const CRACK_WIDTH_TYPES = ["none", "<1mm", "1-5mm", ">5mm"] as const;

// Pothole count types
export const POTHOLE_COUNT_TYPES = [
  "0",
  "1",
  "2",
  "3",
  "4",
  "5",
  "6",
  "7",
  ">7",
] as const;

// Pothole size types
export const POTHOLE_SIZE_TYPES = [
  "none",
  "small_shallow",
  "small_deep",
  "large_shallow",
  "large_deep",
] as const;

// Rut depth types
export const RUT_DEPTH_TYPES = ["none", "<1cm", "1-3cm", ">3cm"] as const;

// Edge damage types
export const EDGE_DAMAGE_TYPES = [
  "none",
  "light_0_30%",
  "severe_>30%",
] as const;

// Yes/No types
export const YES_NO_TYPES = ["yes", "no"] as const;

// Crossfall condition types
export const CROSSFALL_CONDITIONS = [">5%", "3-5%", "flat", "concave"] as const;

// Particle size types
export const PARTICLE_SIZE_TYPES = [
  "none",
  "<1cm",
  "1-5cm",
  ">5cm",
  "not_uniform",
] as const;

// Gravel thickness types
export const GRAVEL_THICKNESS_TYPES = [
  "none",
  "<5cm",
  "5-10cm",
  "10-20cm",
  ">20cm",
] as const;

// Gravel distribution types
export const GRAVEL_DISTRIBUTION_TYPES = [
  "none",
  "even",
  "uneven",
  "longitudinal_windrow",
] as const;

// Rut depth types for unpaved (different from paved)
export const UNPAVED_RUT_DEPTH_TYPES = [
  "none",
  "<5cm",
  "5-15cm",
  ">15cm",
] as const;

// ============================================================================
// TYPESCRIPT TYPES
// ============================================================================

export type SurfaceCondition = (typeof SURFACE_CONDITIONS)[number];
export type DamagePercentageRange = (typeof DAMAGE_PERCENTAGE_RANGES)[number];
export type CrackType = (typeof CRACK_TYPES)[number];
export type CrackWidthType = (typeof CRACK_WIDTH_TYPES)[number];
export type PotholeCountType = (typeof POTHOLE_COUNT_TYPES)[number];
export type PotholeSizeType = (typeof POTHOLE_SIZE_TYPES)[number];
export type RutDepthType = (typeof RUT_DEPTH_TYPES)[number];
export type EdgeDamageType = (typeof EDGE_DAMAGE_TYPES)[number];
export type YesNoType = (typeof YES_NO_TYPES)[number];
export type CrossfallCondition = (typeof CROSSFALL_CONDITIONS)[number];
export type ParticleSizeType = (typeof PARTICLE_SIZE_TYPES)[number];
export type GravelThicknessType = (typeof GRAVEL_THICKNESS_TYPES)[number];
export type GravelDistributionType = (typeof GRAVEL_DISTRIBUTION_TYPES)[number];
export type UnpavedRutDepthType = (typeof UNPAVED_RUT_DEPTH_TYPES)[number];
export type PotholeAreaPercentageRange =
  (typeof POTHOLE_AREA_PERCENTAGE_RANGES)[number];

// ============================================================================
// ZOD VALIDATION SCHEMAS
// ============================================================================

// Base schemas
const surfaceConditionSchema = z.enum(SURFACE_CONDITIONS);
const damagePercentageRangeSchema = z.enum(DAMAGE_PERCENTAGE_RANGES);
const crackTypeSchema = z.enum(CRACK_TYPES);
const crackWidthTypeSchema = z.enum(CRACK_WIDTH_TYPES);
const potholeCountTypeSchema = z.enum(POTHOLE_COUNT_TYPES);
const potholeSizeTypeSchema = z.enum(POTHOLE_SIZE_TYPES);
const rutDepthTypeSchema = z.enum(RUT_DEPTH_TYPES);
const edgeDamageTypeSchema = z.enum(EDGE_DAMAGE_TYPES);
const yesNoTypeSchema = z.enum(YES_NO_TYPES);
const crossfallConditionSchema = z.enum(CROSSFALL_CONDITIONS);
const particleSizeTypeSchema = z.enum(PARTICLE_SIZE_TYPES);
const gravelThicknessTypeSchema = z.enum(GRAVEL_THICKNESS_TYPES);
const gravelDistributionTypeSchema = z.enum(GRAVEL_DISTRIBUTION_TYPES);
const unpavedRutDepthTypeSchema = z.enum(UNPAVED_RUT_DEPTH_TYPES);
const potholeAreaPercentageRangeSchema = z.enum(POTHOLE_AREA_PERCENTAGE_RANGES);

// ============================================================================
// ASPHALT DAMAGE ASSESSMENT SCHEMA
// ============================================================================

export const asphaltDamageSchema = z.object({
  // Surface condition
  surfaceCondition: surfaceConditionSchema,

  // Bleeding damage
  bleeding: damagePercentageRangeSchema,

  // Disintegration damage
  disintegration: damagePercentageRangeSchema,

  // Crack damage
  crackType: crackTypeSchema,
  averageCrackWidth: crackWidthTypeSchema,
  otherCrackArea: damagePercentageRangeSchema,
  reflectiveCracking: damagePercentageRangeSchema,

  // Pothole damage
  numberOfPotholes: potholeCountTypeSchema,
  potholeSize: potholeSizeTypeSchema,
  potholeArea: potholeAreaPercentageRangeSchema, // Using specific pothole area ranges

  // Rutting damage
  rutting: damagePercentageRangeSchema,
  averageRutDepth: rutDepthTypeSchema,

  // Edge damage (left and right)
  edgeDamageLeft: edgeDamageTypeSchema,
  edgeDamageRight: edgeDamageTypeSchema,
});

export type AsphaltDamageData = z.infer<typeof asphaltDamageSchema>;

// ============================================================================
// CONCRETE DAMAGE ASSESSMENT SCHEMA
// ============================================================================

export const concreteDamageSchema = z.object({
  // Cracking damage
  cracking: damagePercentageRangeSchema,

  // Spalling damage
  spalling: damagePercentageRangeSchema,

  // Structural cracking
  structuralCracking: damagePercentageRangeSchema,

  // Faulting damage
  faulting: damagePercentageRangeSchema,

  // Pumping assessment
  pumping: yesNoTypeSchema,

  // Corner break assessment
  cornerBreak: yesNoTypeSchema,
});

export type ConcreteDamageData = z.infer<typeof concreteDamageSchema>;

// ============================================================================
// BLOCK DAMAGE ASSESSMENT SCHEMA
// ============================================================================

export const blockDamageSchema = z.object({
  // Reflective cracking
  reflectiveCracking: damagePercentageRangeSchema,

  // Disintegration
  disintegration: damagePercentageRangeSchema,

  // Edge damage (left and right)
  edgeDamageLeft: edgeDamageTypeSchema,
  edgeDamageRight: edgeDamageTypeSchema,

  // Pothole area
  potholeArea: damagePercentageRangeSchema,

  // Rutting
  rutting: damagePercentageRangeSchema,
});

export type BlockDamageData = z.infer<typeof blockDamageSchema>;

// ============================================================================
// UNPAVED/GRAVEL DAMAGE ASSESSMENT SCHEMA
// ============================================================================

export const unpavedDamageSchema = z.object({
  // Crossfall
  crossfallCondition: crossfallConditionSchema,
  crossfallArea: damagePercentageRangeSchema,

  // Settlement
  settlement: damagePercentageRangeSchema,

  // Erosion
  erosion: damagePercentageRangeSchema,

  // Particle size
  largestParticleSize: particleSizeTypeSchema,

  // Gravel properties
  gravelThickness: gravelThicknessTypeSchema,
  gravelArea: damagePercentageRangeSchema,
  gravelDistribution: gravelDistributionTypeSchema,

  // Corrugation
  corrugation: damagePercentageRangeSchema,

  // Pothole damage
  numberOfPotholes: potholeCountTypeSchema,
  potholeSize: potholeSizeTypeSchema,
  potholeArea: potholeAreaPercentageRangeSchema, // Using specific pothole area ranges

  // Rutting damage
  rutting: damagePercentageRangeSchema,
  averageRutDepth: unpavedRutDepthTypeSchema,
});

export type UnpavedDamageData = z.infer<typeof unpavedDamageSchema>;

// ============================================================================
// MAIN DAMAGE ASSESSMENT SCHEMA (DISCRIMINATED UNION)
// ============================================================================

export const damageAssessmentSchema = z.discriminatedUnion("pavementType", [
  z.object({
    pavementType: z.literal("asphalt"),
    data: asphaltDamageSchema,
  }),
  z.object({
    pavementType: z.literal("concrete"),
    data: concreteDamageSchema,
  }),
  z.object({
    pavementType: z.literal("block"),
    data: blockDamageSchema,
  }),
  z.object({
    pavementType: z.literal("unpaved"),
    data: unpavedDamageSchema,
  }),
  z.object({
    pavementType: z.literal("gravel"),
    data: unpavedDamageSchema, // Same as unpaved
  }),
]);

export type DamageAssessment = z.infer<typeof damageAssessmentSchema>;

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * Get the percentage value from a damage percentage range
 * Returns the midpoint of the range for calculations
 */
export function getPercentageValue(range: DamagePercentageRange): number {
  switch (range) {
    case "0%":
      return 0;
    case "0-5%":
      return 2.5;
    case "5-10%":
      return 7.5;
    case "10-20%":
      return 15;
    case "20-30%":
      return 25;
    case "30-40%":
      return 35;
    case "40-50%":
      return 45;
    case ">50%":
      return 60; // Conservative estimate for >50%
    default:
      return 0;
  }
}

/**
 * Get the percentage value from a pothole area percentage range
 * Returns the midpoint of the range for calculations
 */
export function getPotholeAreaPercentageValue(
  range: PotholeAreaPercentageRange
): number {
  switch (range) {
    case "0%":
      return 0;
    case "0-3%":
      return 1.5;
    case "3-5%":
      return 4;
    case "5-10%":
      return 7.5;
    case "10-20%":
      return 15;
    case "20-30%":
      return 25;
    case "30-40%":
      return 35;
    case "40-50%":
      return 45;
    case ">50%":
      return 60; // Conservative estimate for >50%
    default:
      return 0;
  }
}

/**
 * Get the edge damage calculation value
 * Returns the appropriate multiplier for edge damage calculations
 */
export function getEdgeDamageValue(damage: EdgeDamageType): number {
  switch (damage) {
    case "none":
      return 0;
    case "light_0_30%":
      return 0.15; // Midpoint of 0-30% range
    case "severe_>30%":
      return 0.3375; // As specified in requirements
    default:
      return 0;
  }
}

/**
 * Calculate damage area in square meters
 * Formula: Midpoint% × (Stationing to - Stationing from) × Pavement width
 */
export function calculateDamageArea(
  percentageRange: DamagePercentageRange,
  segmentLengthM: number,
  pavementWidthM: number
): number {
  const percentage = getPercentageValue(percentageRange);
  return (percentage / 100) * segmentLengthM * pavementWidthM;
}

/**
 * Calculate edge damage area in square meters
 * Formula: Edge damage value × Length of segment × 0.533
 */
export function calculateEdgeDamageArea(
  edgeDamage: EdgeDamageType,
  segmentLengthM: number
): number {
  const edgeValue = getEdgeDamageValue(edgeDamage);
  return edgeValue * segmentLengthM * 0.533;
}

/**
 * Calculate pothole area in square meters using specific pothole area ranges
 * Formula: Midpoint% × (Stationing to - Stationing from) × Pavement width
 */
export function calculatePotholeArea(
  percentageRange: PotholeAreaPercentageRange,
  segmentLengthM: number,
  pavementWidthM: number
): number {
  const percentage = getPotholeAreaPercentageValue(percentageRange);
  return (percentage / 100) * segmentLengthM * pavementWidthM;
}
