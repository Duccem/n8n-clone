'use client';

import { authClient } from "@/lib/auth/auth-client";
import { useForm } from "@tanstack/react-form";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import z from "zod";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Loader2 } from "lucide-react";
import Link from "next/link";

const formSchema = z.object({
  email: z
    .email("Please enter a valid email address")
    .min(1, "Email is required"),
});

export const ForgetPasswordForm = () => {
  const router = useRouter();
  const form = useForm({
    defaultValues: {
      email: '',
    },
    validators: {
      onBlur: formSchema,
      onSubmit: formSchema
    },
    onSubmit: async ({ value }) => {
      await authClient.emailOtp.sendVerificationOtp(
        {
          email: value.email,
          type: "forget-password",
        },
        {
          onSuccess: () => {
            router.push('/auth/check-email');
          },
          onError: (error) => {
            console.error("Error sending verification OTP:", error);
            toast.error(`Error: ${error.error.message}`);
          }
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

      <form.Field name="email">
        {(field) => (
          <div className="space-y-2">
            <Label htmlFor={field.name}>Email</Label>
            <Input
              id={field.name}
              name={field.name}
              type="email"
              value={field.state.value}
              onBlur={field.handleBlur}
              onChange={(e) => field.handleChange(e.target.value)}
              placeholder="doe@example.com"
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
            {state.isSubmitting ? <Loader2 className="animate-spin" /> : "Send Email"}
          </Button>
        )}
      </form.Subscribe>
      <p className="font-light text-center text-md">
        Remember your password?{" "}
        <Link href={"/sign-up"} className="text-blue-500 hover:underline">
          Back to login
        </Link>
      </p>
    </form>
  )
}