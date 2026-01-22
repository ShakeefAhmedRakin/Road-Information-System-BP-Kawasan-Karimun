"use client";

import PageLayout from "@/components/ui/page-layout";
import { useTranslation } from "@/i18n/hooks/useTranslation";
import RoadForm from "../manage-roads/_components/forms/road-form";

export default function CreateRoadPageContent() {
  const { t } = useTranslation("pageHeaders");

  return (
    <PageLayout
      title={t("createRoad.title")}
      description={t("createRoad.description")}
    >
      <RoadForm />
    </PageLayout>
  );
}
