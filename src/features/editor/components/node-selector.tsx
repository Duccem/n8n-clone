"use client";

import { Node, useReactFlow } from "@xyflow/react";
import {
  GlobeIcon,
  MousePointerIcon,
  PlusIcon,
  WebhookIcon,
  X,
} from "lucide-react";
import { useCallback, useState } from "react";
import { toast } from "sonner";
import {
  Sheet,
  SheetHeader,
  SheetTrigger,
  SheetTitle,
  SheetContent,
  SheetDescription,
  SheetClose,
} from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator";
import { NodeType } from "../types/node";
import { v7 } from "uuid";

export type NodeTypeOption = {
  type: NodeType;
  label: string;
  description: string;
  icon: React.ComponentType<{ className?: string }> | string;
};

const triggerNodes: NodeTypeOption[] = [
  {
    type: NodeType.MANUAL_TRIGGER,
    label: "Manual Trigger",
    description: "Start the workflow manually.",
    icon: MousePointerIcon,
  },
];

const executionNodes: NodeTypeOption[] = [
  {
    type: NodeType.HTTP_REQUEST,
    label: "HTTP Request",
    description: "Make HTTP requests to external services.",
    icon: GlobeIcon,
  },
];

interface NodeSelectorProps {
  children: React.ReactNode;
}

export const NodeSelector = ({ children }: NodeSelectorProps) => {
  const [open, onOpenChange] = useState(false);
  const { setNodes, getNodes, screenToFlowPosition } = useReactFlow();
  const handleSelection = useCallback(
    (selection: NodeTypeOption) => {
      if (selection.type === NodeType.MANUAL_TRIGGER) {
        const nodes = getNodes();
        const hasManualTrigger = nodes.some(
          (node) => node.type === NodeType.MANUAL_TRIGGER
        );
        if (hasManualTrigger) {
          toast.error("A workflow can only have one Manual Trigger node.");
          return;
        }
      }
      setNodes((nodes) => {
        const hasInitialTrigger = nodes.some(
          (node) => node.type === NodeType.INITIAL
        );
        const centerX = window.innerWidth / 2;
        const centerY = window.innerHeight / 2;
        const position = screenToFlowPosition({
          x: centerX + (Math.random() - 0.5) * 200,
          y: centerY + (Math.random() - 0.5) * 200,
        });

        const newNode = {
          id: v7(),
          type: selection.type,
          position,
          data: {},
        };

        if (hasInitialTrigger) {
          return [newNode];
        }

        return [...nodes, newNode];
      });
      onOpenChange(false);
    },
    [setNodes, getNodes, screenToFlowPosition]
  );
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetTrigger asChild>{children}</SheetTrigger>
      <SheetContent className="sm:w-1/3 sm:max-w-full p-4 bg-transparent border-none focus-visible:outline-none ">
        <div className="bg-background p-6 border border-sidebar h-full overflow-y-auto no-scroll space-y-5 rounded-xl relative">
          <SheetHeader className="p-0">
            <SheetTitle>Select a node to add to your workflow</SheetTitle>
            <SheetDescription>
              Choose from a variety of nodes to build your workflow.
            </SheetDescription>
            <SheetClose className="absolute top-4 right-4">
              <X className="size-4 " />
            </SheetClose>
          </SheetHeader>
          <div className="space-y-6 mt-4">
            <div>
              <h3 className="font-medium text-lg mb-2">Trigger Nodes</h3>
              <div className="grid grid-cols-1 gap-4">
                {triggerNodes.map((node) => (
                  <NodeTypeCard
                    key={node.type}
                    nodeType={node}
                    handleSelection={handleSelection}
                  />
                ))}
              </div>
            </div>
            <Separator />
            <div>
              <h3 className="font-medium text-lg mb-2">Execution Nodes</h3>
              <div className="grid grid-cols-1 gap-4">
                {executionNodes.map((node) => (
                  <NodeTypeCard
                    key={node.type}
                    nodeType={node}
                    handleSelection={handleSelection}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};

const NodeTypeCard = ({
  nodeType,
  handleSelection,
}: {
  nodeType: NodeTypeOption;
  handleSelection: (selection: NodeTypeOption) => void;
}) => {
  return (
    <div
      className="border border-border rounded-lg p-4 cursor-pointer hover:bg-accent hover:border-accent-foreground transition"
      onClick={() => handleSelection(nodeType)}
    >
      <div className="flex items-center space-x-4">
        {typeof nodeType.icon === "string" ? (
          <img src={nodeType.icon} alt={nodeType.label} className="w-8 h-8" />
        ) : (
          <nodeType.icon className="w-8 h-8 text-foreground" />
        )}
        <div>
          <h4 className="font-semibold">{nodeType.label}</h4>
          <p className="text-sm text-muted-foreground">
            {nodeType.description}
          </p>
        </div>
      </div>
    </div>
  );
};

