"use client";

import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useTranslation } from "@/i18n/hooks/useTranslation";
import {
  CRACK_TYPES,
  CRACK_WIDTH_TYPES,
  CROSSFALL_CONDITIONS,
  DAMAGE_PERCENTAGE_RANGES,
  EDGE_DAMAGE_TYPES,
  GRAVEL_DISTRIBUTION_TYPES,
  GRAVEL_THICKNESS_TYPES,
  PARTICLE_SIZE_TYPES,
  PAVEMENT_TYPES,
  POTHOLE_AREA_PERCENTAGE_RANGES,
  POTHOLE_COUNT_TYPES,
  POTHOLE_SIZE_TYPES,
  RUT_DEPTH_TYPES,
  SURFACE_CONDITIONS,
  UNPAVED_RUT_DEPTH_TYPES,
  YES_NO_TYPES,
} from "@repo/shared";
import { useFormContext } from "react-hook-form";

interface DamageSelectFieldProps {
  name: string;
  label: string;
  options: readonly string[];
  placeholder?: string;
  disabled?: boolean;
  enumType?: string;
}

function DamageSelectField({
  name,
  label,
  options,
  placeholder,
  disabled,
  enumType,
}: DamageSelectFieldProps & { enumType?: string }) {
  const { t } = useTranslation("createRoad");
  const form = useFormContext();

  const getEnumTranslationKey = (value: string, enumType?: string): string => {
    if (!enumType) {
      // Fallback to formatLabel for unknown enum types
      return value.replace(/_/g, " ").replace(/\b\w/g, (char) => char.toUpperCase());
    }
    return t(`enums.${enumType}.${value}`, undefined) || value.replace(/_/g, " ").replace(/\b\w/g, (char) => char.toUpperCase());
  };

  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel>{label}</FormLabel>
          <FormControl>
            <Select
              onValueChange={field.onChange}
              value={field.value || ""}
              disabled={disabled}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder={placeholder ?? `Select ${label}`} />
              </SelectTrigger>
              <SelectContent>
                {options.map((option) => (
                  <SelectItem key={option} value={option}>
                    {getEnumTranslationKey(option, enumType)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </FormControl>
        </FormItem>
      )}
    />
  );
}

interface DamageSectionProps {
  title: string;
  children: React.ReactNode;
}

function DamageSection({ title, children }: DamageSectionProps) {
  return (
    <div className="space-y-4">
      <h3 className="text-foreground border-b pb-2 text-lg font-semibold">
        {title}
      </h3>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">{children}</div>
    </div>
  );
}

function AsphaltDamageForm() {
  const { t } = useTranslation("createRoad");
  const form = useFormContext();
  const disabled = form.formState.isSubmitting;

  return (
    <div className="space-y-6">
      <DamageSection title={t("damageAssessment.sections.surfaceCondition")}>
        <DamageSelectField
          name="damageAssessment.data.surfaceCondition"
          label={t("damageAssessment.fields.surfaceCondition")}
          options={SURFACE_CONDITIONS}
          disabled={disabled}
          enumType="surfaceCondition"
        />
        <DamageSelectField
          name="damageAssessment.data.bleeding"
          label={t("damageAssessment.fields.bleeding")}
          options={DAMAGE_PERCENTAGE_RANGES}
          disabled={disabled}
          enumType="damagePercentageRange"
        />
        <DamageSelectField
          name="damageAssessment.data.disintegration"
          label={t("damageAssessment.fields.disintegration")}
          options={DAMAGE_PERCENTAGE_RANGES}
          disabled={disabled}
          enumType="damagePercentageRange"
        />
      </DamageSection>

      <DamageSection title={t("damageAssessment.sections.crackDamage")}>
        <DamageSelectField
          name="damageAssessment.data.crackType"
          label={t("damageAssessment.fields.crackType")}
          options={CRACK_TYPES}
          disabled={disabled}
          enumType="crackType"
        />
        <DamageSelectField
          name="damageAssessment.data.averageCrackWidth"
          label={t("damageAssessment.fields.averageCrackWidth")}
          options={CRACK_WIDTH_TYPES}
          disabled={disabled}
          enumType="crackWidthType"
        />
        <DamageSelectField
          name="damageAssessment.data.otherCrackArea"
          label={t("damageAssessment.fields.otherCrackArea")}
          options={DAMAGE_PERCENTAGE_RANGES}
          disabled={disabled}
          enumType="damagePercentageRange"
        />
        <DamageSelectField
          name="damageAssessment.data.reflectiveCracking"
          label={t("damageAssessment.fields.reflectiveCracking")}
          options={DAMAGE_PERCENTAGE_RANGES}
          disabled={disabled}
          enumType="damagePercentageRange"
        />
      </DamageSection>

      <DamageSection title={t("damageAssessment.sections.potholeDamage")}>
        <DamageSelectField
          name="damageAssessment.data.numberOfPotholes"
          label={t("damageAssessment.fields.numberOfPotholes")}
          options={POTHOLE_COUNT_TYPES}
          disabled={disabled}
          enumType="potholeCountType"
        />
        <DamageSelectField
          name="damageAssessment.data.potholeSize"
          label={t("damageAssessment.fields.potholeSize")}
          options={POTHOLE_SIZE_TYPES}
          disabled={disabled}
          enumType="potholeSizeType"
        />
        <DamageSelectField
          name="damageAssessment.data.potholeArea"
          label={t("damageAssessment.fields.potholeArea")}
          options={POTHOLE_AREA_PERCENTAGE_RANGES}
          disabled={disabled}
          enumType="potholeAreaPercentageRange"
        />
      </DamageSection>

      <DamageSection title={t("damageAssessment.sections.ruttingDamage")}>
        <DamageSelectField
          name="damageAssessment.data.rutting"
          label={t("damageAssessment.fields.rutting")}
          options={DAMAGE_PERCENTAGE_RANGES}
          disabled={disabled}
          enumType="damagePercentageRange"
        />
        <DamageSelectField
          name="damageAssessment.data.averageRutDepth"
          label={t("damageAssessment.fields.averageRutDepth")}
          options={RUT_DEPTH_TYPES}
          disabled={disabled}
          enumType="rutDepthType"
        />
      </DamageSection>

      <DamageSection title={t("damageAssessment.sections.edgeDamage")}>
        <DamageSelectField
          name="damageAssessment.data.edgeDamageLeft"
          label={t("damageAssessment.fields.leftEdgeDamage")}
          options={EDGE_DAMAGE_TYPES}
          disabled={disabled}
          enumType="edgeDamageType"
        />
        <DamageSelectField
          name="damageAssessment.data.edgeDamageRight"
          label={t("damageAssessment.fields.rightEdgeDamage")}
          options={EDGE_DAMAGE_TYPES}
          disabled={disabled}
          enumType="edgeDamageType"
        />
      </DamageSection>
    </div>
  );
}

function ConcreteDamageForm() {
  const { t } = useTranslation("createRoad");
  const form = useFormContext();
  const disabled = form.formState.isSubmitting;

  return (
    <div className="space-y-6">
      <DamageSection title={t("damageAssessment.sections.structuralSurfaceDamage")}>
        <DamageSelectField
          name="damageAssessment.data.cracking"
          label={t("damageAssessment.fields.cracking")}
          options={DAMAGE_PERCENTAGE_RANGES}
          disabled={disabled}
          enumType="damagePercentageRange"
        />
        <DamageSelectField
          name="damageAssessment.data.spalling"
          label={t("damageAssessment.fields.spalling")}
          options={DAMAGE_PERCENTAGE_RANGES}
          disabled={disabled}
          enumType="damagePercentageRange"
        />
        <DamageSelectField
          name="damageAssessment.data.structuralCracking"
          label={t("damageAssessment.fields.structuralCracking")}
          options={DAMAGE_PERCENTAGE_RANGES}
          disabled={disabled}
          enumType="damagePercentageRange"
        />
        <DamageSelectField
          name="damageAssessment.data.faulting"
          label={t("damageAssessment.fields.faulting")}
          options={DAMAGE_PERCENTAGE_RANGES}
          disabled={disabled}
          enumType="damagePercentageRange"
        />
      </DamageSection>

      <DamageSection title={t("damageAssessment.sections.waterJointDamage")}>
        <DamageSelectField
          name="damageAssessment.data.pumping"
          label={t("damageAssessment.fields.pumping")}
          options={YES_NO_TYPES}
          disabled={disabled}
          enumType="yesNoType"
        />
        <DamageSelectField
          name="damageAssessment.data.cornerBreak"
          label={t("damageAssessment.fields.cornerBreak")}
          options={YES_NO_TYPES}
          disabled={disabled}
          enumType="yesNoType"
        />
      </DamageSection>
    </div>
  );
}

function BlockDamageForm() {
  const { t } = useTranslation("createRoad");
  const form = useFormContext();
  const disabled = form.formState.isSubmitting;

  return (
    <div className="space-y-6">
      <DamageSection title={t("damageAssessment.sections.surfaceDamage")}>
        <DamageSelectField
          name="damageAssessment.data.reflectiveCracking"
          label={t("damageAssessment.fields.reflectiveCracking")}
          options={DAMAGE_PERCENTAGE_RANGES}
          disabled={disabled}
          enumType="damagePercentageRange"
        />
        <DamageSelectField
          name="damageAssessment.data.disintegration"
          label={t("damageAssessment.fields.disintegration")}
          options={DAMAGE_PERCENTAGE_RANGES}
          disabled={disabled}
          enumType="damagePercentageRange"
        />
      </DamageSection>

      <DamageSection title={t("damageAssessment.sections.edgeDamage")}>
        <DamageSelectField
          name="damageAssessment.data.edgeDamageLeft"
          label={t("damageAssessment.fields.leftEdgeDamage")}
          options={EDGE_DAMAGE_TYPES}
          disabled={disabled}
          enumType="edgeDamageType"
        />
        <DamageSelectField
          name="damageAssessment.data.edgeDamageRight"
          label={t("damageAssessment.fields.rightEdgeDamage")}
          options={EDGE_DAMAGE_TYPES}
          disabled={disabled}
          enumType="edgeDamageType"
        />
      </DamageSection>

      <DamageSection title={t("damageAssessment.sections.potholeDeformation")}>
        <DamageSelectField
          name="damageAssessment.data.potholeArea"
          label={t("damageAssessment.fields.potholeArea")}
          options={DAMAGE_PERCENTAGE_RANGES}
          disabled={disabled}
          enumType="damagePercentageRange"
        />
        <DamageSelectField
          name="damageAssessment.data.rutting"
          label={t("damageAssessment.fields.rutting")}
          options={DAMAGE_PERCENTAGE_RANGES}
          disabled={disabled}
          enumType="damagePercentageRange"
        />
      </DamageSection>
    </div>
  );
}

function UnpavedDamageForm() {
  const { t } = useTranslation("createRoad");
  const form = useFormContext();
  const disabled = form.formState.isSubmitting;

  return (
    <div className="space-y-6">
      <DamageSection title={t("damageAssessment.sections.crossfallShape")}>
        <DamageSelectField
          name="damageAssessment.data.crossfallCondition"
          label={t("damageAssessment.fields.crossfallCondition")}
          options={CROSSFALL_CONDITIONS}
          disabled={disabled}
          enumType="crossfallCondition"
        />
        <DamageSelectField
          name="damageAssessment.data.crossfallArea"
          label={t("damageAssessment.fields.area")}
          options={DAMAGE_PERCENTAGE_RANGES}
          disabled={disabled}
          enumType="damagePercentageRange"
        />
      </DamageSection>

      <DamageSection title={t("damageAssessment.sections.surfaceFailure")}>
        <DamageSelectField
          name="damageAssessment.data.settlement"
          label={t("damageAssessment.fields.settlement")}
          options={DAMAGE_PERCENTAGE_RANGES}
          disabled={disabled}
          enumType="damagePercentageRange"
        />
        <DamageSelectField
          name="damageAssessment.data.erosion"
          label={t("damageAssessment.fields.erosion")}
          options={DAMAGE_PERCENTAGE_RANGES}
          disabled={disabled}
          enumType="damagePercentageRange"
        />
      </DamageSection>

      <DamageSection title={t("damageAssessment.sections.materialQuality")}>
        <DamageSelectField
          name="damageAssessment.data.largestParticleSize"
          label={t("damageAssessment.fields.largestParticleSize")}
          options={PARTICLE_SIZE_TYPES}
          disabled={disabled}
          enumType="particleSizeType"
        />
        <DamageSelectField
          name="damageAssessment.data.gravelThickness"
          label={t("damageAssessment.fields.gravelThickness")}
          options={GRAVEL_THICKNESS_TYPES}
          disabled={disabled}
          enumType="gravelThicknessType"
        />
        <DamageSelectField
          name="damageAssessment.data.gravelArea"
          label={t("damageAssessment.fields.gravelArea")}
          options={DAMAGE_PERCENTAGE_RANGES}
          disabled={disabled}
          enumType="damagePercentageRange"
        />
        <DamageSelectField
          name="damageAssessment.data.gravelDistribution"
          label={t("damageAssessment.fields.gravelDistribution")}
          options={GRAVEL_DISTRIBUTION_TYPES}
          disabled={disabled}
          enumType="gravelDistributionType"
        />
      </DamageSection>

      <DamageSection title={t("damageAssessment.sections.corrugationDeformation")}>
        <DamageSelectField
          name="damageAssessment.data.corrugation"
          label={t("damageAssessment.fields.corrugation")}
          options={DAMAGE_PERCENTAGE_RANGES}
          disabled={disabled}
          enumType="damagePercentageRange"
        />
        <DamageSelectField
          name="damageAssessment.data.rutting"
          label={t("damageAssessment.fields.rutting")}
          options={DAMAGE_PERCENTAGE_RANGES}
          disabled={disabled}
          enumType="damagePercentageRange"
        />
        <DamageSelectField
          name="damageAssessment.data.averageRutDepth"
          label={t("damageAssessment.fields.averageRutDepth")}
          options={UNPAVED_RUT_DEPTH_TYPES}
          disabled={disabled}
          enumType="unpavedRutDepthType"
        />
      </DamageSection>

      <DamageSection title={t("damageAssessment.sections.potholeDamage")}>
        <DamageSelectField
          name="damageAssessment.data.numberOfPotholes"
          label={t("damageAssessment.fields.numberOfPotholes")}
          options={POTHOLE_COUNT_TYPES}
          disabled={disabled}
          enumType="potholeCountType"
        />
        <DamageSelectField
          name="damageAssessment.data.potholeSize"
          label={t("damageAssessment.fields.potholeSize")}
          options={POTHOLE_SIZE_TYPES}
          disabled={disabled}
          enumType="potholeSizeType"
        />
        <DamageSelectField
          name="damageAssessment.data.potholeArea"
          label={t("damageAssessment.fields.potholeArea")}
          options={POTHOLE_AREA_PERCENTAGE_RANGES}
          disabled={disabled}
          enumType="potholeAreaPercentageRange"
        />
      </DamageSection>
    </div>
  );
}

export default function PavementDamageForms() {
  const form = useFormContext();
  const watchedType = form.watch("damageAssessment.pavementType") as
    | (typeof PAVEMENT_TYPES)[number]
    | undefined;

  switch (watchedType) {
    case "asphalt":
      return <AsphaltDamageForm />;
    case "concrete":
      return <ConcreteDamageForm />;
    case "block":
      return <BlockDamageForm />;
    case "unpaved":
    case "gravel":
      return <UnpavedDamageForm />;
    default:
      return null;
  }
}
