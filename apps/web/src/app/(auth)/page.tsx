"use client";

import { AppLogoWithTranslation } from "@/components/branding/app-logo-with-translation";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import { Paragraph } from "@/components/ui/typography";
import { ThemeToggleButton } from "../../components/theme-toggle";
import { LanguageSwitcher } from "@/components/language-switcher";
import SignInForm from "./_components/sign-in-form";
import { useTranslation } from "@/i18n/hooks/useTranslation";

export default function SignInPage() {
  const { t } = useTranslation("auth");

  return (
    <div className="bg-background fade-in-from-bottom flex h-screen max-h-screen w-screen max-w-screen items-center justify-center overflow-y-hidden p-4">
      <Card className="mx-auto w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="flex items-center justify-between gap-2">
            <AppLogoWithTranslation logoSize="size-8 md:size-16" className="!flex-1" />
            <div className="ml-auto flex items-center gap-2">
              <LanguageSwitcher />
              <ThemeToggleButton />
            </div>
          </CardTitle>
        </CardHeader>

        <CardContent>
          <SignInForm />
        </CardContent>

        <CardFooter>
          <Paragraph size="xs" className="w-full text-center">
            {t("page.footer")}
          </Paragraph>
        </CardFooter>
      </Card>
    </div>
  );
}
