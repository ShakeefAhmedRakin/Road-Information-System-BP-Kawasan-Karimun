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
import { useMemo } from "react";
import { useFormContext } from "react-hook-form";

type DamageDataPath = string;

interface DamageSelectFieldProps {
  name: string;
  label: string;
  options: readonly string[];
  placeholder?: string;
  disabled?: boolean;
}

const formatLabel = (value: string) =>
  value.replace(/_/g, " ").replace(/\b\w/g, (char) => char.toUpperCase());

function DamageSelectField({
  name,
  label,
  options,
  placeholder,
  disabled,
}: DamageSelectFieldProps) {
  const form = useFormContext();

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
              value={field.value ?? undefined}
              disabled={disabled}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder={placeholder ?? `Select ${label}`} />
              </SelectTrigger>
              <SelectContent>
                {options.map((option) => (
                  <SelectItem key={option} value={option}>
                    {formatLabel(option)}
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

function AsphaltDamageForm() {
  const form = useFormContext();
  const disabled = form.formState.isSubmitting;

  const fields = useMemo(
    () => [
      {
        name: "damageAssessment.data.surfaceCondition" as DamageDataPath,
        label: "Surface Condition",
        options: SURFACE_CONDITIONS,
      },
      {
        name: "damageAssessment.data.bleeding",
        label: "Bleeding",
        options: DAMAGE_PERCENTAGE_RANGES,
      },
      {
        name: "damageAssessment.data.disintegration",
        label: "Disintegration",
        options: DAMAGE_PERCENTAGE_RANGES,
      },
      {
        name: "damageAssessment.data.crackType",
        label: "Crack Type",
        options: CRACK_TYPES,
      },
      {
        name: "damageAssessment.data.averageCrackWidth",
        label: "Average Crack Width",
        options: CRACK_WIDTH_TYPES,
      },
      {
        name: "damageAssessment.data.otherCrackArea",
        label: "Other Crack Area",
        options: DAMAGE_PERCENTAGE_RANGES,
      },
      {
        name: "damageAssessment.data.reflectiveCracking",
        label: "Reflective Cracking",
        options: DAMAGE_PERCENTAGE_RANGES,
      },
      {
        name: "damageAssessment.data.numberOfPotholes",
        label: "Pothole Count",
        options: POTHOLE_COUNT_TYPES,
      },
      {
        name: "damageAssessment.data.potholeSize",
        label: "Pothole Size",
        options: POTHOLE_SIZE_TYPES,
      },
      {
        name: "damageAssessment.data.potholeArea",
        label: "Pothole Area",
        options: POTHOLE_AREA_PERCENTAGE_RANGES,
      },
      {
        name: "damageAssessment.data.rutting",
        label: "Rutting",
        options: DAMAGE_PERCENTAGE_RANGES,
      },
      {
        name: "damageAssessment.data.averageRutDepth",
        label: "Average Rut Depth",
        options: RUT_DEPTH_TYPES,
      },
      {
        name: "damageAssessment.data.edgeDamageLeft",
        label: "Edge Damage (Left)",
        options: EDGE_DAMAGE_TYPES,
      },
      {
        name: "damageAssessment.data.edgeDamageRight",
        label: "Edge Damage (Right)",
        options: EDGE_DAMAGE_TYPES,
      },
    ],
    []
  );

  return (
    <div className="">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {fields.map((field) => (
          <DamageSelectField
            key={field.name}
            name={field.name}
            label={field.label}
            options={field.options}
            disabled={disabled}
          />
        ))}
      </div>
    </div>
  );
}

function ConcreteDamageForm() {
  const form = useFormContext();
  const disabled = form.formState.isSubmitting;

  return (
    <div className="">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <DamageSelectField
          name="damageAssessment.data.cracking"
          label="Cracking"
          options={DAMAGE_PERCENTAGE_RANGES}
          disabled={disabled}
        />
        <DamageSelectField
          name="damageAssessment.data.spalling"
          label="Spalling"
          options={DAMAGE_PERCENTAGE_RANGES}
          disabled={disabled}
        />
        <DamageSelectField
          name="damageAssessment.data.structuralCracking"
          label="Structural Cracking"
          options={DAMAGE_PERCENTAGE_RANGES}
          disabled={disabled}
        />
        <DamageSelectField
          name="damageAssessment.data.faulting"
          label="Faulting"
          options={DAMAGE_PERCENTAGE_RANGES}
          disabled={disabled}
        />
        <DamageSelectField
          name="damageAssessment.data.pumping"
          label="Pumping"
          options={YES_NO_TYPES}
          disabled={disabled}
        />
        <DamageSelectField
          name="damageAssessment.data.cornerBreak"
          label="Corner Break"
          options={YES_NO_TYPES}
          disabled={disabled}
        />
      </div>
    </div>
  );
}

function BlockDamageForm() {
  const form = useFormContext();
  const disabled = form.formState.isSubmitting;

  return (
    <div className="">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <DamageSelectField
          name="damageAssessment.data.reflectiveCracking"
          label="Reflective Cracking"
          options={DAMAGE_PERCENTAGE_RANGES}
          disabled={disabled}
        />
        <DamageSelectField
          name="damageAssessment.data.disintegration"
          label="Disintegration"
          options={DAMAGE_PERCENTAGE_RANGES}
          disabled={disabled}
        />
        <DamageSelectField
          name="damageAssessment.data.edgeDamageLeft"
          label="Edge Damage (Left)"
          options={EDGE_DAMAGE_TYPES}
          disabled={disabled}
        />
        <DamageSelectField
          name="damageAssessment.data.edgeDamageRight"
          label="Edge Damage (Right)"
          options={EDGE_DAMAGE_TYPES}
          disabled={disabled}
        />
        <DamageSelectField
          name="damageAssessment.data.potholeArea"
          label="Pothole Area"
          options={DAMAGE_PERCENTAGE_RANGES}
          disabled={disabled}
        />
        <DamageSelectField
          name="damageAssessment.data.rutting"
          label="Rutting"
          options={DAMAGE_PERCENTAGE_RANGES}
          disabled={disabled}
        />
      </div>
    </div>
  );
}

function UnpavedDamageForm() {
  const form = useFormContext();
  const disabled = form.formState.isSubmitting;

  return (
    <div className="">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <DamageSelectField
          name="damageAssessment.data.crossfallCondition"
          label="Crossfall Condition"
          options={CROSSFALL_CONDITIONS}
          disabled={disabled}
        />
        <DamageSelectField
          name="damageAssessment.data.crossfallArea"
          label="Crossfall Area"
          options={DAMAGE_PERCENTAGE_RANGES}
          disabled={disabled}
        />
        <DamageSelectField
          name="damageAssessment.data.settlement"
          label="Settlement"
          options={DAMAGE_PERCENTAGE_RANGES}
          disabled={disabled}
        />
        <DamageSelectField
          name="damageAssessment.data.erosion"
          label="Erosion"
          options={DAMAGE_PERCENTAGE_RANGES}
          disabled={disabled}
        />
        <DamageSelectField
          name="damageAssessment.data.largestParticleSize"
          label="Largest Particle Size"
          options={PARTICLE_SIZE_TYPES}
          disabled={disabled}
        />
        <DamageSelectField
          name="damageAssessment.data.gravelThickness"
          label="Gravel Thickness"
          options={GRAVEL_THICKNESS_TYPES}
          disabled={disabled}
        />
        <DamageSelectField
          name="damageAssessment.data.gravelArea"
          label="Gravel Area"
          options={DAMAGE_PERCENTAGE_RANGES}
          disabled={disabled}
        />
        <DamageSelectField
          name="damageAssessment.data.gravelDistribution"
          label="Gravel Distribution"
          options={GRAVEL_DISTRIBUTION_TYPES}
          disabled={disabled}
        />
        <DamageSelectField
          name="damageAssessment.data.corrugation"
          label="Corrugation"
          options={DAMAGE_PERCENTAGE_RANGES}
          disabled={disabled}
        />
        <DamageSelectField
          name="damageAssessment.data.numberOfPotholes"
          label="Pothole Count"
          options={POTHOLE_COUNT_TYPES}
          disabled={disabled}
        />
        <DamageSelectField
          name="damageAssessment.data.potholeSize"
          label="Pothole Size"
          options={POTHOLE_SIZE_TYPES}
          disabled={disabled}
        />
        <DamageSelectField
          name="damageAssessment.data.potholeArea"
          label="Pothole Area"
          options={POTHOLE_AREA_PERCENTAGE_RANGES}
          disabled={disabled}
        />
        <DamageSelectField
          name="damageAssessment.data.rutting"
          label="Rutting"
          options={DAMAGE_PERCENTAGE_RANGES}
          disabled={disabled}
        />
        <DamageSelectField
          name="damageAssessment.data.averageRutDepth"
          label="Average Rut Depth"
          options={UNPAVED_RUT_DEPTH_TYPES}
          disabled={disabled}
        />
      </div>
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
