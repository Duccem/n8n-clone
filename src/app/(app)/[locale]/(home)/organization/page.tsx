import DeleteOrganization from "@/features/organization/components/delete-organization";
import {
  OrganizationDetails,
  OrganizationDetailsSkeleton,
} from "@/features/organization/components/organization-details";
import { Suspense } from "react";

export default async function Page() {
  // org may be null in dev or if API not implemented yet — components handle that gracefully
  return (
    <div className="flex flex-col md:w-1/2 gap-4 p-6">
      <div>
        <h1 className="text-2xl font-bold">Organization</h1>
        <p className="text-muted-foreground">
          Manage your organization details and settings.
        </p>
      </div>
      <Suspense fallback={<OrganizationDetailsSkeleton />}>
        <OrganizationDetails />
      </Suspense>
      <DeleteOrganization />
    </div>
  );
}

