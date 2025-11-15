import WorkflowDetails from "@/features/workflows/components/workflow-details";
import { Suspense } from "react";

export default async function Page({
  params,
}: PageProps<"/[locale]/workflows/[id]">) {
  const { id } = await params;
  return (
    <div className="p-6 flex flex-col gap-4 h-full">
      <Suspense>
        <WorkflowDetails id={id} />
      </Suspense>
    </div>
  );
}

