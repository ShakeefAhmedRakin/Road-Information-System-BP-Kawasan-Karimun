"use client";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import { Spinner } from "@/components/ui/spinner";
import { authClient } from "@/lib/auth-client";
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import type { User } from "better-auth";
import { UserIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import * as React from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import {
  Paragraph,
  paragraphVariants,
} from "../../../../../components/ui/typography";

const updateNameSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
});

export default function AccountsNameUpdate({ user }: { user: User }) {
  const router = useRouter();
  const [shouldResetOnBlur, setShouldResetOnBlur] = React.useState(true);

  const form = useForm<z.infer<typeof updateNameSchema>>({
    resolver: zodResolver(updateNameSchema),
    mode: "onChange",
    defaultValues: { name: user.name },
  });

  React.useEffect(() => {
    form.reset({ name: user.name });
  }, [user.name, form]);

  const { isSubmitting, isValid, isDirty } = form.formState;

  const onSubmit = async (values: z.infer<typeof updateNameSchema>) => {
    try {
      await authClient.updateUser({ name: values.name });
      router.refresh();
      toast.success("Name updated successfully");
    } catch (error) {
      toast.error("Failed to update name");
    }
  };

  const handleCancel = () => {
    form.reset({ name: user.name });
  };

  const handleBlur = (e: React.FocusEvent) => {
    // Don't reset if the focus is moving to a button
    const relatedTarget = e.relatedTarget as HTMLElement;
    if (
      relatedTarget &&
      (relatedTarget.id === "save-name-button" ||
        relatedTarget.id === "cancel-name-button" ||
        relatedTarget.closest('[id="save-name-button"]') ||
        relatedTarget.closest('[id="cancel-name-button"]'))
    ) {
      return;
    }

    // Reset to original value if no changes were saved
    if (form.formState.isDirty && shouldResetOnBlur) {
      form.reset({ name: user.name });
    }
  };

  const handleButtonMouseDown = () => {
    setShouldResetOnBlur(false);
  };

  const handleButtonMouseUp = () => {
    // Reset the flag after a short delay to allow blur to complete
    setTimeout(() => setShouldResetOnBlur(true), 100);
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex items-end gap-2"
      >
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem className="flex-1">
              <div>
                <h2
                  className={paragraphVariants({
                    size: "sm",
                    className: "font-semibold",
                  })}
                >
                  Full Name
                </h2>
                <Paragraph size="xs" className="text-muted-foreground mt-0.5">
                  Update your full name
                </Paragraph>
              </div>
              <FormControl>
                <InputGroup>
                  <InputGroupAddon>
                    <UserIcon className="size-3.5" />
                  </InputGroupAddon>
                  <InputGroupInput
                    placeholder="Enter your full name"
                    disabled={isSubmitting}
                    {...field}
                    onBlur={(e) => {
                      field.onBlur();
                      handleBlur(e);
                    }}
                  />
                </InputGroup>
              </FormControl>
              <FormMessage
                className={cn(!form.getFieldState("name").isDirty && "hidden")}
              />
            </FormItem>
          )}
        />
        <div className="flex gap-2">
          {isDirty && (
            <Button
              id="save-name-button"
              type="submit"
              className="flex-1"
              disabled={isSubmitting || !isValid || !isDirty}
              onMouseDown={handleButtonMouseDown}
              onMouseUp={handleButtonMouseUp}
              onMouseLeave={handleButtonMouseUp}
            >
              {isSubmitting && <Spinner />}
              Save
            </Button>
          )}
          {isDirty && (
            <Button
              id="cancel-name-button"
              type="button"
              variant="outline"
              className="flex-1"
              onClick={handleCancel}
              disabled={isSubmitting}
              onMouseDown={handleButtonMouseDown}
              onMouseUp={handleButtonMouseUp}
              onMouseLeave={handleButtonMouseUp}
            >
              Cancel
            </Button>
          )}
        </div>
      </form>
    </Form>
  );
}
