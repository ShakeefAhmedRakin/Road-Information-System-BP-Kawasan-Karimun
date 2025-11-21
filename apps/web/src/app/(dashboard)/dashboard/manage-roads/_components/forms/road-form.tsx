"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { createRoadInputSchema } from "@repo/shared";
import { useEffect } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { z } from "zod";
import PavementDamageForms from "./pavement-damage-forms";

import { getDefaultDamageAssessment } from "@/lib/damage-assessment";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "../../../../../../components/ui/button";
import { StaticRoutes } from "../../../../../../config/static-routes";
import { orpc } from "../../../../../../utils/orpc";
import RoadSegmentFields from "./road-segment-fields";
import SegmentForms from "./segment-forms";

export default function RoadForm() {
  const router = useRouter();

  const form = useForm({
    resolver: zodResolver(createRoadInputSchema),
    mode: "onChange",
    reValidateMode: "onChange",
    defaultValues: {
      name: "",
      number: "",
      totalLengthKm: 0,
      segmentIntervalM: 100,
      pavementWidthM: 5,
      segmentGenerationMode: "exact",
      pavementType: "asphalt",
      carriagewayWidthM: 5,
      rightOfWayWidthM: 5,
      terrain: "flat",
      notPassable: false,
      leftShoulderType: "none",
      leftShoulderWidthM: "0",
      leftDrainageType: "none",
      leftLandUseType: "none",
      rightShoulderType: "none",
      rightShoulderWidthM: "0",
      rightDrainageType: "none",
      rightLandUseType: "none",
      isVisibleByVisitors: false,
      damageAssessment: getDefaultDamageAssessment("asphalt"),
    },
  });

  const { isSubmitting, isValid, isDirty } = form.formState;
  const watchedPavementType = form.watch("pavementType");

  const createRoadMutation = useMutation(
    orpc.road.createRoad.mutationOptions()
  );

  // Update damage assessment when pavement type changes
  useEffect(() => {
    const currentDamageAssessment = form.getValues("damageAssessment");
    if (currentDamageAssessment.pavementType !== watchedPavementType) {
      const newDamageAssessment =
        getDefaultDamageAssessment(watchedPavementType);
      form.setValue("damageAssessment", newDamageAssessment);
    }
  }, [watchedPavementType, form]);

  const onSubmit = async (values: z.infer<typeof createRoadInputSchema>) => {
    try {
      const parsedValues = createRoadInputSchema.parse(values);
      const response = await createRoadMutation.mutateAsync(parsedValues);
      if (response.success) {
        router.push(`${StaticRoutes.MANAGE_ROADS}/${response.roadId}`);
        toast.success("Road created successfully");
      } else {
        toast.error("Failed to create road");
      }
    } catch (error) {
      console.error("Error creating road:", error);
    }
  };

  return (
    <FormProvider {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit, (errors) => {
          console.error("Form validation errors:", errors);
        })}
        className="space-y-6"
      >
        {/* Road and Segment Identify */}
        <RoadSegmentFields />

        {/* Segment Attributes */}
        <SegmentForms />

        {/* Damage Assessment */}
        <div className="max-w-4xl space-y-4">
          <h3 className="text-lg font-semibold">Damage Assessment</h3>
          <PavementDamageForms />

          <Button
            type="submit"
            disabled={isSubmitting || !isValid}
            className="w-full"
          >
            {isSubmitting ? "Creating road..." : "Create Road"}
          </Button>

          {/* 
          <div className="mt-6 rounded-lg bg-gray-100 p-4">
            <h5 className="mb-2 text-sm font-medium text-gray-700">
              Debug: Current Damage Assessment Data
            </h5>
            <pre className="overflow-auto text-xs text-gray-600">
              {JSON.stringify(form.watch("damageAssessment"), null, 2)}
            </pre>
          </div> */}
        </div>
      </form>
    </FormProvider>
  );
}
