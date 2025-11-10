import InviteMember from "@/features/organization/components/invite-member";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { auth } from "@/lib/auth/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import ListPendingInvitations from "@/features/organization/components/pending-invitations";
import { Suspense } from "react";
import ListOrganizationMembers from "@/features/organization/components/list-organization-members";

export default async function Page() {
  const data = await auth.api.getFullOrganization({
    headers: await headers(),
  });
  if (!data) {
    return redirect("/organizations/settings");
  }
  return (
    <div className="flex flex-col gap-4 w-1/2 p-6">
      <div>
        <h1 className="text-2xl font-bold">Members</h1>
        <p className="text-muted-foreground">
          Invite and manage organization members.
        </p>
      </div>
      <InviteMember orgId={data.id} />
      <Card>
        <CardHeader>
          <CardTitle>Pending Invitations</CardTitle>
        </CardHeader>
        <CardContent>
          <Suspense>
            <ListPendingInvitations />
          </Suspense>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Members</CardTitle>
        </CardHeader>
        <CardContent>
          <Suspense>
            <ListOrganizationMembers />
          </Suspense>
        </CardContent>
      </Card>
    </div>
  );
}

