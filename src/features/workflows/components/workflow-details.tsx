"use client";

import Editor from "@/features/editor/components/editor";
import { useWorkflow } from "../hooks/use-workflow";
import WorkflowName from "./workflow-name";

const WorkflowDetails = ({ id }: { id: string }) => {
  const { data, isLoading } = useWorkflow(id);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!data) {
    return <div>Workflow not found</div>;
  }
  return (
    <div className="flex flex-col h-full">
      <WorkflowName workflow={data} />
      <Editor workflow={data} />
    </div>
  );
};

export default WorkflowDetails;

