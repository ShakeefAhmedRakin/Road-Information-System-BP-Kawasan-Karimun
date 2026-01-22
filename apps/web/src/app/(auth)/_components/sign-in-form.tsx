"use client";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import { Spinner } from "@/components/ui/spinner";
import { StaticRoutes } from "@/config/static-routes";
import { authClient } from "@/lib/auth-client";
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { EyeIcon, EyeOffIcon, LockIcon, MailIcon } from "lucide-react";
import { useState, useMemo, useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { useTranslation } from "@/i18n/hooks/useTranslation";
import { useLanguage } from "@/i18n/context/LanguageContext";

export default function SignInForm() {
  const [showPassword, setShowPassword] = useState(false);
  const { t, translateError } = useTranslation("auth");
  const { locale } = useLanguage();

  // Create schema with translated error messages
  const SignInSchema = useMemo(
    () =>
      z.object({
        email: z.string().email(t("messages.validation.email.invalid")),
        password: z
          .string()
          .min(8, t("messages.validation.password.minLength")),
      }),
    [t]
  );

  const form = useForm<z.infer<typeof SignInSchema>>({
    resolver: zodResolver(SignInSchema),
    mode: "onChange",
    defaultValues: {
      email: "",
      password: "",
    },
  });

  // Update resolver when language changes
  useEffect(() => {
    form.clearErrors();
    // Re-validate if form has been touched
    if (form.formState.isDirty) {
      form.trigger();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [locale]);

  const { isSubmitting, isValid, isDirty } = form.formState;

  const onSubmit = async (values: z.infer<typeof SignInSchema>) => {
    try {
      await authClient.signIn.email(
        {
          email: values.email,
          password: values.password,
        },
        {
          onSuccess: () => {
            //
            form.reset();
            toast.success(t("messages.success.signIn"));
            // Use hard navigation to ensure all caches are cleared and fresh data is loaded
            window.location.href = StaticRoutes.DASHBOARD;
          },
          onError: (error) => {
            console.error("Sign in error:", error);
            const errorMessage = error.error?.message || "";
            toast.error(
              errorMessage
                ? translateError(errorMessage)
                : t("messages.error.signInFailed")
            );
            form.setValue("password", "");
          },
        }
      );
    } catch (error) {
      console.error("Unexpected error:", error);
      toast.error(t("messages.error.unexpectedError"));
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel
                className={cn(
                  !form.getFieldState("email").isDirty && "!text-foreground"
                )}
              >
                {t("form.email.label")}
              </FormLabel>
              <FormControl>
                <InputGroup>
                  <InputGroupAddon>
                    <MailIcon className="size-3.5" />
                  </InputGroupAddon>
                  <InputGroupInput
                    placeholder={t("form.email.placeholder")}
                    type="email"
                    autoComplete="email"
                    disabled={isSubmitting}
                    {...field}
                  />
                </InputGroup>
              </FormControl>
              <FormMessage
                className={cn(!form.getFieldState("email").isDirty && "hidden")}
              />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel
                className={cn(
                  !form.getFieldState("password").isDirty && "!text-foreground"
                )}
              >
                {t("form.password.label")}
              </FormLabel>
              <FormControl>
                <InputGroup>
                  <InputGroupAddon>
                    <LockIcon className="size-3.5" />
                  </InputGroupAddon>
                  <InputGroupInput
                    placeholder={t("form.password.placeholder")}
                    type={showPassword ? "text" : "password"}
                    autoComplete="current-password"
                    disabled={isSubmitting}
                    {...field}
                  />
                  <InputGroupAddon align="inline-end">
                    <Button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      disabled={isSubmitting}
                      variant="ghost"
                      size="icon-sm"
                    >
                      {showPassword ? (
                        <EyeOffIcon className="size-3.5" />
                      ) : (
                        <EyeIcon className="size-3.5" />
                      )}
                    </Button>
                  </InputGroupAddon>
                </InputGroup>
              </FormControl>
              <FormMessage
                className={cn(
                  !form.getFieldState("password").isDirty && "hidden"
                )}
              />
            </FormItem>
          )}
        />
        <Button
          type="submit"
          className="w-full"
          disabled={isSubmitting || !isValid || !isDirty}
        >
          {isSubmitting && <Spinner />}
          {t("form.submit")}
        </Button>
      </form>
    </Form>
  );
}
