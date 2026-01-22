"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import {
  damageAssessmentSchema,
  DRAINAGE_TYPES,
  LAND_USE_TYPES,
  PAVEMENT_TYPES,
  SHOULDER_TYPES,
  SHOULDER_WIDTHS,
  TERRAIN_TYPES,
} from "@repo/shared";
import { forwardRef, useEffect, useImperativeHandle, useMemo } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { z } from "zod";
import SegmentForms from "../../../manage-roads/_components/forms/segment-forms";

import { useTranslation } from "@/i18n/hooks/useTranslation";
import { getDefaultDamageAssessment } from "@/lib/damage-assessment";
import { orpc } from "@/utils/orpc";
import { useMutation } from "@tanstack/react-query";
import type { ReadRoadSegmentType } from "api/src/modules/segment/segment.schema";
import { toast } from "sonner";

const updateSegmentSchema = z.object({
  // Pavement Inventory
  pavementType: z.enum(PAVEMENT_TYPES),
  pavementWidthM: z.number().positive(),
  carriagewayWidthM: z.number().positive().optional(),
  rightOfWayWidthM: z.number().positive(),
  terrain: z.enum(TERRAIN_TYPES),
  notPassable: z.boolean(),
  // Left side attributes
  leftShoulderType: z.enum(SHOULDER_TYPES),
  leftShoulderWidthM: z.enum(SHOULDER_WIDTHS),
  leftDrainageType: z.enum(DRAINAGE_TYPES),
  leftLandUseType: z.enum(LAND_USE_TYPES),
  // Right side attributes
  rightShoulderType: z.enum(SHOULDER_TYPES),
  rightShoulderWidthM: z.enum(SHOULDER_WIDTHS),
  rightDrainageType: z.enum(DRAINAGE_TYPES),
  rightLandUseType: z.enum(LAND_USE_TYPES),
  // Damage assessment data
  damageAssessment: damageAssessmentSchema,
});

type UpdateSegmentFormData = z.infer<typeof updateSegmentSchema>;

interface SegmentFormProps {
  segment: ReadRoadSegmentType;
  allSegments: ReadRoadSegmentType[];
  onUpdateSuccess?: () => void;
  onDirtyStateChange?: (segmentId: string, isDirty: boolean) => void;
}

const buildSegmentFormValues = (
  segment: ReadRoadSegmentType
): UpdateSegmentFormData => ({
  pavementType: segment.pavementType,
  pavementWidthM: Number(segment.pavementWidthM),
  carriagewayWidthM: segment.carriagewayWidthM
    ? Number(segment.carriagewayWidthM)
    : undefined,
  rightOfWayWidthM: Number(segment.rightOfWayWidthM),
  terrain: segment.terrain,
  notPassable: segment.notPassable,
  leftShoulderType: segment.leftShoulderType,
  leftShoulderWidthM: segment.leftShoulderWidthM,
  leftDrainageType: segment.leftDrainageType,
  leftLandUseType: segment.leftLandUseType,
  rightShoulderType: segment.rightShoulderType,
  rightShoulderWidthM: segment.rightShoulderWidthM,
  rightDrainageType: segment.rightDrainageType,
  rightLandUseType: segment.rightLandUseType,
  damageAssessment:
    segment.damageAssessment ||
    getDefaultDamageAssessment(segment.pavementType),
});

export type SegmentFormHandle = {
  saveChanges: () => Promise<void>;
  discardChanges: () => void;
  copyFromSegment: (sourceSegmentId: string) => void;
};

