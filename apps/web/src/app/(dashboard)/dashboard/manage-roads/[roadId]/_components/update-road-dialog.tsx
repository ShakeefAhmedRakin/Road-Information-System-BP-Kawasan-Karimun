"use client";

import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import {
    InputGroup,
    InputGroupAddon,
    InputGroupInput,
} from "@/components/ui/input-group";
import {
    Item,
    ItemContent,
    ItemDescription,
    ItemFooter,
    ItemHeader,
    ItemMedia,
    ItemSeparator,
    ItemTitle,
} from "@/components/ui/item";
import { Label } from "@/components/ui/label";
import { useTranslation } from "@/i18n/hooks/useTranslation";
import { Separator } from "@/components/ui/separator";
import { Spinner } from "@/components/ui/spinner";
import { orpc } from "@/utils/orpc";
import { useMutation, useQuery } from "@tanstack/react-query";
import { AlertCircleIcon, Edit, Ruler } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { toast } from "sonner";
import { z } from "zod";

// Zod validation schemas - matches API endpoint validation exactly
// Note: Validation messages are translated in component using useMemo

// Update road input schema - matches the API endpoint exactly
const updateRoadInputSchema = z.object({
  roadId: z.string(),
  name: z.string().optional(),
  number: z.string().optional(),
  totalLengthKm: z.number().positive().optional(),
  segmentGenerationMode: z.enum(["exact", "rounded"]).optional(),
});

interface UpdateRoadDialogProps {
  roadId: string;
  roadName: string;
  roadNumber: string;
  roadLength: number;
  segmentGenerationMode: string;
  onUpdate?: () => void;
}

