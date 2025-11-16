"use client";

import { PlaceholderNode } from "@/components/react-flow/placeholder-node";
import { NodeProps } from "@xyflow/react";
import { PlusIcon } from "lucide-react";
import { memo } from "react";
import { WorkflowNodeToolbar } from "../workflow-node";
import { NodeSelector } from "../node-selector";
import { Button } from "@/components/ui/button";

export const InitialNode = memo((props: NodeProps) => {
  return (
    <NodeSelector>
      <Button className="size-fit p-0" variant={"ghost"}>
        <WorkflowNodeToolbar
          name="Initial node"
          description="Click to add a node"
        >
          <PlaceholderNode {...props}>
            <div className="cursor-pointer flex items-center justify-center">
              <PlusIcon className="size-4" />
            </div>
          </PlaceholderNode>
        </WorkflowNodeToolbar>
      </Button>
    </NodeSelector>
  );
});

