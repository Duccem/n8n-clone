import { ForgetPasswordForm } from "@/components/auth/forget-password-form";

export default function Page() {
  return (
    <div className="flex flex-col items-center justify-center w-full">
      <h1 className="font-normal text-3xl">Reset Password</h1>
      <h2 className="font-light text-lg">
        Enter your email address and we'll send you a reset link.
      </h2>
      <ForgetPasswordForm />
    </div>
  );
}
