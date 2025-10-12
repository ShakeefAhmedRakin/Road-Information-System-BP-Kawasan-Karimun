"use client";

import { useState } from "react";

import { AppLogo } from "@/components/branding/app-logo";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import type { UserRole } from "api/src/modules/auth/auth.constants";
import type { User } from "better-auth";
import { Menu, X } from "lucide-react";
import { Card, CardContent, CardFooter } from "../../../components/ui/card";
import { getRoutesForRole } from "../../../config/route-helpers";
import DashboardNavigationItem from "./dashboard-navigation-item";
import DashboardUserCard from "./dashboard-user-card";
import SignOutButton from "./sign-out-button";

export function DashboardMobileNavigation({
  user,
  userRole,
}: {
  user: User | null;
  userRole: UserRole | null;
}) {
  const [isOpen, setIsOpen] = useState(false);

  const handleClose = () => {
    setTimeout(() => setIsOpen(false), 200);
  };

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" onClick={() => setIsOpen(true)}>
          {isOpen ? <X /> : <Menu />}
          <span className="sr-only">Toggle menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent
        side="right"
        className="bg-card z-[501] w-80 p-5 backdrop-blur-lg"
      >
        <SheetHeader className="-mb-3 -ml-5">
          <SheetTitle className="w-fit">
            <AppLogo />
          </SheetTitle>
        </SheetHeader>

        <Separator />
        <ul className="flex w-full flex-col gap-2">
          {getRoutesForRole(userRole).map((route) => (
            <DashboardNavigationItem
              key={route.title}
              {...route}
              onClick={handleClose}
            />
          ))}
        </ul>
        {/* BOTTOM  */}
        <div className="flex w-full flex-1 items-end">
          {user && (
            <Card className="w-full !p-4">
              <CardContent className="!px-0 !py-0">
                <DashboardUserCard user={user} />
              </CardContent>
              <CardFooter className="!px-0 !py-0">
                <SignOutButton />
              </CardFooter>
            </Card>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
