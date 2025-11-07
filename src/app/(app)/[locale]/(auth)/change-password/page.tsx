import { ChangePasswordForm } from "@/components/auth/change-password-form";

export default function Page() {
  return (
    <div className="flex flex-col items-center justify-center w-full">
      <h1 className="font-normal text-3xl">Change password</h1>
      <h2 className="font-light text-lg">
        Enter your new password below to change your account password.
      </h2>
      <ChangePasswordForm />
    </div>
  );
}

