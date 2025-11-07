import { SignInForm } from "@/components/auth/sign-in-form";
import { requireAnon } from "@/lib/auth/utils/require-auth";

export default async function page() {
  await requireAnon();
  return (
    <div className="flex flex-col items-center justify-center w-full">
      <h1 className="font-normal text-3xl">Welcome back</h1>
      <h2 className="font-light text-lg">
        Enter your email and password to access your account.
      </h2>
      <SignInForm />
    </div>
  );
}

