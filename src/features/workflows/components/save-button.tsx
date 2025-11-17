"use client";

import { Button } from "@/components/ui/button";
import { Loader2, Save } from "lucide-react";
import { useUpdateNodesInWorkflow } from "../hooks/use-workflow";
import { useAtomValue } from "jotai";
import { editorAtom } from "@/features/editor/store";

export const SaveWorkflowButton = ({ workflowId }: { workflowId: string }) => {
  const editor = useAtomValue(editorAtom);
  const { mutate, isPending } = useUpdateNodesInWorkflow(workflowId);
  const handleSave = () => {
    if (!editor) return;
    const nodes = editor.getNodes();
    const edges = editor.getEdges();
    mutate({ nodes, edges });
  };
  return (
    <Button onClick={handleSave} disabled={isPending}>
      {isPending ? (
        <Loader2 className="animate-spin" />
      ) : (
        <>
          <Save /> Save
        </>
      )}
    </Button>
  );
};

