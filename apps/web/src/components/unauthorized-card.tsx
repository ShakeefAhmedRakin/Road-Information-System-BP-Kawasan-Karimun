"use client";

import { ShieldX } from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "./ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";
import PageLayout from "./ui/page-layout";
import { Heading, Paragraph } from "./ui/typography";

export default function UnauthorizedCard() {
  const router = useRouter();

  return (
    <PageLayout
      showHeader={false}
      contained
      containerClassName="flex items-center justify-center"
    >
      <Card className="mx-auto w-full max-w-md">
        <CardHeader className="text-center">
          <div className="bg-destructive/10 mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full">
            <ShieldX className="text-destructive h-8 w-8" />
          </div>
          <CardTitle className="text-xl">
            <Heading level="h4">Access Denied</Heading>
          </CardTitle>
        </CardHeader>
        <CardContent className="text-center">
          <Paragraph className="text-muted-foreground" size="sm">
            You don't have permission to access this page. Please contact an
            administrator if you believe this is an error.
          </Paragraph>
        </CardContent>
        <CardFooter>
          <Button
            onClick={() => router.back()}
            variant="outline"
            className="w-full"
          >
            Go Back
          </Button>
        </CardFooter>
      </Card>
    </PageLayout>
  );
}
