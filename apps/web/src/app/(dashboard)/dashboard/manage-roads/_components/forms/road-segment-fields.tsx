"use client";

import { Checkbox } from "@/components/ui/checkbox";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useTranslation } from "@/i18n/hooks/useTranslation";
import { Separator } from "@/components/ui/separator";
import { paragraphVariants } from "@/components/ui/typography";
import { SEGMENT_GENERATION_MODES } from "@repo/shared";
import { AudioWaveform, Hash, Ruler, Settings } from "lucide-react";
import { useFormContext } from "react-hook-form";

export default function RoadSegmentFields() {
  const { t } = useTranslation("createRoad");
  const form = useFormContext();
  return (
    <div className="max-w-4xl space-y-2">
      <h3
        className={paragraphVariants({
          size: "lg",
          className: "font-medium",
        })}
      >
        {t("roadSegmentFields.title")}
      </h3>
      <Separator />
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {/* Road Name */}
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem className="flex h-full flex-1 flex-col justify-between">
              <div>
                <FormLabel>{t("roadSegmentFields.roadName.label")}</FormLabel>
              </div>
              <FormControl>
                <InputGroup>
                  <InputGroupAddon>
                    <AudioWaveform className="size-3.5" />
                  </InputGroupAddon>
                  <InputGroupInput
                    placeholder={t("roadSegmentFields.roadName.placeholder")}
                    disabled={form.formState.isSubmitting}
                    {...field}
                  />
                </InputGroup>
              </FormControl>
            </FormItem>
          )}
        />

        {/* Road Number */}
        <FormField
          control={form.control}
          name="number"
          render={({ field }) => (
            <FormItem className="flex h-full flex-1 flex-col justify-between">
              <div>
                <FormLabel>{t("roadSegmentFields.roadNumber.label")}</FormLabel>
              </div>
              <FormControl>
                <InputGroup>
                  <InputGroupAddon>
                    <Hash className="size-3.5" />
                  </InputGroupAddon>
                  <InputGroupInput
                    placeholder={t("roadSegmentFields.roadNumber.placeholder")}
                    disabled={form.formState.isSubmitting}
                    {...field}
                  />
                </InputGroup>
              </FormControl>
            </FormItem>
          )}
        />

        {/* Total Length */}
        <FormField
          control={form.control}
          name="totalLengthKm"
          render={({ field }) => (
            <FormItem className="flex h-full flex-1 flex-col justify-between">
              <div>
                <FormLabel>{t("roadSegmentFields.roadLength.label")}</FormLabel>
                <FormDescription>
                  {t("roadSegmentFields.roadLength.description")}
                </FormDescription>
              </div>
              <FormControl>
                <InputGroup>
                  <InputGroupAddon>
                    <Ruler className="size-3.5" />
                  </InputGroupAddon>
                  <InputGroupInput
                    {...field}
                    type="number"
                    placeholder={t("roadSegmentFields.roadLength.placeholder")}
                    disabled={form.formState.isSubmitting}
                    value={field.value ?? ""}
                    onChange={(e) =>
                      field.onChange(parseFloat(e.target.value) || 0)
                    }
                  />
                  <InputGroupAddon align="inline-end">
                    <span className="text-muted-foreground text-sm">km</span>
                  </InputGroupAddon>
                </InputGroup>
              </FormControl>
            </FormItem>
          )}
        />

        {/* Segment Interval (Fixed to 100m) */}
        <FormField
          control={form.control}
          name="segmentIntervalM"
          render={({ field }) => (
            <FormItem className="flex h-full flex-1 flex-col justify-between">
              <div>
                <FormLabel>{t("roadSegmentFields.segmentInterval.label")}</FormLabel>
                <FormDescription>
                  {t("roadSegmentFields.segmentInterval.description")}
                </FormDescription>
              </div>
              <FormControl>
                <InputGroup className="self-end">
                  <InputGroupAddon>
                    <Ruler className="size-3.5" />
                  </InputGroupAddon>
                  <InputGroupInput
                    {...field}
                    type="number"
                    placeholder={t("roadSegmentFields.segmentInterval.placeholder")}
                    value={100}
                    disabled={true}
                    readOnly={true}
                    className="cursor-not-allowed opacity-60"
                  />
                  <InputGroupAddon align="inline-end">
                    <span className="text-muted-foreground text-sm">m</span>
                  </InputGroupAddon>
                </InputGroup>
              </FormControl>
            </FormItem>
          )}
        />

        {/* Segment Generation Mode */}
        <FormField
          control={form.control}
          name="segmentGenerationMode"
          render={({ field }) => (
            <FormItem className="flex h-full flex-1 flex-col justify-between">
              <div>
                <FormLabel>{t("roadSegmentFields.segmentGenerationMode.label")}</FormLabel>
                <FormDescription>
                  {t("roadSegmentFields.segmentGenerationMode.description")}
                </FormDescription>
              </div>
              <FormControl>
                <Select
                  onValueChange={field.onChange}
                  value={field.value || ""}
                  disabled={form.formState.isSubmitting}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder={t("roadSegmentFields.segmentGenerationMode.placeholder")} />
                  </SelectTrigger>
                  <SelectContent>
                    {SEGMENT_GENERATION_MODES.map((mode) => (
                      <SelectItem key={mode} value={mode}>
                        <div className="flex items-center gap-2">
                          <Settings className="size-3.5" />
                          <span>{t(`enums.segmentGenerationMode.${mode}`)}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormControl>
            </FormItem>
          )}
        />
      </div>

      {/* Visibility */}
      <FormField
        control={form.control}
        name="isVisibleByVisitors"
        render={({ field }) => (
          <FormItem className="mt-4 flex flex-row items-start space-y-0 space-x-3">
            <FormControl>
              <Checkbox
                checked={field.value}
                onCheckedChange={field.onChange}
                disabled={form.formState.isSubmitting}
              />
            </FormControl>
            <div className="space-y-1 leading-none">
              <FormLabel>{t("roadSegmentFields.visibleToVisitors.label")}</FormLabel>
              <FormDescription>
                {t("roadSegmentFields.visibleToVisitors.description")}
              </FormDescription>
            </div>
          </FormItem>
        )}
      />
    </div>
  );
}
