"use client";

import { authClient } from "@/lib/auth/auth-client";
import { useForm } from "@tanstack/react-form";
import { useRouter } from "next/navigation";
import { parseAsString, useQueryStates } from "nuqs";
import { toast } from "sonner";
import z from "zod";
import { Label } from "../../../components/ui/label";
import { PasswordInput } from "../../../components/ui/password-input";
import { Button } from "../../../components/ui/button";
import { Loader2 } from "lucide-react";

const formSchema = z
  .object({
    password: z
      .string()
      .min(8, "La contraseña debe tener al menos 8 caracteres"),
    confirmPassword: z
      .string()
      .min(
        8,
        "La confirmación de la contraseña debe tener al menos 8 caracteres"
      ),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Las contraseñas no coinciden",
  });

export const ChangePasswordForm = () => {
  const router = useRouter();

  const [state] = useQueryStates({
    email: parseAsString.withDefault(""),
    otp: parseAsString.withDefault(""),
  });

  const form = useForm({
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
    validators: {
      onBlur: formSchema,
      onSubmit: formSchema,
    },
    onSubmit: async ({ value }) => {
      await authClient.emailOtp.resetPassword(
        {
          email: state.email,
          password: value.password,
          otp: state.otp,
        },
        {
          onSuccess: () => {
            router.push("/dashboard");
          },
          onError: (error) => {
            console.error("Error resetting password:", error);
            toast.error(`Error: ${error.error.message}`);
          },
        }
      );
    },
  });

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        e.stopPropagation();
        form.handleSubmit(e);
      }}
      className="flex flex-col w-2/3 gap-4 mt-6"
    >
      <form.Field name="password">
        {(field) => (
          <div className="space-y-2">
            <Label htmlFor={field.name}>Password</Label>
            <PasswordInput
              id={field.name}
              name={field.name}
              value={field.state.value}
              onBlur={field.handleBlur}
              onChange={(e) => field.handleChange(e.target.value)}
            />
            {field.state.meta.errors.map((error) => (
              <p key={error?.message} className="text-red-500">
                {error?.message}
              </p>
            ))}
          </div>
        )}
      </form.Field>
      <form.Field name="confirmPassword">
        {(field) => (
          <div className="space-y-2">
            <Label htmlFor={field.name}>Confirm password</Label>
            <PasswordInput
              id={field.name}
              name={field.name}
              value={field.state.value}
              onBlur={field.handleBlur}
              onChange={(e) => field.handleChange(e.target.value)}
            />
            {field.state.meta.errors.map((error) => (
              <p key={error?.message} className="text-red-500">
                {error?.message}
              </p>
            ))}
          </div>
        )}
      </form.Field>
      <form.Subscribe>
        {(state) => (
          <Button
            type="submit"
            className="w-full"
            disabled={!state.canSubmit || state.isSubmitting}
          >
            {state.isSubmitting ? (
              <Loader2 className="animate-spin" />
            ) : (
              "Change Password"
            )}
          </Button>
        )}
      </form.Subscribe>
    </form>
  );
};
