import { SignUpForm } from "@/components/auth/sign-up-form";

export default function page() {
  return (
    <div className="flex flex-col items-center justify-center w-full">
      <h1 className="font-normal text-3xl">Create Account</h1>
      <h2 className="font-light text-lg">
        Create a new account to get started with Nodebase.
      </h2>
      <SignUpForm />
    </div>
  );
}
