"use client";

import { Button } from "@/components/ui/button";
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemTitle,
} from "@/components/ui/item";
import { useTranslation } from "@/i18n/hooks/useTranslation";
import type { Session } from "better-auth";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { Badge } from "../../../../../components/ui/badge";
import { Spinner } from "../../../../../components/ui/spinner";
import { paragraphVariants } from "../../../../../components/ui/typography";
import { authClient } from "../../../../../lib/auth-client";
import { cn } from "../../../../../lib/utils";

function parseUserAgent(userAgent: string, t: (key: string) => string) {
  // Simple parser for common browsers and OS
  let browser = t("sessions.unknownBrowser");
  let os = t("sessions.unknownOS");

  // Detect browser
  if (userAgent.includes("Chrome") && !userAgent.includes("Edg")) {
    browser = "Chrome";
  } else if (userAgent.includes("Safari") && !userAgent.includes("Chrome")) {
    browser = "Safari";
  } else if (userAgent.includes("Firefox")) {
    browser = "Firefox";
  } else if (userAgent.includes("Edg")) {
    browser = "Edge";
  }

  // Detect OS
  if (userAgent.includes("Windows")) {
    os = "Windows";
  } else if (userAgent.includes("Mac OS")) {
    os = "macOS";
  } else if (userAgent.includes("Linux")) {
    os = "Linux";
  } else if (userAgent.includes("Android")) {
    os = "Android";
  } else if (userAgent.includes("iOS") || userAgent.includes("iPhone")) {
    os = "iOS";
  }

  return { browser, os };
}

function formatDate(date: Date, t: (key: string, params?: Record<string, number>) => string) {
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);

  if (minutes < 1) return t("sessions.justNow");
  if (minutes < 60) return t("sessions.minutesAgo", { minutes });
  if (hours < 24) return t("sessions.hoursAgo", { hours });
  if (days < 7) return t("sessions.daysAgo", { days });

  return date.toLocaleDateString();
}

function SessionItem({
  session,
  isCurrentSession,
}: {
  session: Session;
  isCurrentSession: boolean;
}) {
  const router = useRouter();
  const { t } = useTranslation("account");
  const [isRevoking, setIsRevoking] = useState(false);
  const { browser, os } = parseUserAgent(session.userAgent || "", t);

  const handleRevoke = async () => {
    try {
      setIsRevoking(true);
      await authClient.revokeSession({
        token: session.token,
      });
      router.refresh();
      toast.success(t("messages.success.sessionRevoked"));
    } catch (error) {
      toast.error(t("messages.error.sessionRevokeFailed"));
    } finally {
      setIsRevoking(false);
    }
  };

  return (
    <Item
      variant={"outline"}
      size={"sm"}
      className={cn(
        "transition-all",
        isCurrentSession && "border-primary/40 bg-primary/5"
      )}
    >
      <ItemContent className="gap-1.5">
        <div className="flex items-center gap-2">
          <ItemTitle className="!text-xs font-medium">
            {browser} {t("sessions.on")} {os}
          </ItemTitle>
          {isCurrentSession && (
            <Badge variant="secondary" className="px-1.5 !text-[9px]">
              {t("sessions.current")}
            </Badge>
          )}
        </div>
        <ItemDescription
          className={cn(paragraphVariants({ size: "xs" }), "space-y-0.5")}
        >
          {session.ipAddress && (
            <>
              {t("sessions.ip")}: {session.ipAddress}
              <br />
            </>
          )}
          {session.updatedAt && (
            <>{t("sessions.lastActive")}: {formatDate(new Date(session.updatedAt), t)}</>
          )}
        </ItemDescription>
      </ItemContent>
      <ItemActions className="flex items-center justify-end">
        <Button
          variant={isCurrentSession ? "outline" : "destructive"}
          size={"sm"}
          className="text-xs"
          onClick={handleRevoke}
          disabled={isRevoking || isCurrentSession}
          title={
            isCurrentSession
              ? t("sessions.cannotRevokeCurrent")
              : t("sessions.revokeThisSession")
          }
        >
          {isRevoking && <Spinner className="mr-1" />}
          {isCurrentSession ? t("sessions.active") : t("sessions.revoke")}
        </Button>
      </ItemActions>
    </Item>
  );
}

export default function AccountsSessions({
  sessions,
  currentSession,
}: {
  sessions: Session[];
  currentSession: Session;
}) {
  const { t } = useTranslation("account");
  const sortedSessions = [...sessions].sort((a, b) => {
    if (a.id === currentSession.id) return -1;
    if (b.id === currentSession.id) return 1;
    return 0;
  });

  return (
    <div className="w-full space-y-2">
      <div>
        <h2
          className={paragraphVariants({
            size: "sm",
            className: "font-semibold",
          })}
        >
          {t("sessions.title")}
        </h2>
        <p
          className={cn(
            paragraphVariants({ size: "xs" }),
            "text-muted-foreground mt-0.5"
          )}
        >
          {t("sessions.description")}
        </p>
      </div>
      <div className="flex flex-col gap-2.5">
        {sortedSessions.map((session) => (
          <SessionItem
            key={session.id}
            session={session}
            isCurrentSession={currentSession.id === session.id}
          />
        ))}
      </div>
    </div>
  );
}
