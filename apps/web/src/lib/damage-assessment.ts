import type { DamageAssessment, PavementType } from "@repo/shared";

export function getDefaultDamageAssessment(
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
        },
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
        },
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
        },
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
        },
      };

    case "gravel":
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
        },
      };

    default:
      return getDefaultDamageAssessment("asphalt");
  }
}
