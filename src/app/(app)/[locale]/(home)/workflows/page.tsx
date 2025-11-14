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
    <div>
      <WorkflowsTable page={page} pageSize={pageSize} />
    </div>
  );
}

