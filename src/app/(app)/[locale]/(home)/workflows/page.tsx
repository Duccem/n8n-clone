import { CreateWorkflow } from "@/features/workflows/components/create-workflow";
import {
  WorkflowsTable,
  WorkflowsLoading,
} from "@/features/workflows/components/workflows-table";
import { Suspense } from "react";

export default function Page() {
  return (
    <div className="p-6 flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Workflows</h1>
        <CreateWorkflow />
      </div>
      <Suspense fallback={<WorkflowsLoading />}>
        <WorkflowsTable />
      </Suspense>
    </div>
  );
}

