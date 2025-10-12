import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Heading, Paragraph } from "@/components/ui/typography";
import { Lock } from "lucide-react";
import { ThemeToggleButton } from "../../components/theme-toggle";
import SignInForm from "./_components/sign-in-form";
import { AppLogo } from "@/components/branding/app-logo";

export default function SignInPage() {
  return (
    <div className="bg-background fade-in-from-bottom flex h-screen max-h-screen w-screen max-w-screen items-center justify-center overflow-y-hidden p-4">
      <Card className="mx-auto w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="flex items-center justify-between gap-2">
            <AppLogo logoSize="size-8 md:size-16" className="!flex-1" />
            <div className="ml-auto">
              <ThemeToggleButton />
            </div>
          </CardTitle>
        </CardHeader>

        <CardContent>
          <SignInForm />
        </CardContent>

        <CardFooter>
          <Paragraph size="xs" className="w-full text-center">
            For access issues, contact your administrator
          </Paragraph>
        </CardFooter>
      </Card>
    </div>
  );
}
