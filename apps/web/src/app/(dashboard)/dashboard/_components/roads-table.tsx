"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useTranslation } from "@/i18n/hooks/useTranslation";
import { orpc } from "@/utils/orpc";
import { PAVEMENT_TYPES, type PavementType } from "@repo/shared";
import { useQuery } from "@tanstack/react-query";
import type { SegmentCondition } from "api/src/modules/results/results.schema";
import { Loader2 } from "lucide-react";
import Link from "next/link";
import { Fragment } from "react";
import { buttonVariants } from "../../../../components/ui/button";
import { StaticRoutes } from "../../../../config/static-routes";

const CONDITION_ORDER: SegmentCondition[] = ["Good", "Fair", "Poor", "Bad"];

const formatNumber = (
  value: number | string | null | undefined,
  fractionDigits = 2,
  fallback = "-"
) => {
  if (value === null || value === undefined) return fallback;
  const n = Number(value);
  if (Number.isNaN(n)) return fallback;
  return n.toFixed(fractionDigits);
};

const formatPercent = (value: number | null | undefined) =>
  value === null || value === undefined ? "-" : `${formatNumber(value, 2)}%`;

export function RoadsTable() {
  const { t } = useTranslation("manageRoads");
  const { t: tCreateRoad } = useTranslation("createRoad");
  const { data, isLoading, isError, refetch } = useQuery(
    orpc.result.listRoadsWithReportSummary.queryOptions()
  );

  const formatPavementLabel = (type: PavementType) =>
    tCreateRoad(`enums.pavementType.${type}`);

  if (isLoading) {
    return (
      <div className="flex min-h-[200px] flex-col items-center justify-center gap-y-2">
        <Loader2 className="text-muted-foreground h-8 w-8 animate-spin" />
        <p className="text-muted-foreground text-sm">
          {t("roadsTable.loading")}
        </p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex min-h-[200px] flex-col items-center justify-center gap-y-2 text-center">
        <p className="text-muted-foreground text-sm">
          {t("roadsTable.error.message")}
        </p>
        <button
          type="button"
          onClick={() => refetch()}
          className="text-primary underline underline-offset-2"
        >
          {t("roadsTable.error.retry")}
        </button>
      </div>
    );
  }

  const roads = data?.roads ?? [];

  // Sort roads by number (try numeric sort, fallback to string sort)
  const sortedRoads = [...roads].sort((a, b) => {
    const numA = Number(a.road.number);
    const numB = Number(b.road.number);

    // If both are valid numbers, sort numerically
    if (!Number.isNaN(numA) && !Number.isNaN(numB)) {
      return numA - numB;
    }

    // Fallback to string comparison
    return a.road.number.localeCompare(b.road.number, undefined, {
      numeric: true,
      sensitivity: "base",
    });
  });

  if (sortedRoads.length === 0) {
    return (
      <div className="flex min-h-[200px] flex-col items-center justify-center gap-y-2 text-center">
        <p className="text-muted-foreground text-sm">
          {t("roadsTable.noRoads.message")}
        </p>
        <Link
          href={StaticRoutes.CREATE_ROAD}
          className={buttonVariants({ variant: "default" })}
        >
          {t("roadsTable.noRoads.createButton")}
        </Link>
      </div>
    );
  }

  return (
    <div className="thin-styled-scroll-container h-full max-h-full flex-1 overflow-x-auto overflow-y-auto rounded-lg border">
      <Table>
        <TableHeader className="sticky top-0 z-10">
          {/* Row 1: Group headers */}
          <TableRow className="bg-muted">
            <TableHead
              rowSpan={3}
              className="bg-muted text-center align-middle"
            >
              {t("roadsTable.headers.no")}
            </TableHead>
            <TableHead rowSpan={3} className="bg-muted align-middle">
              {t("roadsTable.headers.roadNumber")}
            </TableHead>
            <TableHead rowSpan={3} className="bg-muted align-middle">
              {t("roadsTable.headers.roadName")}
            </TableHead>
            <TableHead rowSpan={3} className="bg-muted text-right align-middle">
              {t("roadsTable.headers.totalLength")}
            </TableHead>
            <TableHead rowSpan={3} className="bg-muted text-right align-middle">
              {t("roadsTable.headers.sectionWidth")}
            </TableHead>
            <TableHead
              colSpan={PAVEMENT_TYPES.length * 2}
              className="bg-muted !text-center whitespace-normal"
            >
              <div className="px-1 break-words">
                {t("roadsTable.headers.lengthBySurfaceType")}
              </div>
            </TableHead>
            <TableHead rowSpan={3} className="bg-muted !w-2 !p-0" />
            <TableHead
              colSpan={CONDITION_ORDER.length * 2}
              className="bg-muted !text-center whitespace-normal"
            >
              <div className="px-1 break-words">
                {t("roadsTable.headers.lengthByCondition")}
              </div>
            </TableHead>
          </TableRow>
          {/* Row 2: Individual type/condition names */}
          <TableRow className="bg-muted">
            {PAVEMENT_TYPES.map((type) => (
              <TableHead
                key={type}
                className="bg-muted text-center"
                colSpan={2}
              >
                {formatPavementLabel(type)}
              </TableHead>
            ))}
            {CONDITION_ORDER.map((condition) => (
              <TableHead
                key={`${condition}-group`}
                className="bg-muted text-center"
                colSpan={2}
              >
                {t(`roadsTable.headers.conditions.${condition.toLowerCase()}`)}
              </TableHead>
            ))}
          </TableRow>
          {/* Row 3: km / % sub-headers */}
          <TableRow className="bg-muted">
            {PAVEMENT_TYPES.map((type) => (
              <Fragment key={`${type}-labels`}>
                <TableHead className="bg-muted text-center">
                  {t("roadsTable.headers.km")}
                </TableHead>
                <TableHead className="bg-muted text-center">
                  {t("roadsTable.headers.percent")}
                </TableHead>
              </Fragment>
            ))}
            {CONDITION_ORDER.map((condition) => (
              <Fragment key={`${condition}-labels`}>
                <TableHead className="bg-muted text-center">
                  {t("roadsTable.headers.km")}
                </TableHead>
                <TableHead className="bg-muted text-center">
                  {t("roadsTable.headers.percent")}
                </TableHead>
              </Fragment>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {sortedRoads.map(({ road, reportSummary }, index) => {
            const hasReport = reportSummary != null;
            const totalLength = Number(road.totalLengthKm);
            const width = Number(road.pavementWidthM);
            const hasSurfaceLengthStats =
              hasReport && reportSummary.pavementTypeLengthStats != null;

            return (
              <TableRow key={road.id}>
                <TableCell className="text-center font-medium">
                  {index + 1}
                </TableCell>
                <TableCell className="whitespace-nowrap">
                  {road.number}
                </TableCell>
                <TableCell className="whitespace-nowrap">{road.name}</TableCell>
                <TableCell className="text-right whitespace-nowrap">
                  {formatNumber(totalLength)}
                </TableCell>
                <TableCell className="text-right whitespace-nowrap">
                  {formatNumber(width)}
                </TableCell>
                {hasReport ? (
                  hasSurfaceLengthStats ? (
                    PAVEMENT_TYPES.map((type) => (
                      <Fragment key={type}>
                        <TableCell className="text-center whitespace-nowrap">
                          {formatNumber(
                            reportSummary.pavementTypeLengthStats![type]
                              ?.lengthKm ?? 0
                          )}
                        </TableCell>
                        <TableCell className="text-center whitespace-nowrap">
                          {formatPercent(
                            reportSummary.pavementTypeLengthStats![type]
                              ?.percentage ?? 0
                          )}
                        </TableCell>
                      </Fragment>
                    ))
                  ) : (
                    /* Fallback for old reports without length stats: show "-" for km, use old percentages */
                    PAVEMENT_TYPES.map((type) => (
                      <Fragment key={type}>
                        <TableCell className="text-center whitespace-nowrap">
                          -
                        </TableCell>
                        <TableCell className="text-center whitespace-nowrap">
                          {formatPercent(
                            reportSummary.pavementTypePercentages[type] ?? 0
                          )}
                        </TableCell>
                      </Fragment>
                    ))
                  )
                ) : (
                  <TableCell
                    colSpan={PAVEMENT_TYPES.length * 2}
                    className="text-muted-foreground text-center italic"
                  >
                    {t("roadsTable.pendingLabel")}
                  </TableCell>
                )}
                <TableCell className="!p-0" />
                {hasReport ? (
                  CONDITION_ORDER.map((condition) => (
                    <Fragment key={`${condition}-value`}>
                      <TableCell className="text-center whitespace-nowrap">
                        {formatNumber(
                          reportSummary.conditionLengthStats[condition]
                            ?.lengthKm ?? 0
                        )}
                      </TableCell>
                      <TableCell className="text-center whitespace-nowrap">
                        {formatPercent(
                          reportSummary.conditionLengthStats[condition]
                            ?.percentage ?? 0
                        )}
                      </TableCell>
                    </Fragment>
                  ))
                ) : (
                  <TableCell
                    colSpan={CONDITION_ORDER.length * 2}
                    className="text-muted-foreground text-center italic"
                  >
                    {t("roadsTable.pendingLabel")}
                  </TableCell>
                )}
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}
