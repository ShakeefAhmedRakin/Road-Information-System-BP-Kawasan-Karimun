"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import PageLayout from "@/components/ui/page-layout";
import { orpc } from "@/utils/orpc";
import { useMutation, useQuery } from "@tanstack/react-query";
import type { ReadRoadSegmentType } from "api/src/modules/segment/segment.schema";
import { ArrowRightIcon, InfoIcon, Loader2 } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { Button } from "../../../../../components/ui/button";
import { cn } from "../../../../../lib/utils";
import { ReportDialogTrigger } from "./_components/report-dialog";
import SegmentForm, {
  type SegmentFormHandle,
} from "./_components/segment-form";

interface RoadPageClientProps {
  roadId: string;
}

const formatStationing = (meters: number) => {
  const km = Math.floor(meters / 1000);
  const m = meters % 1000;
  return `${km}+${m.toFixed(0).padStart(3, "0")}`;
};

const getItemValue = (segmentId: string) => `segment-${segmentId}`;
const getSegmentIdFromValue = (value?: string | null) =>
  value?.startsWith("segment-") ? value.replace("segment-", "") : undefined;

export default function RoadPageClient({ roadId }: RoadPageClientProps) {
  const { data, isLoading, refetch } = useQuery(
    orpc.road.getRoadAndSegmentsByRoadId.queryOptions({
      input: { roadId },
    })
  );
  const {
    data: statusData,
    isLoading: isStatusLoading,
    refetch: refetchStatus,
  } = useQuery(
    orpc.result.statusByRoadId.queryOptions({
      input: { roadId },
    })
  );
  const generateReportMutation = useMutation(
    orpc.result.generateForRoad.mutationOptions()
  );

  const segments = data?.segments ?? [];

  const [openItem, setOpenItem] = useState<string | undefined>(() =>
    segments[0] ? getItemValue(segments[0].id) : undefined
  );
  const [dirtySegments, setDirtySegments] = useState<Record<string, boolean>>(
    {}
  );
  const [pendingSaves, setPendingSaves] = useState<Record<string, boolean>>({});
  const [highlightedSegment, setHighlightedSegment] = useState<string | null>(
    null
  );
  const formRefs = useRef<Record<string, SegmentFormHandle | null>>({});
  const actionRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const highlightTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (!segments.length) {
      setOpenItem(undefined);
      return;
    }

    setOpenItem((previous) => {
      if (
        previous &&
        segments.some((segment) => getItemValue(segment.id) === previous)
      ) {
        return previous;
      }

      return getItemValue(segments[0].id);
    });
  }, [segments]);

  useEffect(() => {
    return () => {
      if (highlightTimeoutRef.current) {
        clearTimeout(highlightTimeoutRef.current);
      }
    };
  }, []);

  const hasReport = statusData?.hasReport ?? false;
  const isViewDisabled = isStatusLoading || !hasReport;
  const isGenerating = generateReportMutation.isPending;
  const generateLabel = isGenerating
    ? hasReport
      ? "Regenerating..."
      : "Generating..."
    : hasReport
      ? "Regenerate Report"
      : "Generate Report";

  const handleGenerateReport = async () => {
    if (segments.length === 0 || isGenerating) return;
    const toastId = `road-${roadId}-report`;
    toast.loading(hasReport ? "Regenerating report…" : "Generating report…", {
      id: toastId,
    });
    try {
      await generateReportMutation.mutateAsync({
        roadId,
      });
      toast.success(
        hasReport
          ? "Report regenerated successfully"
          : "Report generated successfully",
        { id: toastId }
      );
      await refetchStatus();
    } catch (error) {
      console.error("Failed to generate report", error);
      toast.error("Failed to generate report", { id: toastId });
    }
  };

  const handleDirtyStateChange = useCallback(
    (segmentId: string, isDirty: boolean) => {
      setDirtySegments((prev) => {
        const previousValue = prev[segmentId] ?? false;
        if (previousValue === isDirty) {
          return prev;
        }

        if (isDirty) {
          return { ...prev, [segmentId]: true };
        }

        const next = { ...prev };
        delete next[segmentId];
        return next;
      });
    },
    []
  );

  const requestActionAttention = useCallback((segmentId: string) => {
    const target = actionRefs.current[segmentId];
    if (target) {
      target.scrollIntoView({ behavior: "smooth", block: "center" });
    }

    setHighlightedSegment(segmentId);

    if (highlightTimeoutRef.current) {
      clearTimeout(highlightTimeoutRef.current);
    }

    highlightTimeoutRef.current = setTimeout(() => {
      setHighlightedSegment((current) =>
        current === segmentId ? null : current
      );
    }, 2000);
  }, []);

  const handleAccordionChange = useCallback(
    (nextValue: string | undefined) => {
      if (!openItem) {
        setOpenItem(nextValue);
        return;
      }

      const currentSegmentId = getSegmentIdFromValue(openItem);

      if (!currentSegmentId) {
        setOpenItem(nextValue);
        return;
      }

      const hasPendingChanges = dirtySegments[currentSegmentId];

      if (hasPendingChanges && nextValue !== openItem) {
        toast.warning(
          "Save or discard your changes before leaving this segment."
        );
        requestActionAttention(currentSegmentId);
        return;
      }

      setOpenItem(nextValue);
    },
    [dirtySegments, openItem, requestActionAttention]
  );

  const handleSaveClick = useCallback(async (segmentId: string) => {
    const formRef = formRefs.current[segmentId];
    if (!formRef) {
      return;
    }

    setPendingSaves((prev) => ({ ...prev, [segmentId]: true }));

    try {
      await formRef.saveChanges();
    } catch (error) {
      // Errors are handled inside SegmentForm
    } finally {
      setPendingSaves((prev) => {
        const next = { ...prev };
        delete next[segmentId];
        return next;
      });
    }
  }, []);

  const handleDiscardClick = useCallback((segmentId: string) => {
    const formRef = formRefs.current[segmentId];
    if (!formRef) {
      return;
    }

    formRef.discardChanges();
    setHighlightedSegment((current) =>
      current === segmentId ? null : current
    );
  }, []);

  if (isLoading) {
    return (
      <PageLayout title="Road Details" description="View the details of a road">
        <div className="flex min-h-64 flex-col items-center justify-center gap-y-2 p-2">
          <p className="text-muted-foreground text-sm">Loading segments...</p>
        </div>
      </PageLayout>
    );
  }

  if (!data?.road) {
    return (
      <PageLayout title="Road Details" description="View the details of a road">
        <div className="flex min-h-64 flex-col items-center justify-center gap-y-2 p-2">
          <h1 className="text-lg font-medium">Road not found</h1>
          <p className="text-muted-foreground text-sm">
            The road you are looking for does not exist.
          </p>
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout title="Road Details" description="View the details of a road">
      <div className="space-y-6">
        <div className="space-y-2">
          <h2 className="text-2xl font-semibold">{data.road.name}</h2>
          <p className="text-muted-foreground">
            Road Number: {data.road.number}
          </p>
          <p className="text-muted-foreground">
            Total Length: {data.road.totalLengthKm} km
          </p>
        </div>

        <div className="space-y-4">
          <div className="flex flex-col items-start justify-between gap-x-2 gap-y-2 md:flex-row md:items-center">
            <h3 className="flex items-center gap-x-2 text-xl font-semibold">
              <InfoIcon className="h-4 w-4" />
              Segments ({segments.length})
            </h3>
            <div className="flex items-center gap-x-2">
              <ReportDialogTrigger
                roadId={roadId}
                roadName={data.road.name}
                roadNumber={data.road.number}
                disabled={isViewDisabled}
                isChecking={isStatusLoading}
              />
              <Button
                variant="default"
                disabled={segments.length === 0 || isGenerating}
                onClick={handleGenerateReport}
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    {generateLabel}
                  </>
                ) : (
                  <>
                    {generateLabel}
                    <ArrowRightIcon className="ml-2 h-4 w-4" />
                  </>
                )}
              </Button>
            </div>
          </div>
          {segments.length === 0 ? (
            <p className="text-muted-foreground text-sm">
              No segments found for this road.
            </p>
          ) : (
            <Accordion
              type="single"
              collapsible
              className="rounded-lg border"
              value={openItem}
              onValueChange={handleAccordionChange}
            >
              {segments.map((segment: ReadRoadSegmentType) => {
                const lengthM =
                  Number(segment.stationingToM) -
                  Number(segment.stationingFromM);
                const isSegmentDirty = dirtySegments[segment.id] ?? false;
                const isSavingSegment = pendingSaves[segment.id] ?? false;
                const isHighlighted = highlightedSegment === segment.id;
                const itemValue = getItemValue(segment.id);

                return (
                  <AccordionItem
                    key={segment.id}
                    value={itemValue}
                    className="relative"
                  >
                    <AccordionTrigger className="cursor-pointer items-center px-4 pr-4 md:pr-56">
                      <div className="flex flex-col text-left">
                        <span className="text-sm font-semibold">
                          Segment {segment.segmentNumber}
                        </span>
                        <span className="text-muted-foreground text-xs">
                          {formatStationing(segment.stationingFromM)}m —{" "}
                          {formatStationing(segment.stationingToM)}m
                          {Number.isFinite(lengthM)
                            ? ` (${lengthM.toFixed(0)} m)`
                            : null}
                        </span>
                      </div>
                    </AccordionTrigger>
                    <div
                      ref={(node) => {
                        if (node) {
                          actionRefs.current[segment.id] = node;
                        } else {
                          delete actionRefs.current[segment.id];
                        }
                      }}
                      tabIndex={-1}
                      role="group"
                      aria-label={`Actions for segment ${segment.segmentNumber}`}
                      className={cn(
                        "bg-background/95 pointer-events-auto mt-2 flex flex-wrap items-center gap-2 rounded-md border px-3 py-2 shadow-sm md:absolute md:top-2 md:right-3 md:mt-0",
                        isSegmentDirty
                          ? "border-amber-300"
                          : "border-border/60 text-muted-foreground",
                        isHighlighted && "ring-primary animate-pulse ring-2"
                      )}
                    >
                      <Button
                        size="sm"
                        onClick={() => handleSaveClick(segment.id)}
                        disabled={!isSegmentDirty || isSavingSegment}
                      >
                        {isSavingSegment ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Saving...
                          </>
                        ) : (
                          "Save Changes"
                        )}
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        disabled={!isSegmentDirty || isSavingSegment}
                        onClick={() => handleDiscardClick(segment.id)}
                      >
                        Discard
                      </Button>
                    </div>
                    <AccordionContent className="bg-muted/20">
                      <SegmentForm
                        ref={(instance) => {
                          if (instance) {
                            formRefs.current[segment.id] = instance;
                          } else {
                            delete formRefs.current[segment.id];
                          }
                        }}
                        segment={segment}
                        onUpdateSuccess={() => {
                          refetch();
                        }}
                        onDirtyStateChange={handleDirtyStateChange}
                      />
                    </AccordionContent>
                  </AccordionItem>
                );
              })}
            </Accordion>
          )}
        </div>
      </div>
    </PageLayout>
  );
}
