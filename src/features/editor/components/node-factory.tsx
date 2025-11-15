import { NodeTypes } from "@xyflow/react";
import { NodeType } from "../types/node";
import { InitialNode } from "./nodes/initial-node";

export const NodeComponents = {
  [NodeType.INITIAL]: InitialNode,
} as const satisfies NodeTypes;

export type NodeComponentsType = keyof typeof NodeComponents;

