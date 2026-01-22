"use client";

import PageLayout from "@/components/ui/page-layout";
import { useTranslation } from "@/i18n/hooks/useTranslation";
import { RoadsTable } from "./roads-table";

export default function HomePageContent({
  isOperatorOrAbove,
}: {
  isOperatorOrAbove: boolean;
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
      ) : (
        <h1>Pending</h1>
      )}
    </PageLayout>
  );
}
