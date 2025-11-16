import { NodeTypes } from "@xyflow/react";
import { NodeType } from "../types/node";
import { InitialNode } from "./nodes/initial-node";
import { ManualTriggerNode } from "./nodes/manual-trigger-node";
import { HTTPRequestNode } from "./nodes/http-request-node";

export const NodeComponents = {
  [NodeType.INITIAL]: InitialNode,
  [NodeType.MANUAL_TRIGGER]: ManualTriggerNode,
  [NodeType.HTTP_REQUEST]: HTTPRequestNode,
} as const satisfies NodeTypes;

export type NodeComponentsType = keyof typeof NodeComponents;

