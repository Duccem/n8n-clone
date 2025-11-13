import { getSession } from "@/lib/auth/utils/get-session";
import { Suspense } from "react";
import AcceptInvitationClient from "@/features/organization/components/accept-invitation";

type PageProps = {
  searchParams: Promise<{ invitationId?: string }>;
};

export default async function Page({ searchParams }: PageProps) {
  const session = await getSession();
  const invitationId = (await searchParams)?.invitationId;

  if (!invitationId) {
    return (
      <div className="flex flex-col items-center justify-center w-full gap-2 p-6">
        <h1 className="text-3xl font-semibold">Invalid invitation link</h1>
        <p className="text-muted-foreground">
          The invitation token is missing or invalid. Please check the link you
          received.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center w-full p-6">
      <h1 className="text-3xl font-semibold mb-2">Accept invitation</h1>
      <p className="text-muted-foreground mb-6">
        Join the organization by accepting the invitation below.
      </p>
      <Suspense fallback={<div className="text-sm">Loading…</div>}>
        <AcceptInvitationClient
          invitationId={invitationId}
          isAuthenticated={!!session}
        />
      </Suspense>
    </div>
  );
}

