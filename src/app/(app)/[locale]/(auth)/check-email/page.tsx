import { CheckEmailForm } from "@/components/auth/check-email-form";

export default function Page() {
  return (
    <div className="flex flex-col items-center justify-center w-full">
      <h1 className="font-normal text-3xl">Verify OTP</h1>
      <h2 className="font-light text-lg">
        Enter the OTP sent to your email to verify your account.
      </h2>
      <CheckEmailForm />
    </div>
  );
}
