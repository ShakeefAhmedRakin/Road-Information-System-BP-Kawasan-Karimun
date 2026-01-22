"use client";

import { AlertCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { useTranslation } from "@/i18n/hooks/useTranslation";
import { Button } from "./ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";
import PageLayout from "./ui/page-layout";
import { Spinner } from "./ui/spinner";
import { Heading, Paragraph } from "./ui/typography";

export default function ErrorCard({
  refetch,
  isRefetching,
}: {
  refetch?: () => void;
  isRefetching?: boolean;
}) {
  const router = useRouter();
  const { t } = useTranslation("dashboard");

  return (
    <PageLayout
      showHeader={false}
      contained
      containerClassName="flex items-center justify-center"
    >
      <Card className="mx-auto w-full max-w-md">
        <CardHeader className="text-center">
          <div className="bg-destructive/10 mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full">
            <AlertCircle className="text-destructive h-8 w-8" />
          </div>
          <CardTitle className="text-xl">
            <Heading level="h4">{t("common.error.title")}</Heading>
          </CardTitle>
        </CardHeader>
        <CardContent className="text-center">
          <Paragraph className="text-muted-foreground" size="sm">
            {t("common.error.message")}
          </Paragraph>
        </CardContent>
        <CardFooter>
          <Button
            disabled={isRefetching}
            onClick={() => (refetch ? refetch() : router.refresh())}
            className="w-full"
            variant="outline"
          >
            {isRefetching ? <Spinner /> : t("common.error.tryAgain")}
          </Button>
        </CardFooter>
      </Card>
    </PageLayout>
  );
}
