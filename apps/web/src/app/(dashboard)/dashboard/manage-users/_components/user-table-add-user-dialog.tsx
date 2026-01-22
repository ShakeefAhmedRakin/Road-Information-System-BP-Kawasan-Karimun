"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Spinner } from "@/components/ui/spinner";
import { useTranslation } from "@/i18n/hooks/useTranslation";
import { authClient } from "@/lib/auth-client";
import { cn } from "@/lib/utils";
import { emailSchema, passwordSchema } from "@/schemas/auth";
import { zodResolver } from "@hookform/resolvers/zod";
import { USER_ROLES } from "api/src/modules/auth/auth.constants";
import {
  EyeIcon,
  EyeOffIcon,
  LockIcon,
  MailIcon,
  RefreshCwIcon,
  UserIcon,
  UserPlus2,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

// Generate a secure random password
const generatePassword = (length: number = 12): string => {
  const lowercase = "abcdefghijklmnopqrstuvwxyz";
  const uppercase = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const numbers = "0123456789";
  const symbols = "!@#$%^&*";
  const allChars = lowercase + uppercase + numbers + symbols;

  let password = "";
  // Ensure at least one of each type
  password += lowercase[Math.floor(Math.random() * lowercase.length)];
  password += uppercase[Math.floor(Math.random() * uppercase.length)];
  password += numbers[Math.floor(Math.random() * numbers.length)];
  password += symbols[Math.floor(Math.random() * symbols.length)];

  // Fill the rest randomly
  for (let i = password.length; i < length; i++) {
    password += allChars[Math.floor(Math.random() * allChars.length)];
  }

  // Shuffle the password
  return password
    .split("")
    .sort(() => Math.random() - 0.5)
    .join("");
};

export default function UserTableAddUserDialog({
  isLoading,
  refetch,
}: {
  isLoading: boolean;
  refetch: () => void;
}) {
  const { t, locale } = useTranslation("manageUsers");
  const [open, setOpen] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const userAddSchema = useMemo(
    () =>
      z.object({
        name: z.string().min(2, t("addUser.form.name.minLength")),
        email: emailSchema,
        password: passwordSchema,
        role: z.enum([
          USER_ROLES.VISITOR,
          USER_ROLES.OPERATOR,
          USER_ROLES.ADMIN,
        ]),
      }),
    [t]
  );

  const form = useForm<z.infer<typeof userAddSchema>>({
    resolver: zodResolver(userAddSchema),
    mode: "onChange",
    defaultValues: {
      name: "",
      email: "",
      password: "",
      role: USER_ROLES.VISITOR,
    },
  });

  useEffect(() => {
    form.clearErrors();
    form.trigger();
  }, [locale, form]);

  const handleGeneratePassword = () => {
    const newPassword = generatePassword();
    form.setValue("password", newPassword, {
      shouldValidate: true,
      shouldDirty: true,
    });
    toast.success(t("addUser.toasts.passwordGenerated"));
    navigator.clipboard.writeText(newPassword);
  };

  const { isSubmitting, isValid, isDirty } = form.formState;

  // Reset form when dialog opens/closes (native react-hook-form pattern)
  useEffect(() => {
    if (!open) {
      // Reset form to default values when dialog closes
      form.reset();
      setShowPassword(false);
    }
  }, [open, form]);

  const onSubmit = async (values: z.infer<typeof userAddSchema>) => {
    await authClient.admin.createUser(
      {
        email: values.email,
        password: values.password,
        name: values.name,
        role: values.role as any, // Cast to bypass better-auth type restriction
      },
      {
        onSuccess: () => {
          toast.success(t("addUser.toasts.success"));
          setOpen(false);
          refetch();
        },
        onError: (error) => {
          console.error("Create user error:", error);
          toast.error(
            error.error?.message || t("addUser.toasts.error")
          );
        },
      }
    );
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" disabled={isLoading || isSubmitting}>
          <UserPlus2 />
          <span className="hidden md:flex">{t("buttons.createUser")}</span>
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <UserPlus2 className="size-5" /> {t("addUser.title")}
          </DialogTitle>
        </DialogHeader>
        <Separator />
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel
                    className={cn(
                      !form.getFieldState("name").isDirty && "!text-foreground"
                    )}
                  >
                    {t("addUser.form.name.label")}
                  </FormLabel>
                  <FormControl>
                    <InputGroup>
                      <InputGroupAddon>
                        <UserIcon className="size-3.5" />
                      </InputGroupAddon>
                      <InputGroupInput
                        placeholder={t("addUser.form.name.placeholder")}
                        disabled={isSubmitting}
                        {...field}
                      />
                    </InputGroup>
                  </FormControl>
                  <FormMessage
                    className={cn(
                      !form.getFieldState("name").isDirty && "hidden"
                    )}
                  />
                </FormItem>
              )}
            />
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
                    {t("addUser.form.email.label")}
                  </FormLabel>
                  <FormControl>
                    <InputGroup>
                      <InputGroupAddon>
                        <MailIcon className="size-3.5" />
                      </InputGroupAddon>
                      <InputGroupInput
                        placeholder={t("addUser.form.email.placeholder")}
                        type="email"
                        autoComplete="email"
                        disabled={isSubmitting}
                        {...field}
                      />
                    </InputGroup>
                  </FormControl>
                  <FormMessage
                    className={cn(
                      !form.getFieldState("email").isDirty && "hidden"
                    )}
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
                      !form.getFieldState("password").isDirty &&
                        "!text-foreground"
                    )}
                  >
                    {t("addUser.form.password.label")}
                  </FormLabel>
                  <FormControl>
                    <InputGroup>
                      <InputGroupAddon>
                        <LockIcon className="size-3.5" />
                      </InputGroupAddon>
                      <InputGroupInput
                        placeholder={t("addUser.form.password.placeholder")}
                        type={showPassword ? "text" : "password"}
                        autoComplete="new-password"
                        disabled={isSubmitting}
                        {...field}
                      />
                      <InputGroupAddon align="inline-end">
                        <Button
                          type="button"
                          onClick={handleGeneratePassword}
                          disabled={isSubmitting}
                          variant="ghost"
                          size="icon-sm"
                          title={t("addUser.form.password.generate")}
                        >
                          <RefreshCwIcon className="size-3.5" />
                        </Button>
                        <Button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          disabled={isSubmitting}
                          variant="ghost"
                          size="icon-sm"
                          title={
                            showPassword
                              ? t("addUser.form.password.hide")
                              : t("addUser.form.password.show")
                          }
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
            <FormField
              control={form.control}
              name="role"
              render={({ field }) => (
                <FormItem>
                  <FormLabel
                    className={cn(
                      !form.getFieldState("role").isDirty && "!text-foreground"
                    )}
                  >
                    {t("addUser.form.role.label")}
                  </FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    disabled={isSubmitting}
                  >
                    <FormControl className="w-full">
                      <SelectTrigger>
                        <SelectValue placeholder={t("addUser.form.role.placeholder")} />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value={USER_ROLES.VISITOR}>
                        {t("roles.visitor")}
                      </SelectItem>
                      <SelectItem value={USER_ROLES.OPERATOR}>
                        {t("roles.operator")}
                      </SelectItem>
                      <SelectItem value={USER_ROLES.ADMIN}>
                        {t("roles.admin")}
                      </SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage
                    className={cn(
                      !form.getFieldState("role").isDirty && "hidden"
                    )}
                  />
                </FormItem>
              )}
            />
            <div className="flex flex-col gap-2">
              <Button
                type="submit"
                disabled={isSubmitting || !isValid || !isDirty}
              >
                {isSubmitting && <Spinner />}
                {t("buttons.createUser")}
              </Button>
              <Button
                variant="outline"
                onClick={() => setOpen(false)}
                disabled={isSubmitting}
              >
                {t("buttons.cancel")}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
