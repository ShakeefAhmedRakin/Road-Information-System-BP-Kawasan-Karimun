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
  const handleRevokeSessions = async () => {
    if (isCurrentUser) {
      toast.error("You cannot revoke your own sessions");
      return;
    }

    setIsRevoking(true);
    try {
      const { data, error } = await authClient.admin.revokeUserSessions({
        userId: user.id,
      });

      if (error) {
        toast.error(error.message || "Failed to revoke sessions");
        return;
      }

      toast.success("All user sessions revoked successfully");
      onSuccess();
    } catch (error) {
      toast.error("Failed to revoke sessions");
    } finally {
      setIsRevoking(false);
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <h3 className="flex items-center gap-2 text-sm font-semibold">
          <LockIcon className="size-4" /> Session Management
        </h3>
        <DialogDescription className="mt-1.5 text-xs">
          Revoke all active sessions for this user
        </DialogDescription>
      </div>
      {isCurrentUser ? (
        <Item variant="destructive">
          <ItemMedia>
            <AlertCircleIcon className="text-destructive size-5" />
          </ItemMedia>
          <ItemContent>
            <ItemTitle className="text-destructive">
              Cannot Revoke Own Sessions
            </ItemTitle>
            <ItemDescription>
              You cannot revoke your own sessions. This would log you out
              immediately.
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
              <ItemTitle className="text-warning-foreground">Warning</ItemTitle>
              <ItemDescription>
                This will immediately log out the user from all devices and
                require them to sign in again.
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
            Revoke All Sessions
          </Button>
        </>
      )}
    </div>
  );
}
