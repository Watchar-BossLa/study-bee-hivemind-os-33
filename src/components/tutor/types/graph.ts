
export type GraphNode = {
  id: string;
  label: string;
  size: number;
  color: string;
};

export type GraphEdge = {
  from: string;
  to: string;
  label?: string;
};

export type GraphData = {
  nodes: GraphNode[];
  edges: GraphEdge[];
};
