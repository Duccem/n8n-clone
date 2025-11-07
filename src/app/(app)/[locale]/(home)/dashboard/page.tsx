import { requireAuth } from "@/lib/auth/utils/require-auth";

export default async function DashboardPage() {
  await requireAuth();
  return <div>Dashboard Page</div>;
}
