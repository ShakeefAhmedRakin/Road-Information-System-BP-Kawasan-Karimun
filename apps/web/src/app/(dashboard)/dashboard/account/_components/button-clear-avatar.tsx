"use client";

import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { useTranslation } from "@/i18n/hooks/useTranslation";
import { useRouter } from "next/navigation";
import * as React from "react";
import { toast } from "sonner";
import { authClient } from "../../../../../lib/auth-client";

export default function ButtonClearAvatar(
  props: React.ComponentProps<typeof Button>
) {
  const { disabled, ...rest } = props;
  const { t } = useTranslation("account");
  const [isLoading, setIsLoading] = React.useState(false);
  const router = useRouter();
  const handleClear = async () => {
    try {
      setIsLoading(true);
      await authClient.updateUser({ image: null });
      // Refetch the session to update the cached user data
      await authClient.getSession();
      router.refresh();
      toast.success(t("messages.success.avatarCleared"));
    } catch (err) {
      toast.error(t("messages.error.avatarClearFailed"));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button
      variant="secondary"
      onClick={handleClear}
      disabled={disabled || isLoading}
      aria-busy={isLoading}
      {...rest}
    >
      {isLoading ? <Spinner /> : null}
      {t("userCard.clearAvatar")}
    </Button>
  );
}
