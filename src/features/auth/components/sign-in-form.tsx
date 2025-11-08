"use client";

import { authClient } from "@/lib/auth/auth-client";
import { useForm } from "@tanstack/react-form";
import { useRouter } from "next/navigation";
import z from "zod";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { PasswordInput } from "@/components/ui/password-input";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import Link from "next/link";
import Google from "@/components/icons/google";
import { toast } from "sonner";
import { GitHub } from "@/components/icons/github";

const formSchema = z.object({
  email: z.email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters long"),
});

export const SignInForm = () => {
  const router = useRouter();

  // Form setup and handling the submission
  const form = useForm({
    defaultValues: {
      email: "",
      password: "",
    },
    validators: {
      onBlur: formSchema,
      onSubmit: formSchema,
    },
    onSubmit: async ({ value }) => {
      await authClient.signIn.email(
        {
          email: value.email,
          password: value.password,
        },
        {
          onSuccess: () => {
            router.push("/dashboard");
          },
          onError: (error) => {
            console.error("Sign-in error:", error);
            toast.error(`Sign-in error: ${error.error.message}`);
          },
        }
      );
    },
  });

  // OAuth sign-in handler
  const oauthSignIn = async (provider: "google" | "github") => {
    try {
      await authClient.signIn.social({
        provider,
        callbackURL: `${window.location.origin}/dashboard`,
      });
    } catch (error) {
      console.error("OAuth sign-in error:", error);
    }
  };

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
      <form.Field name="email">
        {(field) => (
          <div className="space-y-2">
            <Label htmlFor={field.name}>Email</Label>
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
      <div className="flex items-center justify-between">
        <Link
          href={"/forget-password"}
          className="text-blue-500 hover:underline"
        >
          Forgot password?
        </Link>
      </div>
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
              "Sign In"
            )}
          </Button>
        )}
      </form.Subscribe>
      <div className="flex justify-between items-center gap-2">
        <div className="flex-1 w-full bg-white h-px" />
        <span>Or login with</span>
        <div className="flex-1 w-full bg-white h-px" />
      </div>
      <div className="flex items-center gap-3 w-full">
        <Button
          variant={"outline"}
          className="flex-1"
          type="button"
          onClick={() => oauthSignIn("google")}
        >
          <Google />
          Google
        </Button>
        <Button
          variant={"outline"}
          className="flex-1"
          type="button"
          onClick={() => oauthSignIn("github")}
        >
          <GitHub />
          Github
        </Button>
      </div>
      <p className="font-light text-center text-md">
        Don't have an account?{" "}
        <Link href={"/sign-up"} className="text-blue-500 hover:underline">
          Sign Up
        </Link>
      </p>
    </form>
  );
};

