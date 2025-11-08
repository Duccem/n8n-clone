"use client";
import { authClient } from "@/lib/auth/auth-client";
import { useForm } from "@tanstack/react-form";
import { useRouter } from "next/navigation";
import z from "zod";
import { Label } from "../../../components/ui/label";
import { Input } from "../../../components/ui/input";
import { PasswordInput } from "../../../components/ui/password-input";
import Link from "next/link";
import { Button } from "../../../components/ui/button";
import { Loader2 } from "lucide-react";
import Google from "../../../components/icons/google";
import { toast } from "sonner";
import { GitHub } from "../../../components/icons/github";

const formSchema = z
  .object({
    email: z.email("Invalid email").min(1, "Email required"),
    name: z.string().min(1, "Name required"),
    password: z.string().min(1, "Password required"),
    confirmPassword: z.string().min(1, "Confirm password required"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
  });

export const SignUpForm = () => {
  const router = useRouter();

  // Form setup and handling the submission
  const form = useForm({
    defaultValues: {
      email: "",
      password: "",
      name: "",
      confirmPassword: "",
    },
    validators: {
      onBlur: formSchema,
      onSubmit: formSchema,
    },
    onSubmit: async ({ value }) => {
      await authClient.signUp.email(
        {
          email: value.email,
          password: value.password,
          name: value.name,
        },
        {
          onSuccess: () => {
            router.push("/dashboard");
          },
          onError: (error) => {
            console.error("Sign-in error:", error);
            toast.error(`Sign-up error: ${error.error.message}`);
          },
        }
      );
    },
  });

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
      <form.Field name="name">
        {(field) => (
          <div className="space-y-2">
            <Label htmlFor={field.name}>Name</Label>
            <Input
              id={field.name}
              name={field.name}
              value={field.state.value}
              onBlur={field.handleBlur}
              onChange={(e) => field.handleChange(e.target.value)}
              placeholder="John Doe"
            />
            {field.state.meta.errors.map((error) => (
              <p key={error?.message} className="text-red-500">
                {error?.message}
              </p>
            ))}
          </div>
        )}
      </form.Field>
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
              "Sign Up"
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
        Already have an account?{" "}
        <Link href={"/sign-in"} className="text-blue-500 hover:underline">
          Sign In
        </Link>
      </p>
    </form>
  );
};

