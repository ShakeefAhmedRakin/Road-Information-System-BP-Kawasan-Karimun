"use client";
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

  return (
    <Button
      variant="destructive"
      aria-label="Sign Out"
      className="w-full"
      disabled={signingOut}
      title="Sign Out"
      onClick={() => {
        setSigningOut(true);
        authClient.signOut({
          fetchOptions: {
            onSuccess: () => {
              toast.success("Signed out!");
              // Use hard navigation to ensure all caches are cleared
              window.location.href = StaticRoutes.SIGN_IN;
            },
            onError: (error) => {
              console.error("Sign out error:", error);
              toast.error("Failed to sign out. Please try again.");
            },
            onFinally: () => setSigningOut(false),
          },
        });
      }}
    >
      {signingOut ? <Spinner /> : <LogOut />} Sign Out
    </Button>
  );
}
