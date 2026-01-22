"use client";

import { useTranslation } from "@/i18n/hooks/useTranslation";
import { AppLogo } from "./app-logo";

export function AppLogoWithTranslation({
  href,
  className,
  textColor,
  logoSize,
}: {
  href?: string;
  className?: string;
  textColor?: string;
  logoSize?: string;
}) {
  const { t } = useTranslation("dashboard");

  return (
    <AppLogo
      href={href}
      label={t("app.logo.homePage")}
      className={className}
      textColor={textColor}
      logoSize={logoSize}
      title={t("app.logo.title")}
      subtitle={t("app.logo.subtitle")}
    />
  );
}
