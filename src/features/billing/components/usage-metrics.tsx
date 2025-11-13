"use client";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useQuery } from "@tanstack/react-query";

const PLAN_DATA = {
  free: {
    workflows: {
      limit: 10,
      disabled: false,
      unlimited: false,
    },
    runs: {
      limit: 50,
      disabled: false,
      unlimited: false,
    },
    users: {
      limit: 1,
      disabled: false,
      unlimited: false,
    },
  },
  basic: {
    workflows: {
      limit: 10,
      disabled: false,
      unlimited: false,
    },
    runs: {
      limit: 50,
      disabled: false,
      unlimited: false,
    },
    users: {
      limit: 1,
      disabled: false,
      unlimited: false,
    },
  },
  pro: {
    workflows: {
      limit: 10,
      disabled: false,
      unlimited: true,
    },
    runs: {
      limit: 50,
      disabled: false,
      unlimited: true,
    },
    users: {
      limit: 10,
      disabled: false,
      unlimited: false,
    },
  },
} as const;

export const products = [
  {
    productId: "294b1789-0f2e-46dd-8fb0-6ac15d7b58c9",
    id: "pro",
    name: "Pro Plan",
  },
  {
    productId: "f25bd403-cbd6-4d18-b6ed-3efdea685020",
    id: "basic",
    name: "Basic Plan",
  },
  {
    productId: "e94fe245-269d-42f4-989d-000b625f63dd",
    slug: "free",
  },
];

interface UsageItemProps {
  label: string;
  current: number;
  max: number;
  unit?: string;
  period?: string;
  percentage?: number;
  unlimited?: boolean;
  disabled?: boolean;
}

function CircularProgress({ value }: { value: number }) {
  return (
    <div className="relative h-6 w-6 flex items-center justify-center">
      <svg className="h-6 w-6" viewBox="0 0 36 36">
        {/* Background circle */}
        <circle
          className="stroke-muted fill-none"
          cx="18"
          cy="18"
          r="16"
          strokeWidth="4"
        />
        {/* Progress circle */}
        <circle
          className="stroke-primary fill-none"
          cx="18"
          cy="18"
          r="16"
          strokeWidth="4"
          strokeDasharray={`${value * 0.01 * 100.53} 100.53`}
          strokeDashoffset="0"
          transform="rotate(-90 18 18)"
        />
      </svg>
    </div>
  );
}

function UsageItem({
  label,
  current,
  max,
  unit,
  period,
  percentage,
  unlimited,
  disabled,
}: UsageItemProps) {
  // Calculate percentage if not explicitly provided
  const calculatedPercentage =
    percentage !== undefined
      ? percentage
      : Math.min((current / max) * 100, 100);

  // Format values differently based on whether we have a unit or not
  let formattedCurrent: string;
  let formattedMax: string;

  if (unit) {
    // For values with units (like GB), show the decimal value
    formattedCurrent = current.toFixed(1).replace(/\.0$/, "");
    formattedMax = max.toFixed(1).replace(/\.0$/, "");
  } else {
    // For counts without units, use k formatting for large numbers
    formattedCurrent =
      current >= 1000 ? `${(current / 1000).toFixed(1)}k` : current.toString();

    if (max >= 1000000) {
      // If max is large, format it as well
      formattedMax = `${(max / 1000000).toFixed(0)}M`;
    } else if (max >= 1000) {
      formattedMax = `${(max / 1000).toFixed(0)}k`;
      // If max is very large, format it as millions
    } else {
      formattedMax = max.toString();
    }
  }

  return (
    <div className="flex items-center justify-between py-3 px-4">
      <div className="flex items-center gap-4">
        <CircularProgress
          value={disabled ? 0 : unlimited ? 0 : calculatedPercentage}
        />
        <span className="text-sm font-medium">{label}</span>
      </div>
      {unlimited && !disabled && (
        <span className="text-sm text-muted-foreground">Ilimitados</span>
      )}
      {!unlimited && !disabled && (
        <div className="text-sm text-muted-foreground">
          {formattedCurrent} / {formattedMax} {unit}{" "}
          {period && <span>per {period}</span>}
        </div>
      )}
      {disabled && (
        <div className="text-sm text-muted-foreground">
          <span className="line-through">
            {formattedCurrent} / {formattedMax} {unit}
          </span>{" "}
          (Mejora tu plan para desbloquear)
        </div>
      )}
    </div>
  );
}

export function Usage() {
  const { data, isPending } = useQuery({
    queryKey: ["organization-usage-meters"],
    refetchOnWindowFocus: false,
    queryFn: async () => {
      const response = await fetch("/api/v1/billing/state");
      if (!response.ok) {
        return null;
      }
      const data = await response.json();

      if (data.subscription === null) {
        return null;
      }

      const plan = products.find(
        (p) => p.productId === data.subscription?.productId
      );
      return {
        plan: plan?.name || "basic",
        meters: {
          workflows: 3,
          runs: 25,
          users: 1,
        },
        limits: PLAN_DATA[plan?.id as keyof typeof PLAN_DATA],
      };
    },
  });

  if (isPending) {
    return <UsageSkeleton />;
  }

  if (!data) {
    return null;
  }

  return (
    <div>
      <h2 className="text-lg font-medium leading-none tracking-tight mb-4">
        Usage
      </h2>
      <Card className="divide-y ">
        <UsageItem
          label="Organization workflows"
          current={data.meters?.workflows ?? 0}
          max={data.limits.workflows.limit}
          disabled={data.limits.workflows.disabled}
          unlimited={data.limits.workflows.unlimited}
          period="month"
        />
        <UsageItem
          label="Workflow runs"
          current={data.meters?.runs ?? 0}
          max={data.limits.runs.limit}
          disabled={data.limits.runs.disabled}
          unlimited={data.limits.runs.unlimited}
          period="month"
        />
        <UsageItem
          label="Organization members"
          current={data.meters?.users ?? 0}
          max={data.limits.users.limit}
          disabled={data.limits.users.disabled}
          unlimited={data.limits.users.unlimited}
        />
      </Card>
    </div>
  );
}

export function UsageSkeleton() {
  // Define labels to use for keys instead of array indices
  const skeletonItems = ["users", "connections", "inbox"];

  return (
    <div>
      <h2 className="text-lg font-medium leading-none tracking-tight mb-4">
        Usage
      </h2>

      <Card className="divide-y">
        {skeletonItems.map((item) => (
          <div
            key={item}
            className="flex items-center justify-between py-3 px-4"
          >
            <div className="flex items-center gap-4">
              <Skeleton className="h-6 w-6 rounded-full" />
              <Skeleton className="h-4 w-24" />
            </div>
            <Skeleton className="h-4 w-20" />
          </div>
        ))}
      </Card>
    </div>
  );
}

