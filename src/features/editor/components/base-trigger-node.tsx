"use client";

import { NodeProps, Position, useReactFlow } from "@xyflow/react";
import { LucideIcon } from "lucide-react";
import { memo } from "react";
import { WorkflowNodeToolbar } from "./workflow-node";
import { BaseNode, BaseNodeContent } from "@/components/react-flow/base-node";
import { BaseHandle } from "@/components/react-flow/base-handle";
import {
  type NodeStatus,
  NodeStatusIndicator,
} from "@/components/react-flow/node-status-indicator";

interface BaseTriggerNodeProps extends NodeProps {
  Icon: LucideIcon | string;
  name: string;
  description?: string;
  children?: React.ReactNode;
  status?: NodeStatus;
  onSettings?: VoidFunction;
  onDoubleClick?: VoidFunction;
}

export const BaseTriggerNode = memo(
  ({
    Icon,
    name,
    description,
    children,
    onSettings,
    onDoubleClick,
    status,
    id,
  }: BaseTriggerNodeProps) => {
    const { deleteElements } = useReactFlow();
    const handleDelete = () => {
      deleteElements({ nodes: [{ id }] });
    };
    return (
      <WorkflowNodeToolbar
        name={name}
        description={description}
        showToolbar
        onSettings={onSettings}
        onDelete={handleDelete}
      >
        <NodeStatusIndicator
          status={status}
          variant="border"
          className="rounded-l-3xl rounded-r-sm"
        >
          <BaseNode
            status={status}
            onDoubleClick={onDoubleClick}
            className="bg-card w-auto h-auto border border-gray-400 p-4 text-center rounded-l-3xl rounded-r-sm relative group"
          >
            <BaseNodeContent>
              {typeof Icon === "string" ? (
                <img src={Icon} className="size-6 mx-auto" />
              ) : (
                <Icon className="size-4 text-muted-foreground" />
              )}
              {children}
              <BaseHandle
                id={"source-1"}
                type="source"
                position={Position.Right}
              />
            </BaseNodeContent>
          </BaseNode>
        </NodeStatusIndicator>
      </WorkflowNodeToolbar>
    );
  }
);

BaseTriggerNode.displayName = "BaseTriggerNode";

