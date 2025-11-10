"use client";

import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth/auth-client";
import { LogOut } from "lucide-react";
import { useRouter } from "next/navigation";

const LogOutButton = () => {
  const router = useRouter();
  return (
    <Button
      variant={"ghost"}
      className="w-full justify-start"
      onClick={async () => {
        await authClient.signOut(
          {},
          {
            onSuccess: () => {
              router.replace("/sign-in");
            },
          }
        );
      }}
    >
      <LogOut />
      Log Out
    </Button>
  );
};

export default LogOutButton;

