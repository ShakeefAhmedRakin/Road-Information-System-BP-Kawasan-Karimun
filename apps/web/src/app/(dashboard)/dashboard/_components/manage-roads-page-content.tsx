"use client";

import PageLayout from "@/components/ui/page-layout";
import { useTranslation } from "@/i18n/hooks/useTranslation";
import AllRoads from "../manage-roads/_components/manage-road/all-roads";

export default function ManageRoadsPageContent() {
  const { t } = useTranslation("pageHeaders");

  return (
    <PageLayout
      title={t("manageRoads.title")}
      description={t("manageRoads.description")}
      contained
    >
      <div className="h-full max-h-full overflow-y-auto">
        <AllRoads />
      </div>
    </PageLayout>
  );
}