export default function UpdateRoadDialog({
  roadId,
  roadName: initialRoadName,
  roadNumber: initialRoadNumber,
  roadLength: initialRoadLength,
  segmentGenerationMode: initialSegmentGenerationMode,
  onUpdate,
}: UpdateRoadDialogProps) {
  const { t, locale } = useTranslation("roadDetails");
  const roadLengthSchema = useMemo(
    () => z.number().positive(t("updateRoad.validation.lengthPositive")),
    [t, locale]
  );
  const [open, setOpen] = useState(false);
  const [showLengthWarning, setShowLengthWarning] = useState(false);
  const [newLengthValue, setNewLengthValue] = useState<number | null>(
    initialRoadLength
  );
  const [lengthError, setLengthError] = useState<string | null>(null);

  const [name, setName] = useState(initialRoadName);
  const [number, setNumber] = useState(initialRoadNumber);

  const nameTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const numberTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Update local state when props change (e.g., after successful update)
  useEffect(() => {
    setName(initialRoadName);
  }, [initialRoadName]);

  useEffect(() => {
    setNumber(initialRoadNumber);
  }, [initialRoadNumber]);

  useEffect(() => {
    setNewLengthValue(initialRoadLength);
    setLengthError(null);
  }, [initialRoadLength, showLengthWarning]);

  // Cleanup timeouts on unmount
  useEffect(() => {
    return () => {
      if (nameTimeoutRef.current) {
        clearTimeout(nameTimeoutRef.current);
      }
      if (numberTimeoutRef.current) {
        clearTimeout(numberTimeoutRef.current);
      }
    };
  }, []);

  const { data: initialSegmentData, isLoading: isLoadingSegmentData } =
    useQuery({
      ...orpc.road.getInitialSegmentData.queryOptions({
        input: { roadId },
      }),
      enabled: showLengthWarning,
    });

  const updateRoadMutation = useMutation(
    orpc.road.updateRoad.mutationOptions()
  );

  const regenerateSegmentsMutation = useMutation(
    orpc.road.regenerateSegmentsForRoad.mutationOptions()
  );

  const handleNameChange = async (newName: string) => {
    if (newName === initialRoadName) return;

    updateRoadMutation.mutate(
      { roadId, name: newName },
      {
        onSuccess: () => {
          toast.success(t("updateRoad.toasts.nameUpdated"));
          onUpdate?.();
        },
        onError: (error: Error) => {
          toast.error(error.message || t("updateRoad.toasts.nameFailed"));
          setName(initialRoadName);
        },
      }
    );
  };

  const handleNumberChange = async (newNumber: string) => {
    if (newNumber === initialRoadNumber) return;

    updateRoadMutation.mutate(
      { roadId, number: newNumber },
      {
        onSuccess: () => {
          toast.success(t("updateRoad.toasts.numberUpdated"));
          onUpdate?.();
        },
        onError: (error: Error) => {
          toast.error(error.message || t("updateRoad.toasts.numberFailed"));
          setNumber(initialRoadNumber);
        },
      }
    );
  };

  const handleModifyLength = () => {
    setNewLengthValue(initialRoadLength);
    setLengthError(null);
    setShowLengthWarning(true);
  };

  const handleNewLengthChange = (value: number | null) => {
    setNewLengthValue(value);
    setLengthError(null);

    // Skip validation if empty/null (allow user to type)
    if (value === null || value === undefined) {
      return;
    }

    // Validate using Zod schema
    try {
      roadLengthSchema.parse(value);
      // Clear error if validation passes
      setLengthError(null);
    } catch (error) {
      if (error instanceof z.ZodError) {
        setLengthError(error.issues[0]?.message || t("updateRoad.validation.invalidLength"));
      }
    }
  };

  const handleConfirmLengthChange = async () => {
    if (!initialSegmentData || isLoadingSegmentData) {
      if (showLengthWarning && !initialSegmentData) {
        toast.error(t("updateRoad.toasts.loadSegmentFailed"));
      }
      return;
    }

    if (!initialSegmentData.damageAssessment) {
      toast.error(t("updateRoad.toasts.missingDamage"));
      setShowLengthWarning(false);
      return;
    }

    // Validate length - check for null/undefined first
    if (newLengthValue === null || newLengthValue === undefined) {
      setLengthError(t("updateRoad.toasts.lengthRequired"));
      toast.error(t("updateRoad.toasts.lengthRequired"));
      return;
    }

    // Check if it's a valid number
    if (Number.isNaN(newLengthValue) || !Number.isFinite(newLengthValue)) {
      setLengthError(t("updateRoad.toasts.lengthInvalid"));
      toast.error(t("updateRoad.toasts.lengthInvalid"));
      return;
    }

    // Validate using Zod schema - this should match the API validation exactly
    let validatedLength: number;
    try {
      validatedLength = roadLengthSchema.parse(newLengthValue);
    } catch (error) {
      if (error instanceof z.ZodError) {
        const errorMessage = error.issues[0]?.message || t("updateRoad.validation.invalidLength");
        setLengthError(errorMessage);
        toast.error(errorMessage);
      } else {
        setLengthError(t("updateRoad.validation.invalidLength"));
        toast.error(t("updateRoad.validation.invalidLength"));
      }
      return;
    }

    if (validatedLength === initialRoadLength) {
      toast.info(t("updateRoad.toasts.lengthUnchanged"));
      setShowLengthWarning(false);
      return;
    }

    // Store validated length for use in callbacks
    const lengthToUpdate = validatedLength;

    // Validate the entire input object using the API schema before sending
    let validatedInput: z.infer<typeof updateRoadInputSchema>;
    try {
      validatedInput = updateRoadInputSchema.parse({
        roadId,
        totalLengthKm: lengthToUpdate,
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        const errorMessage =
          error.issues[0]?.message || t("updateRoad.toasts.validationFailed");
        setLengthError(errorMessage);
        toast.error(errorMessage);
      } else {
        setLengthError(t("updateRoad.toasts.validationFailed"));
        toast.error(t("updateRoad.toasts.validationFailed"));
      }
      return;
    }

    // First update the road length - use the validated input
    updateRoadMutation.mutate(
      validatedInput,
      {
        onSuccess: async () => {
          // Then regenerate segments using the current segment generation mode
          regenerateSegmentsMutation.mutate(
            {
              roadId,
              totalLengthKm: lengthToUpdate,
              segmentIntervalM: initialSegmentData.segmentIntervalM,
              segmentGenerationMode: initialSegmentGenerationMode as
                | "exact"
                | "rounded",
              pavementType: initialSegmentData.pavementType,
              pavementWidthM: initialSegmentData.pavementWidthM,
              carriagewayWidthM: initialSegmentData.carriagewayWidthM ?? null,
              rightOfWayWidthM: initialSegmentData.rightOfWayWidthM,
              terrain: initialSegmentData.terrain,
              notPassable: initialSegmentData.notPassable,
              leftShoulderType: initialSegmentData.leftShoulderType,
              leftShoulderWidthM: initialSegmentData.leftShoulderWidthM,
              leftDrainageType: initialSegmentData.leftDrainageType,
              leftLandUseType: initialSegmentData.leftLandUseType,
              rightShoulderType: initialSegmentData.rightShoulderType,
              rightShoulderWidthM: initialSegmentData.rightShoulderWidthM,
              rightDrainageType: initialSegmentData.rightDrainageType,
              rightLandUseType: initialSegmentData.rightLandUseType,
              damageAssessment: initialSegmentData.damageAssessment!,
            },
            {
              onSuccess: () => {
                toast.success(t("updateRoad.toasts.lengthUpdated"));
                setShowLengthWarning(false);
                setLengthError(null);
                onUpdate?.();
              },
              onError: (error: Error) => {
                toast.error(
                  error.message || t("updateRoad.toasts.regenerateFailed")
                );
                setNewLengthValue(initialRoadLength);
                setLengthError(null);
              },
            }
          );
        },
        onError: (error: Error) => {
          console.error("Update road error:", error);
          const errorMessage =
            error.message || t("updateRoad.toasts.updateLengthFailed");
          toast.error(errorMessage);
          // Check if it's a validation error
          if (errorMessage.toLowerCase().includes("validation")) {
            setLengthError(errorMessage);
          }
          setNewLengthValue(initialRoadLength);
        },
      }
    );
  };

  const handleCancelLengthChange = () => {
    setNewLengthValue(initialRoadLength);
    setLengthError(null);
    setShowLengthWarning(false);
  };

  const isUpdating =
    updateRoadMutation.isPending || regenerateSegmentsMutation.isPending;

  // Check if length is valid
  const isValidLength =
    newLengthValue !== null &&
    newLengthValue !== undefined &&
    !Number.isNaN(newLengthValue) &&
    Number.isFinite(newLengthValue) &&
    !lengthError &&
    newLengthValue > 0 &&
    newLengthValue !== initialRoadLength;

  return (
    <>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button variant="outline">
            <Edit className="mr-2 h-4 w-4" />
            {t("updateRoad.button")}
          </Button>
        </DialogTrigger>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Edit className="size-5" /> {t("updateRoad.title")}
            </DialogTitle>
          </DialogHeader>
          <Separator />

          <DialogDescription>
            {t("updateRoad.description")}
          </DialogDescription>

          <div className="space-y-4">
            {/* Road Name */}
            <div className="space-y-2">
              <Label htmlFor="road-name">{t("updateRoad.roadName")}</Label>
              <InputGroup>
                <InputGroupAddon>
                  <Edit className="size-3.5" />
                </InputGroupAddon>
                <InputGroupInput
                  id="road-name"
                  value={name}
                  onChange={(e) => {
                    const newName = e.target.value;
                    setName(newName);
                    if (nameTimeoutRef.current) {
                      clearTimeout(nameTimeoutRef.current);
                    }
                    if (newName !== initialRoadName && newName.trim()) {
                      nameTimeoutRef.current = setTimeout(() => {
                        handleNameChange(newName);
                      }, 1000);
                    }
                  }}
                  onBlur={() => {
                    if (nameTimeoutRef.current) {
                      clearTimeout(nameTimeoutRef.current);
                      nameTimeoutRef.current = null;
                    }
                    if (name !== initialRoadName && name.trim()) {
                      handleNameChange(name);
                    } else if (name !== initialRoadName) {
                      setName(initialRoadName);
                    }
                  }}
                  disabled={isUpdating}
                />
              </InputGroup>
            </div>

            {/* Road Number */}
            <div className="space-y-2">
              <Label htmlFor="road-number">{t("updateRoad.roadNumber")}</Label>
              <InputGroup>
                <InputGroupAddon>
                  <Edit className="size-3.5" />
                </InputGroupAddon>
                <InputGroupInput
                  id="road-number"
                  value={number}
                  onChange={(e) => {
                    const newNumber = e.target.value;
                    setNumber(newNumber);
                    if (numberTimeoutRef.current) {
                      clearTimeout(numberTimeoutRef.current);
                    }
                    if (newNumber !== initialRoadNumber && newNumber.trim()) {
                      numberTimeoutRef.current = setTimeout(() => {
                        handleNumberChange(newNumber);
                      }, 1000);
                    }
                  }}
                  onBlur={() => {
                    if (numberTimeoutRef.current) {
                      clearTimeout(numberTimeoutRef.current);
                      numberTimeoutRef.current = null;
                    }
                    if (number !== initialRoadNumber && number.trim()) {
                      handleNumberChange(number);
                    } else if (number !== initialRoadNumber) {
                      setNumber(initialRoadNumber);
                    }
                  }}
                  disabled={isUpdating}
                />
              </InputGroup>
            </div>

            {/* Road Length - Read-only with Modify button */}
            <div className="space-y-2">
              <Label htmlFor="road-length">{t("updateRoad.roadLength")}</Label>
              <div className="flex items-center gap-2">
                <InputGroup className="flex-1">
                  <InputGroupAddon>
                    <Edit className="size-3.5" />
                  </InputGroupAddon>
                  <InputGroupInput
                    id="road-length"
                    value={initialRoadLength.toFixed(2)}
                    readOnly
                    disabled
                    className="bg-muted cursor-not-allowed"
                  />
                </InputGroup>
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleModifyLength}
                  title={t("updateRoad.modifyWipTitle")}
                  // WIP
                  disabled={true}
                >
                  {t("updateRoad.modifyWip")}
                </Button>
              </div>
            </div>
          </div>

          <div className="flex w-full flex-col gap-2">
            <Button variant="outline" onClick={() => setOpen(false)}>
              {t("updateRoad.close")}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Length Change Warning Dialog */}
      <Dialog open={showLengthWarning} onOpenChange={setShowLengthWarning}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <AlertCircleIcon className="text-destructive size-5" />
              {t("updateRoad.lengthModal.title")}
            </DialogTitle>
          </DialogHeader>
          <Separator />

          <DialogDescription>
            {t("updateRoad.lengthModal.description")}
          </DialogDescription>

          <Item variant="destructive">
            <ItemMedia>
              <AlertCircleIcon className="text-destructive size-5" />
            </ItemMedia>
            <ItemContent>
              <ItemTitle className="text-destructive">
                {t("updateRoad.lengthModal.warningTitle")}
              </ItemTitle>
              <ItemDescription>
                {t("updateRoad.lengthModal.warningDescription")}
              </ItemDescription>
            </ItemContent>
          </Item>

          <Item variant="outline">
            <ItemHeader className="flex w-full items-center justify-between gap-2">
              <span className="whitespace-nowrap">{t("updateRoad.lengthModal.lengthChange")}</span>
            </ItemHeader>
            <ItemSeparator />
            <ItemContent>
              <div className="space-y-3">
                <div>
                  <ItemTitle>
                    {t("updateRoad.lengthModal.current", { value: initialRoadLength.toFixed(2) })}
                  </ItemTitle>
                  <ItemDescription>
                    {t("updateRoad.lengthModal.enterNew")}
                  </ItemDescription>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="new-road-length">{t("updateRoad.lengthModal.newLabel")}</Label>
                  <InputGroup>
                    <InputGroupAddon>
                      <Ruler className="size-3.5" />
                    </InputGroupAddon>
                    <InputGroupInput
                      id="new-road-length"
                      type="number"
                      placeholder={t("updateRoad.lengthModal.placeholder")}
                      value={newLengthValue ?? ""}
                      onChange={(e) => {
                        const numValue = parseFloat(e.target.value);
                        // Use 0 as fallback like the create-road form, but handle validation separately
                        const value = Number.isNaN(numValue) ? null : numValue;
                        handleNewLengthChange(value);
                      }}
                      disabled={isUpdating || isLoadingSegmentData}
                      aria-invalid={!!lengthError}
                      className={lengthError ? "border-destructive" : ""}
                    />
                    <InputGroupAddon align="inline-end">
                      <span className="text-muted-foreground text-sm">km</span>
                    </InputGroupAddon>
                  </InputGroup>
                  {lengthError && (
                    <p className="text-destructive text-xs">{lengthError}</p>
                  )}
                  {!lengthError &&
                    newLengthValue !== null &&
                    newLengthValue !== undefined &&
                    !Number.isNaN(newLengthValue) &&
                    Number.isFinite(newLengthValue) &&
                    newLengthValue > 0 &&
                    newLengthValue !== initialRoadLength && (
                      <p className="text-muted-foreground text-xs">
                        {t("updateRoad.lengthModal.newLengthPreview", {
                          value: newLengthValue.toFixed(2),
                          diff: `${newLengthValue > initialRoadLength ? "+" : ""}${(newLengthValue - initialRoadLength).toFixed(2)}`
                        })}
                      </p>
                    )}
                </div>
              </div>
            </ItemContent>
            <ItemFooter className="text-muted-foreground text-xs font-bold">
              {t("updateRoad.lengthModal.note")}
            </ItemFooter>
          </Item>

          <div className="flex w-full flex-col gap-2">
            <Button
              variant="destructive"
              onClick={handleConfirmLengthChange}
              disabled={isUpdating || isLoadingSegmentData || !isValidLength}
            >
              {isUpdating || isLoadingSegmentData ? (
                <>
                  <Spinner className="mr-2" />
                  {isLoadingSegmentData
                    ? t("updateRoad.lengthModal.loading")
                    : t("updateRoad.lengthModal.updating")}
                </>
              ) : (
                t("updateRoad.lengthModal.confirmButton")
              )}
            </Button>
            <Button
              variant="outline"
              onClick={handleCancelLengthChange}
              disabled={isUpdating || isLoadingSegmentData}
            >
              {t("updateRoad.lengthModal.cancel")}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}