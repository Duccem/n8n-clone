"use client";

import { Button } from "@/components/ui/button";
import { NodeToolbar, Position } from "@xyflow/react";
import { SettingsIcon, Trash2Icon } from "lucide-react";
import { ReactNode } from "react";

type WorkflowNodeProps = {
  children: ReactNode;
  showToolbar?: boolean;
  onDelete?: VoidFunction;
  onSettings?: VoidFunction;
  name?: string;
  description?: string;
};

export const WorkflowNodeToolbar = ({
  children,
  showToolbar = false,
  onDelete,
  onSettings,
  name,
  description,
}: WorkflowNodeProps) => {
  return (
    <>
      {showToolbar && (
        <NodeToolbar>
          <Button variant="ghost" size="sm" onClick={onSettings}>
            <SettingsIcon className="size-4" />
          </Button>
          <Button variant="ghost" size="sm" className="z-10" onClick={onDelete}>
            <Trash2Icon className="size-4" />
          </Button>
        </NodeToolbar>
      )}
      {children}
      {name && (
        <NodeToolbar
          position={Position.Bottom}
          isVisible
          className="max-w-[200px] text-center"
        >
          <p className="font-medium">{name}</p>
          {description && (
            <p className="text-xs text-muted-foreground truncate">
              {description}
            </p>
          )}
        </NodeToolbar>
      )}
    </>
  );
};

