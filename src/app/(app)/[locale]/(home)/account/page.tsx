import { ChangePassword } from "@/features/account/components/change-password";
import { DeleteAccount } from "@/features/account/components/delete-account";
import {
  UserDetails,
  UserDetailsSkeleton,
} from "@/features/account/components/user-data-form";
import { Suspense } from "react";

export default async function Page() {
  return (
    <div className="flex flex-col md:w-1/2 gap-4 p-6">
      <div>
        <h1 className="text-2xl font-bold">Account</h1>
        <p className="text-muted-foreground">
          Manage your account details and settings.
        </p>
      </div>
      <Suspense fallback={<UserDetailsSkeleton />}>
        <UserDetails />
      </Suspense>
      <ChangePassword />
      <DeleteAccount />
    </div>
  );
}

