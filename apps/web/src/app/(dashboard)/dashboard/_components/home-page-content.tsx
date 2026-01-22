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
    >
      {isOperatorOrAbove ? (
        <div className="space-y-4">
          <RoadsTable />
        </div>
      ) : isVisitor ? (
        <div className="space-y-4">
          <VisitorRoadsTable />
        </div>
      ) : (
        <h1>Pending</h1>
      )}
    </PageLayout>
  );
}
