"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth/auth-client";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

type Props = {
  invitationId: string;
  isAuthenticated: boolean;
};

export default function AcceptInvitationClient({
  invitationId,
  isAuthenticated,
}: Props) {
  const router = useRouter();
  const [redirectTo, setRedirectTo] = useState<string>("");
  const [accepting, setAccepting] = useState(false);

  useEffect(() => {
    // Build an absolute URL back to this page to complete the flow after sign-in
    if (typeof window !== "undefined") {
      setRedirectTo(window.location.href);
    }
  }, []);

  const onAccept = async () => {
    try {
      setAccepting(true);
      const { error } = await authClient.organization.acceptInvitation({
        invitationId,
      });
      if (error) {
        toast.error(error.message ?? "Failed to accept the invitation.");
        return;
      }
      toast.success("Invitation accepted. Welcome!");
      router.push("/dashboard");
    } catch (err: any) {
      toast.error(err?.message ?? "Failed to accept the invitation.");
    } finally {
      setAccepting(false);
    }
  };

  if (!isAuthenticated) {
    const fallbackPath = `/accept-invitation?invitationId=${encodeURIComponent(
      invitationId
    )}`;
    const signInHref = `/sign-in?redirectTo=${encodeURIComponent(
      redirectTo || fallbackPath
    )}`;
    const signUpHref = `/sign-up?redirectTo=${encodeURIComponent(
      redirectTo || fallbackPath
    )}`;

    return (
      <div className="flex flex-col items-center gap-4 max-w-md text-center">
        <p className="text-sm text-muted-foreground">
          You need to be signed in to accept this invitation.
        </p>
        <div className="flex gap-3 w-full justify-center">
          <Link href={signInHref} className="w-1/2">
            <Button className="w-full">Sign in</Button>
          </Link>
          <Link href={signUpHref} className="w-1/2">
            <Button variant="outline" className="w-full">
              Create account
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center gap-4 max-w-md text-center">
      <p className="text-sm text-muted-foreground">
        Click the button below to accept the invitation and join the
        organization.
      </p>
      <Button onClick={onAccept} disabled={accepting} className="min-w-40">
        {accepting ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          "Accept invitation"
        )}
      </Button>
    </div>
  );
}

