"use client";
import { Workflow } from "@/features/workflows/types/workflow";
import {
  ReactFlow,
  applyNodeChanges,
  applyEdgeChanges,
  addEdge,
  Node,
  Edge,
  NodeChange,
  EdgeChange,
  Connection,
  Background,
  Controls,
  MiniMap,
  Panel,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { useCallback, useMemo, useState } from "react";
import { NodeComponents } from "./node-factory";
import { AddNodeButton } from "./add-node-button";
import { useSetAtom } from "jotai";
import { editorAtom } from "../store";
import { NodeType } from "../types/node";
import { ExecuteWorkflow } from "@/features/workflows/components/execute-workflow";
import { useTheme } from "next-themes";

const Editor = ({ workflow }: { workflow: Workflow }) => {
  const [nodes, setNodes] = useState<Node[]>(workflow.nodes ?? []);
  const [edges, setEdges] = useState<Edge[]>(
    workflow.connections.map((c) => ({
      id: c.id,
      source: c.sourceNodeId,
      target: c.targetNodeId,
      sourceHandle: c.sourceOutput,
      targetHandle: c.targetInput,
    })) ?? []
  );

  const { resolvedTheme } = useTheme();

  const setEditor = useSetAtom(editorAtom);

  const onNodesChange = useCallback(
    (changes: NodeChange[]) =>
      setNodes((nodesSnapshot) => applyNodeChanges(changes, nodesSnapshot)),
    []
  );
  const onEdgesChange = useCallback(
    (changes: EdgeChange[]) =>
      setEdges((edgesSnapshot) => applyEdgeChanges(changes, edgesSnapshot)),
    []
  );
  const onConnect = useCallback(
    (params: Connection) =>
      setEdges((edgesSnapshot) => addEdge(params, edgesSnapshot)),
    []
  );

  const hasManualTrigger = useMemo(
    () => nodes.some((node) => node.type === NodeType.MANUAL_TRIGGER),
    [nodes]
  );
  return (
    <div className="w-full h-full bg-accent rounded-2xl overflow-hidden border border-border">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        fitView
        nodeTypes={NodeComponents}
        onInit={setEditor}
        proOptions={{
          hideAttribution: true,
        }}
        snapGrid={[10, 10]}
        snapToGrid
        colorMode={resolvedTheme === "dark" ? "dark" : "light"}
      >
        <Background />
        <Controls />
        <MiniMap />
        <Panel position="top-right">
          <AddNodeButton />
        </Panel>
        {hasManualTrigger && (
          <Panel position="bottom-center">
            <ExecuteWorkflow workflowId={workflow.id} />
          </Panel>
        )}
      </ReactFlow>
    </div>
  );
};

export default Editor;

