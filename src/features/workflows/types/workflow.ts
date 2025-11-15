export type Workflow = {
  id: string;
  slug: string;
  name: string;
  organizationId: string;
  createdAt: string;
  updatedAt: string;
  nodes?: {
    id: string;
    type: string;
    name: string;
    position: { x: number; y: number };
    data: Record<string, any>;
  }[];
  connections: {
    id: string;
    sourceNodeId: string;
    targetNodeId: string;
    sourceOutput: string;
    targetInput: string;
  }[];
};

