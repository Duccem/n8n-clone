"use client";

import { format } from "date-fns";
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

  return (
    <div>
      {data.items.map((workflow) => (
        <div key={workflow.id} className="p-4 mb-2 border rounded">
          <h2 className="text-lg font-semibold">{workflow.name}</h2>
          <p className="text-sm text-gray-500">ID: {workflow.id}</p>
          <p className="text-sm text-red-300">
            {format(workflow.createdAt, "PPp")}
          </p>
        </div>
      ))}
    </div>
  );
};

