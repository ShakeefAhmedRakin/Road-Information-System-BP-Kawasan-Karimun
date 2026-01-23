"use client";

import PageLayout from "@/components/ui/page-layout";
import { useTranslation } from "@/i18n/hooks/useTranslation";
import { RoadsTable } from "./roads-table";
import { VisitorRoadsTable } from "./visitor-roads-table";

export default function HomePageContent({
  isOperatorOrAbove,
  isVisitor,
}: {
  isOperatorOrAbove: boolean;
  isVisitor: boolean;
}) {
  const { t } = useTranslation("pageHeaders");

  return (
    <PageLayout
      title={t("home.title")}
      description={t("home.description")}
      contained
    >
      {isOperatorOrAbove ? (
        <div className="flex h-full max-h-full flex-1 flex-col">
          <RoadsTable />
        </div>
      ) : isVisitor ? (
        <div className="flex h-full max-h-full flex-1 flex-col">
          <VisitorRoadsTable />
        </div>
      ) : (
        <h1>Pending</h1>
      )}
    </PageLayout>
  );
}
