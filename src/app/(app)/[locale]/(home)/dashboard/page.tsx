import InitOrganizationDialog from "@/features/organization/components/init-organization-dialog";
import { requireAuth } from "@/lib/auth/utils/require-auth";
import { Suspense } from "react";

export default async function DashboardPage() {
  await requireAuth();
  return (
    <div>
      Dashboard Page
      <Suspense>
        <InitOrganizationDialog />
      </Suspense>
    </div>
  );
}

