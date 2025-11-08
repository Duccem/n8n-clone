"use client";

import { authClient } from "@/lib/auth/auth-client";
import { useForm } from "@tanstack/react-form";
import { useRouter } from "next/navigation";
import { parseAsString, useQueryState } from "nuqs";
import { toast } from "sonner";
import z from "zod";
import { Label } from "../../../components/ui/label";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "../../../components/ui/input-otp";
import { Button } from "../../../components/ui/button";
import { Loader2 } from "lucide-react";

const formSchema = z.object({
  otp: z.string().min(1, "OTP is required"),
});

export const CheckEmailForm = () => {
  const [email] = useQueryState("email", parseAsString.withDefault(""));
  const router = useRouter();
  const form = useForm({
    defaultValues: {
      otp: "",
    },
    validators: {
      onBlur: formSchema,
      onSubmit: formSchema,
    },
    onSubmit: async ({ value }) => {
      await authClient.emailOtp.checkVerificationOtp(
        {
          otp: value.otp,
          email,
          type: "forget-password",
        },
        {
          onSuccess: () => {
            router.push(`/reset-password?email=${encodeURIComponent(email)}`);
          },
          onError: (error) => {
            console.error("Error verifying OTP:", error);
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
      <form.Field name="otp">
        {(field) => (
          <div className="flex flex-col gap-1">
            <Label htmlFor={field.name}>Verification Code</Label>
            <InputOTP
              maxLength={6}
              id={field.name}
              onBlur={field.handleBlur}
              name={field.name}
              className="w-full flex justify-center"
              value={field.state.value}
              onChange={(e) => field.handleChange(e)}
            >
              <InputOTPGroup className="w-full flex justify-center">
                <InputOTPSlot index={0} />
                <InputOTPSlot index={1} />
                <InputOTPSlot index={2} />
                <InputOTPSlot index={3} />
                <InputOTPSlot index={4} />
                <InputOTPSlot index={5} />
              </InputOTPGroup>
            </InputOTP>
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
              "Verify OTP"
            )}
          </Button>
        )}
      </form.Subscribe>
    </form>
  );
};
