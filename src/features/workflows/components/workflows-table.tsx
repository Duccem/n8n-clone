"use client";
import { useListWorkflows } from "../hooks/use-workflow";
import { ServerPagination } from "@/components/ui/server-table";

import { Loader2 } from "lucide-react";
import SearchWorkflows from "./search-workflows";
import FilterStateWorkflows from "./filter-state-workflows";
import { parseAsInteger, parseAsString, useQueryStates } from "nuqs";
import WorkflowItem from "./workflow-item";
import { Card } from "@/components/ui/card";

export const WorkflowsTable = () => {
  const [urlState] = useQueryStates({
    page: parseAsInteger.withDefault(1),
    pageSize: parseAsInteger.withDefault(10),
    query: parseAsString.withDefault(""),
    state: parseAsString.withDefault(""),
  });
  const { page, pageSize, query, state } = urlState;
  const { data, error, isPending } = useListWorkflows(
    page,
    pageSize,
    query,
    state
  );

  if (isPending) {
    return <WorkflowsLoading />;
  }

  if (error) {
    return <WorkflowsError />;
  }

  return (
    <div className="flex flex-col gap-4 mt-6">
      {data.items.length > 0 ? (
        <>
          <div className="flex justify-between items-center">
            <SearchWorkflows />
            <FilterStateWorkflows />
          </div>
          {data.items.map((workflow) => (
            <WorkflowItem workflow={workflow} key={workflow.id} />
          ))}
          <ServerPagination
            meta={{
              page: data.pagination.page ?? 1,
              pages: data.pagination.totalPages ?? 1,
              size: data.pagination.pageSize ?? 0,
              total: data.pagination.totalCount ?? 0,
            }}
          />
        </>
      ) : (
        <WorkflowsEmpty />
      )}
    </div>
  );
};

const WorkflowsEmpty = () => {
  return (
    <Card>
      <div className="flex flex-col items-center justify-center py-20">
        <h3 className="text-lg font-medium">No Workflows Found</h3>
        <p className="text-sm text-muted-foreground mt-2">
          You don't have any workflows yet. Create your first workflow to get
          started!
        </p>
      </div>
    </Card>
  );
};

export const WorkflowsLoading = () => {
  return (
    <Card>
      <div className="flex flex-col gap-2 items-center justify-center w-full h-full">
        <Loader2 className="animate-spin" />
        <p className="text-sm text-muted-foreground">Loading workflows...</p>
      </div>
    </Card>
  );
};

const WorkflowsError = () => {
  return (
    <Card>
      <div className="flex flex-col gap-2 items-center justify-center w-full h-full">
        <p className="text-sm text-muted-foreground">
          Failed to load workflows.
        </p>
      </div>
    </Card>
  );
};

