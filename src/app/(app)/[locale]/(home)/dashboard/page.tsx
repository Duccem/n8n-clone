import { ChartArea } from "@/features/home/chart-area";
import { HomeTesting } from "@/features/home/home-testing";
import { MetricCards } from "@/features/home/metric-cards";
import { requireAuth } from "@/lib/auth/utils/require-auth";

export default async function DashboardPage() {
  await requireAuth();
  return (
    <div className="@container/main flex flex-1 flex-col gap-2">
      <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
        <MetricCards />
        <div className="px-4 lg:px-6">
          <ChartArea />
        </div>
      </div>
    </div>
  );
}

