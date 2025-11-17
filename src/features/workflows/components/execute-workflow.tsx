"use client";

import { Button } from "@/components/ui/button";
import { FlaskConicalIcon, Loader2Icon } from "lucide-react";
import { useExecuteWorkflow } from "../hooks/use-workflow";

export const ExecuteWorkflow = ({ workflowId }: { workflowId: string }) => {
  const { mutate, isPending } = useExecuteWorkflow(workflowId);
  return (
    <Button size={"lg"} onClick={() => mutate()} disabled={isPending}>
      {isPending ? (
        <Loader2Icon className="size-4 animate-spin" />
      ) : (
        <FlaskConicalIcon className="size-4" />
      )}
      Execute
    </Button>
  );
};

