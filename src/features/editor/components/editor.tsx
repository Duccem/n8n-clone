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
import { useCallback, useState } from "react";
import { NodeComponents } from "./node-factory";
import { AddNodeButton } from "./add-node-button";

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
  return (
    <div className="w-full h-full bg-accent rounded-2xl p-3">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        fitView
        nodeTypes={NodeComponents}
        proOptions={{
          hideAttribution: true,
        }}
      >
        <Background />
        <Controls />
        <MiniMap />
        <Panel position="top-right">
          <AddNodeButton />
        </Panel>
      </ReactFlow>
    </div>
  );
};

export default Editor;

