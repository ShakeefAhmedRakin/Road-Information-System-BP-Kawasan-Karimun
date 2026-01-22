"use client";

import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { useTranslation } from "@/i18n/hooks/useTranslation";
import { authClient } from "@/lib/auth-client";
import { orpc } from "@/utils/orpc";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import * as React from "react";
import { toast } from "sonner";

export default function ButtonChangeAvatar() {
  const { t } = useTranslation("account");
  const [isLoading, setIsLoading] = React.useState(false);
  const router = useRouter();
  const updateAvatar = useMutation(orpc.auth.updateAvatar.mutationOptions());

  const fileInputRef = React.useRef<HTMLInputElement | null>(null);

  const handleSelectClick = () => {
    fileInputRef.current?.click();
  };

  const handleChangeAvatar = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) {
      toast.error(t("messages.error.invalidImageFile"));
      return;
    }

    if (!(file.type || "").startsWith("image/")) {
      toast.error(t("messages.error.mustBeImage"));
      return;
    }

    const maxBytes = 1024 * 1024 * 5; // allow up to 5MB; we'll compress
    if (file.size > maxBytes) {
      toast.error(t("messages.error.imageTooLarge"));
      return;
    }

    try {
      setIsLoading(true);
      // Normalize image to a compressed JPEG data URL for consistency
      const output = await updateAvatar.mutateAsync({ file });

      if (output.success) {
        toast.success(t("messages.success.avatarUpdated"));
        // Refetch the session to update the cached user data
        await authClient.getSession();
        router.refresh();
      } else {
        throw new Error("Failed to update avatar");
      }
    } catch (err) {
      toast.error(t("messages.error.avatarUpdateFailed"));
    } finally {
      setIsLoading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  return (
    <>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleChangeAvatar}
        disabled={isLoading}
      />
      <Button
        onClick={handleSelectClick}
        disabled={isLoading}
        aria-busy={isLoading}
      >
        {isLoading ? <Spinner /> : null}
        {t("userCard.changeAvatar")}
      </Button>
    </>
  );
}
