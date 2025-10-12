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

export default function SignInPage() {
  return (
    <div className="bg-background fade-in-from-bottom flex h-screen max-h-screen w-screen max-w-screen items-center justify-center overflow-y-hidden p-4">
      <Card className="mx-auto w-full max-w-md">
        <CardHeader className="space-y-1">
          <div className="flex items-center gap-2">
            <div className="bg-primary flex h-8 w-8 items-center justify-center rounded-md">
              <Lock className="text-primary-foreground h-4 w-4" />
            </div>
            <CardTitle>
              <Heading level="h5">Internal Portal</Heading>
            </CardTitle>
            <div className="ml-auto">
              <ThemeToggleButton />
            </div>
          </div>
          <CardDescription>
            <Paragraph size="sm" className="font-medium">
              Sign in to access your dashboard
            </Paragraph>
          </CardDescription>
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
