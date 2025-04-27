
import React, { useEffect, useRef, useState } from 'react';
import { GraphData } from '../types/graph';
import { useGraphPositions } from '../hooks/useGraphPositions';
import { drawEdges } from './graph/GraphEdges';
import { drawNodes } from './graph/GraphNodes';

interface GraphCanvasProps {
  graphData: GraphData;
  activeTopic: string | null;
  searchTerm: string;
}

const GraphCanvas = ({ graphData, activeTopic, searchTerm }: GraphCanvasProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);
  const { nodePositions, setNodePositions } = useGraphPositions(
    graphData,
    canvasRef.current?.offsetWidth || 0,
    canvasRef.current?.offsetHeight || 0
  );

  // Handle mouse move to detect hovering on nodes
  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    // Check if mouse is over any node
    let foundNode = false;
    for (const node of graphData.nodes) {
      const nodePos = nodePositions[node.id];
      if (!nodePos) continue;
      
      const distance = Math.sqrt(
        Math.pow(x - nodePos.x, 2) + Math.pow(y - nodePos.y, 2)
      );
      
      if (distance < node.size) {
        setHoveredNode(node.id);
        foundNode = true;
        break;
      }
    }
    
    if (!foundNode && hoveredNode) {
      setHoveredNode(null);
    }
  };

  // Handle click on nodes
  const handleClick = () => {
    if (hoveredNode) {
      const node = graphData.nodes.find(n => n.id === hoveredNode);
      if (node) {
        console.log(`Clicked on node: ${node.label}`);
      }
    }
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      if (ctx) {
        const drawGraph = () => {
          // Clear canvas and set dimensions
          ctx.clearRect(0, 0, canvas.width, canvas.height);
          canvas.width = canvas.offsetWidth;
          canvas.height = canvas.offsetHeight;
          
          // Draw edges and nodes
          drawEdges(ctx, graphData, nodePositions);
          drawNodes(ctx, graphData, nodePositions, activeTopic, hoveredNode, searchTerm);
        };
        
        drawGraph();
        window.addEventListener('resize', drawGraph);
        return () => window.removeEventListener('resize', drawGraph);
      }
    }
  }, [graphData, searchTerm, activeTopic, hoveredNode, nodePositions]);

  return (
    <div className="relative flex-grow bg-muted/30 rounded-md overflow-hidden">
      <canvas 
        ref={canvasRef} 
        className="w-full h-full cursor-pointer" 
        onMouseMove={handleMouseMove}
        onClick={handleClick}
      />
      <div className="absolute bottom-2 left-2 text-xs text-muted-foreground">
        <p>Graph visualization powered by Graph-RAG</p>
      </div>
      {hoveredNode && (
        <div className="absolute top-2 right-2 bg-black/80 text-white px-3 py-1 rounded text-sm">
          {graphData.nodes.find(n => n.id === hoveredNode)?.label}
        </div>
      )}
    </div>
  );
};

export default GraphCanvas;
