import { CreateWorkflow } from "@/features/workflows/components/create-workflow";
import { WorkflowsTable } from "@/features/workflows/components/workflows-table";
import { createLoader, parseAsInteger, SearchParams } from "nuqs/server";

const paginatedWorkflowsParams = {
  page: parseAsInteger.withDefault(1),
  pageSize: parseAsInteger.withDefault(10),
};

type PageProps = {
  searchParams: Promise<SearchParams>;
};

const loadSearchParams = createLoader(paginatedWorkflowsParams);
export default async function Page({ searchParams }: PageProps) {
  const { page, pageSize } = await loadSearchParams(searchParams);
  return (
    <div className="p-6 flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Workflows</h1>
        <CreateWorkflow />
      </div>
      <WorkflowsTable page={page} pageSize={pageSize} />
    </div>
  );
}

