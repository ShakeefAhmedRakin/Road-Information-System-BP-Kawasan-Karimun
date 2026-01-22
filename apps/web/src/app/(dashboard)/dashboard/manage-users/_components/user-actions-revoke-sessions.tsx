"use client";

import { Button } from "@/components/ui/button";
import { DialogDescription } from "@/components/ui/dialog";
import {
  Item,
  ItemContent,
  ItemDescription,
  ItemMedia,
  ItemTitle,
} from "@/components/ui/item";
import { useTranslation } from "@/i18n/hooks/useTranslation";
import { Spinner } from "@/components/ui/spinner";
import type { UsersAdminUserType } from "@/hooks/admin/useUsersAdmin";
import { authClient } from "@/lib/auth-client";
import { AlertCircleIcon, LockIcon } from "lucide-react";
import { toast } from "sonner";

export default function UserActionsRevokeSessions({
  user,
  isCurrentUser,
  isRevoking,
  setIsRevoking,
  onSuccess,
}: {
  user: UsersAdminUserType;
  isCurrentUser: boolean;
  isRevoking: boolean;
  setIsRevoking: (value: boolean) => void;
  onSuccess: () => void;
}) {
  const { t } = useTranslation("manageUsers");
  const handleRevokeSessions = async () => {
    if (isCurrentUser) {
      toast.error(t("revokeSessions.toasts.cannotRevokeSelf"));
      return;
    }

    setIsRevoking(true);
    try {
      const { data, error } = await authClient.admin.revokeUserSessions({
        userId: user.id,
      });

      if (error) {
        toast.error(error.message || t("revokeSessions.toasts.error"));
        return;
      }

      toast.success(t("revokeSessions.toasts.success"));
      onSuccess();
    } catch (error) {
      toast.error(t("revokeSessions.toasts.error"));
    } finally {
      setIsRevoking(false);
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <h3 className="flex items-center gap-2 text-sm font-semibold">
          <LockIcon className="size-4" /> {t("revokeSessions.title")}
        </h3>
        <DialogDescription className="mt-1.5 text-xs">
          {t("revokeSessions.description")}
        </DialogDescription>
      </div>
      {isCurrentUser ? (
        <Item variant="destructive">
          <ItemMedia>
            <AlertCircleIcon className="text-destructive size-5" />
          </ItemMedia>
          <ItemContent>
            <ItemTitle className="text-destructive">
              {t("revokeSessions.cannotRevokeSelf.title")}
            </ItemTitle>
            <ItemDescription>
              {t("revokeSessions.cannotRevokeSelf.description")}
            </ItemDescription>
          </ItemContent>
        </Item>
      ) : (
        <>
          <Item variant="warning">
            <ItemMedia>
              <AlertCircleIcon className="text-warning size-5" />
            </ItemMedia>
            <ItemContent>
              <ItemTitle className="text-warning-foreground">
                {t("revokeSessions.warning.title")}
              </ItemTitle>
              <ItemDescription>
                {t("revokeSessions.warning.description")}
              </ItemDescription>
            </ItemContent>
          </Item>
          <Button
            variant="destructive"
            onClick={handleRevokeSessions}
            disabled={isRevoking}
            className="w-full"
          >
            {isRevoking && <Spinner />}
            {t("revokeSessions.button")}
          </Button>
        </>
      )}
    </div>
  );
}
