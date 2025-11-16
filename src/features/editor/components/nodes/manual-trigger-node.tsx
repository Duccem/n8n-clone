"use client";

import { NodeProps } from "@xyflow/react";
import { MousePointerIcon } from "lucide-react";
import { memo } from "react";
import { BaseTriggerNode } from "../base-trigger-node";

export const ManualTriggerNode = memo((props: NodeProps) => {
  return (
    <BaseTriggerNode
      {...props}
      name="Http Request"
      description={"When clicked, triggers the workflow"}
      Icon={MousePointerIcon}
      id={props.id}
      onDoubleClick={() => {}}
      onSettings={() => {}}
    />
  );
});

