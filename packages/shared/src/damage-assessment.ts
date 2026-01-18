import { z } from "zod";

// ============================================================================
// DAMAGE ASSESSMENT ENUMS - Single source of truth for all damage types
// ============================================================================

// D. Surface condition types (Asphalt Pavement)
// Index: 1 = Good, 2 = Rough
export const SURFACE_CONDITIONS = ["good", "rough"] as const;

// C. Shared Percentage Range Index (used by most damage inputs)
// Index: 1 = 0-5%, 2 = 5-10%, 3 = 10-20%, 4 = 20-30%, 5 = 30-40%, 6 = 40-50%, 7 = >50%
// Note: "0%" is included for compatibility but index 1 is "0-5%"
export const DAMAGE_PERCENTAGE_RANGES = [
  "0%", // Index 0 (optional, for explicit 0%)
  "0-5%", // Index 1
  "5-10%", // Index 2
  "10-20%", // Index 3
  "20-30%", // Index 4
  "30-40%", // Index 5
  "40-50%", // Index 6
  ">50%", // Index 7
] as const;

// D. Pothole Area Percentage Ranges (Asphalt, Block, Unpaved/Gravel)
// Index: 1 = 0-3%, 2 = 3-5%, 3 = 5-10%, 4 = 10-20%, 5 = 20-30%, 6 = 30-40%, 7 = 40-50%, 8 = >50%
// Note: "0%" is included for compatibility but index 1 is "0-3%"
export const POTHOLE_AREA_PERCENTAGE_RANGES = [
  "0%", // Index 0 (optional, for explicit 0%)
  "0-3%", // Index 1
  "3-5%", // Index 2
  "5-10%", // Index 3
  "10-20%", // Index 4
  "20-30%", // Index 5
  "30-40%", // Index 6
  "40-50%", // Index 7
  ">50%", // Index 8
] as const;

// D. Crack types (Asphalt Pavement)
// Index: 1 = None, 2 = Interconnected (Wide Area), 3 = Interconnected (Narrow Area)
// Note: "not_connected" is included for compatibility but specification only lists interconnected types
export const CRACK_TYPES = [
  "none", // Index 0/1 = None
  "not_connected", // Additional value (not in spec)
  "interconnected_wide_area", // Index 2 = Interconnected (Wide Area)
  "interconnected_narrow_area", // Index 3 = Interconnected (Narrow Area)
] as const;

// D. Average crack width (Asphalt Pavement)
// Index: 1 = None, 2 = <1 mm, 3 = 1-5 mm, 4 = >5 mm
export const CRACK_WIDTH_TYPES = [
  "none", // Index 0/1 = None
  "<1mm", // Index 1/2 = <1 mm
  "1-5mm", // Index 2/3 = 1-5 mm
  ">5mm", // Index 3/4 = >5 mm
] as const;

// D. Number of potholes (Asphalt, Unpaved/Gravel)
// Index: 0 = 0, 1 = 1, 2 = 2, 3 = 3, 4 = 4, 5 = 5, 6 = 6, 7 = 7, 8 = >7
export const POTHOLE_COUNT_TYPES = [
  "0", // Index 0 = 0
  "1", // Index 1 = 1
  "2", // Index 2 = 2
  "3", // Index 3 = 3
  "4", // Index 4 = 4
  "5", // Index 5 = 5
  "6", // Index 6 = 6
  "7", // Index 7 = 7
  ">7", // Index 8 = >7
] as const;

// D. Pothole size (Asphalt, Unpaved/Gravel)
// Index: 1 = None, 2 = Small–Shallow, 3 = Small–Deep, 4 = Large–Shallow, 5 = Large–Deep
export const POTHOLE_SIZE_TYPES = [
  "none", // Index 0/1 = None
  "small_shallow", // Index 1/2 = Small–Shallow
  "small_deep", // Index 2/3 = Small–Deep
  "large_shallow", // Index 3/4 = Large–Shallow
  "large_deep", // Index 4/5 = Large–Deep
] as const;

// D. Average rut depth (Asphalt Pavement)
// Index: 1 = None, 2 = <1 cm, 3 = 1-3 cm, 4 = >3 cm
export const RUT_DEPTH_TYPES = [
  "none", // Index 0/1 = None
  "<1cm", // Index 1/2 = <1 cm
  "1-3cm", // Index 2/3 = 1-3 cm
  ">3cm", // Index 3/4 = >3 cm
] as const;

// D. Edge damage types (Left & Right) - Asphalt, Block
// Index: 0 = None, 1 = Light (0-30%), 2 = Severe (>30%)
export const EDGE_DAMAGE_TYPES = [
  "none", // Index 0 = None
  "light_0_30%", // Index 1 = Light (0-30%)
  "severe_>30%", // Index 2 = Severe (>30%)
] as const;

// E. Yes/No types (Concrete Pavement - Pumping, Corner Break)
// Index: 1 = Yes, 2 = No
export const YES_NO_TYPES = ["yes", "no"] as const;

// G. Crossfall condition types (Unpaved/Gravel)
// Index: 1 = >5%, 2 = 3-5%, 3 = Flat, 4 = Concave
export const CROSSFALL_CONDITIONS = [
  ">5%", // Index 0/1 = >5%
  "3-5%", // Index 1/2 = 3-5%
  "flat", // Index 2/3 = Flat
  "concave", // Index 3/4 = Concave
] as const;

// G. Largest particle size (Unpaved/Gravel)
// Index: 1 = <1 cm, 2 = 1-5 cm, 3 = >5 cm, 4 = Not Uniform
// Note: "none" is included for compatibility but specification starts at index 1
export const PARTICLE_SIZE_TYPES = [
  "none", // Index 0 (optional, for compatibility)
  "<1cm", // Index 1 = <1 cm
  "1-5cm", // Index 2 = 1-5 cm
  ">5cm", // Index 3 = >5 cm
  "not_uniform", // Index 4 = Not Uniform
] as const;

// G. Gravel thickness types (Unpaved/Gravel)
// Index: 1 = <5 cm, 2 = 5-10 cm, 3 = 10-20 cm, 4 = >20 cm
// Note: "none" is included for compatibility but specification starts at index 1
export const GRAVEL_THICKNESS_TYPES = [
  "none", // Index 0 (optional, for compatibility)
  "<5cm", // Index 1 = <5 cm
  "5-10cm", // Index 2 = 5-10 cm
  "10-20cm", // Index 3 = 10-20 cm
  ">20cm", // Index 4 = >20 cm
] as const;

// G. Gravel distribution types (Unpaved/Gravel)
// Index: 1 = None, 2 = Even, 3 = Uneven, 4 = Longitudinal Windrow
export const GRAVEL_DISTRIBUTION_TYPES = [
  "none", // Index 0/1 = None
  "even", // Index 1/2 = Even
  "uneven", // Index 2/3 = Uneven
  "longitudinal_windrow", // Index 3/4 = Longitudinal Windrow
] as const;

// G. Rut depth types for unpaved (different from paved)
// Index: 1 = None, 2 = <5 cm, 3 = 5-15 cm, 4 = >15 cm
export const UNPAVED_RUT_DEPTH_TYPES = [
  "none", // Index 0/1 = None
  "<5cm", // Index 1/2 = <5 cm
  "5-15cm", // Index 2/3 = 5-15 cm
  ">15cm", // Index 3/4 = >15 cm
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
  potholeArea: potholeAreaPercentageRangeSchema,

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
  potholeArea: potholeAreaPercentageRangeSchema,

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
