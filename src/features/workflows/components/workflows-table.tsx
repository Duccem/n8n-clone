"use client";

import { useListWorkflows } from "../hooks/use-workflow";

export const WorkflowsTable = ({
  page,
  pageSize,
}: {
  page: number;
  pageSize: number;
}) => {
  const { data, error, isPending } = useListWorkflows(page, pageSize);

  if (isPending) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error loading workflows: {error.message}</div>;
  }

  return <div>{JSON.stringify(data.items)}</div>;
};
