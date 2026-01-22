"use client";

import {
  Item,
  ItemContent,
  ItemDescription,
  ItemMedia,
  ItemTitle,
} from "@/components/ui/item";
import { Paragraph, paragraphVariants } from "@/components/ui/typography";
import { useTranslation } from "@/i18n/hooks/useTranslation";
import { InfoIcon } from "lucide-react";

export default function PasswordInfoCard() {
  const { t } = useTranslation("account");

  return (
    <div className="space-y-2">
      <div>
        <h2
          className={paragraphVariants({
            size: "sm",
            className: "font-semibold",
          })}
        >
          {t("password.title")}
        </h2>
        <Paragraph size="xs" className="text-muted-foreground mt-0.5">
          {t("password.description")}
        </Paragraph>
      </div>
      <Item variant="destructive" size={"sm"}>
        <ItemMedia>
          <InfoIcon className="text-warning-foreground size-3" />
        </ItemMedia>
        <ItemContent>
          <ItemTitle className="text-warning-foreground !text-xs">
            {t("password.changeDisabled")}
          </ItemTitle>
          <ItemDescription className="!text-xs">
            {t("password.changeDisabledDescription")}
          </ItemDescription>
        </ItemContent>
      </Item>
    </div>
  );
}