const SegmentForm = forwardRef<SegmentFormHandle, SegmentFormProps>(
  ({ segment, allSegments, onUpdateSuccess, onDirtyStateChange }, ref) => {
    const { t } = useTranslation("roadDetails");
    const defaultValues = useMemo(
      () => buildSegmentFormValues(segment),
      [segment]
    );

    const form = useForm<UpdateSegmentFormData>({
      resolver: zodResolver(updateSegmentSchema),
      mode: "onChange",
      reValidateMode: "onChange",
      defaultValues,
    });

    useEffect(() => {
      form.reset(defaultValues);
    }, [defaultValues, form]);

    const watchedPavementType = form.watch("pavementType");

    const updateSegmentMutation = useMutation(
      orpc.segment.updateSegment.mutationOptions()
    );

    // Update damage assessment when pavement type changes
    useEffect(() => {
      const currentDamageAssessment = form.getValues("damageAssessment");
      if (
        currentDamageAssessment &&
        typeof currentDamageAssessment === "object" &&
        "pavementType" in currentDamageAssessment &&
        currentDamageAssessment.pavementType !== watchedPavementType
      ) {
        const newDamageAssessment =
          getDefaultDamageAssessment(watchedPavementType);
        form.setValue("damageAssessment", newDamageAssessment, {
          shouldDirty: true,
          shouldValidate: true,
        });
      }
    }, [watchedPavementType, form]);

    useEffect(() => {
      onDirtyStateChange?.(segment.id, form.formState.isDirty);
    }, [form.formState.isDirty, onDirtyStateChange, segment.id]);

    useEffect(() => {
      return () => {
        onDirtyStateChange?.(segment.id, false);
      };
    }, [onDirtyStateChange, segment.id]);

    const submitSegment = async (values: UpdateSegmentFormData) => {
      const toastId = `segment-${segment.id}-save`;
      toast.loading(t("segmentForm.toasts.saving", { number: segment.segmentNumber }), {
        id: toastId,
      });

      try {
        await updateSegmentMutation.mutateAsync({
          segmentId: segment.id,
          ...values,
        });

        form.reset(values);

        toast.success(t("segmentForm.toasts.saved", { number: segment.segmentNumber }), {
          id: toastId,
        });

        onUpdateSuccess?.();
      } catch (error) {
        console.error("Error updating segment:", error);
        toast.error(t("segmentForm.toasts.saveFailed"), {
          id: toastId,
        });
        throw error;
      } finally {
        setTimeout(() => toast.dismiss(toastId), 1500);
      }
    };

    const saveSegment = async () => {
      let validationFailed = false;

      try {
        await form.handleSubmit(
          async (values) => {
            await submitSegment(values);
          },
          () => {
            validationFailed = true;
            toast.error(t("segmentForm.toasts.fixErrors"));
          }
        )();
      } catch (error) {
        throw error;
      }

      if (validationFailed) {
        throw new Error("Validation failed");
      }
    };

    const discardSegment = () => {
      form.reset();
      toast.info(t("segmentForm.toasts.discarded", { number: segment.segmentNumber }));
    };

    const copyFromSegment = (sourceSegmentId: string) => {
      const sourceSegment = allSegments.find((s) => s.id === sourceSegmentId);
      if (!sourceSegment) {
        toast.error(t("segmentForm.toasts.sourceNotFound"));
        return;
      }

      const sourceValues = buildSegmentFormValues(sourceSegment);

      // Set all values from the source segment
      Object.entries(sourceValues).forEach(([key, value]) => {
        form.setValue(key as keyof UpdateSegmentFormData, value, {
          shouldDirty: true,
          shouldValidate: true,
        });
      });

      toast.success(
        t("segmentForm.toasts.copied", {
          source: sourceSegment.segmentNumber,
          target: segment.segmentNumber,
        })
      );
    };

    useImperativeHandle(ref, () => ({
      saveChanges: saveSegment,
      discardChanges: discardSegment,
      copyFromSegment,
    }));

    return (
      <div className="space-y-4 p-4">
        <FormProvider {...form}>
          <form
            className="space-y-6"
            onSubmit={(event) => {
              event.preventDefault();
            }}
          >
            {/* Segment Attributes */}
            <SegmentForms />
          </form>
        </FormProvider>
      </div>
    );
  }
);

SegmentForm.displayName = "SegmentForm";

export default SegmentForm;
