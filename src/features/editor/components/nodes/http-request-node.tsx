"use client";

import { Node, NodeProps } from "@xyflow/react";
import { GlobeIcon } from "lucide-react";
import { memo } from "react";
import { BaseExecutionNode } from "../base-execution-node";

type HTTPRequestNodeData = {
  endpoint: string;
  method: "GET" | "POST" | "PUT" | "DELETE";
  body?: string;
};

type HTTPRequestNodeType = Node<HTTPRequestNodeData>;

export const HTTPRequestNode = memo((props: NodeProps<HTTPRequestNodeType>) => {
  const { data } = props;
  const description = data?.endpoint
    ? `${data.method || "GET"}: ${data.endpoint}`
    : "No endpoint configured";
  return (
    <BaseExecutionNode
      {...props}
      name="Http Request"
      description={description}
      Icon={GlobeIcon}
      id={props.id}
      onDoubleClick={() => {}}
      onSettings={() => {}}
    />
  );
});

