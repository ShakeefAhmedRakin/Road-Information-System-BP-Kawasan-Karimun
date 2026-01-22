"use client";
import { useTranslation } from "@/i18n/hooks/useTranslation";
import { authClient } from "@/lib/auth-client";
import { LogOut } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "../../../components/ui/button";
import { Spinner } from "../../../components/ui/spinner";
import { StaticRoutes } from "../../../config/static-routes";

export default function SignOutButton() {
  const router = useRouter();
  const [signingOut, setSigningOut] = useState(false);
  const { t } = useTranslation("dashboard");

  return (
    <Button
      variant="destructive"
      aria-label={t("user.signOut")}
      className="w-full"
      disabled={signingOut}
      title={t("user.signOut")}
      onClick={() => {
        setSigningOut(true);
        authClient.signOut({
          fetchOptions: {
            onSuccess: () => {
              toast.success(t("messages.success.signedOut"));
              // Use hard navigation to ensure all caches are cleared
              window.location.href = StaticRoutes.SIGN_IN;
            },
            onError: (error) => {
              console.error("Sign out error:", error);
              toast.error(t("messages.error.signOutFailed"));
            },
            onFinally: () => setSigningOut(false),
          },
        });
      }}
    >
      {signingOut ? <Spinner /> : <LogOut />} {t("user.signOut")}
    </Button>
  );
}
