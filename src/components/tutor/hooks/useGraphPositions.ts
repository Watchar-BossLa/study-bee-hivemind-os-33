
import { useEffect, useState } from 'react';
import { GraphData } from '../types/graph';

export type NodePositions = { [key: string]: { x: number; y: number } };

export const useGraphPositions = (
  graphData: GraphData,
  canvasWidth: number,
  canvasHeight: number
) => {
  const [nodePositions, setNodePositions] = useState<NodePositions>({});

  useEffect(() => {
    if (graphData?.nodes) {
      const positions: NodePositions = {};
      const centerX = canvasWidth / 2;
      const centerY = canvasHeight / 2;
      const radius = Math.min(centerX, centerY) * 0.7;
      
      graphData.nodes.forEach((node, index) => {
        const angle = (index / graphData.nodes.length) * 2 * Math.PI;
        positions[node.id] = {
          x: centerX + radius * Math.cos(angle),
          y: centerY + radius * Math.sin(angle)
        };
      });
      
      setNodePositions(positions);
    }
  }, [graphData, canvasWidth, canvasHeight]);

  return { nodePositions, setNodePositions };
};
