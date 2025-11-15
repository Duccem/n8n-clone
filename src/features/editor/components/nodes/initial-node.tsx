"use client";

import { PlaceholderNode } from "@/components/react-flow/placeholder-node";
import { NodeProps } from "@xyflow/react";
import { PlusIcon } from "lucide-react";
import { memo } from "react";
import { WorkflowNode } from "../workflow-node";

export const InitialNode = memo((props: NodeProps) => {
  return (
    <WorkflowNode name="Initial node" description="Click to add a node">
      <PlaceholderNode {...props}>
        <div className="cursor-pointer flex items-center justify-center">
          <PlusIcon className="size-4" />
        </div>
      </PlaceholderNode>
    </WorkflowNode>
  );
});

