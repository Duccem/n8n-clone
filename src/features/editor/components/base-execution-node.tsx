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

interface BaseExecutionNodeProps extends NodeProps {
  Icon: LucideIcon | string;
  name: string;
  description?: string;
  children?: React.ReactNode;
  status?: NodeStatus;
  onSettings?: VoidFunction;
  onDoubleClick?: VoidFunction;
}

export const BaseExecutionNode = memo(
  ({
    Icon,
    name,
    description,
    children,
    onSettings,
    onDoubleClick,
    status,
    id,
  }: BaseExecutionNodeProps) => {
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
        <NodeStatusIndicator status={status} variant="border">
          <BaseNode
            onDoubleClick={onDoubleClick}
            status={status}
            className="bg-card w-auto h-auto border border-gray-400 p-4 text-center "
          >
            <BaseNodeContent>
              {typeof Icon === "string" ? (
                <img src={Icon} className="size-6 mx-auto" />
              ) : (
                <Icon className="size-4 text-muted-foreground" />
              )}
              {children}
              <BaseHandle
                id={"target-1"}
                type="target"
                position={Position.Left}
              />
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

BaseExecutionNode.displayName = "BaseExecutionNode";

