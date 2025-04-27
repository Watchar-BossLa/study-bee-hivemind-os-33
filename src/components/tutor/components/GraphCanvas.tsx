
import React, { useEffect, useRef, useState } from 'react';
import { GraphData } from '../types/graph';

interface GraphCanvasProps {
  graphData: GraphData;
  activeTopic: string | null;
  searchTerm: string;
}

const GraphCanvas = ({ graphData, activeTopic, searchTerm }: GraphCanvasProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);
  const [nodePositions, setNodePositions] = useState<{ [key: string]: { x: number; y: number } }>({});
  
  // Calculate node positions once when component mounts or graph data changes
  useEffect(() => {
    if (graphData?.nodes) {
      const positions: { [key: string]: { x: number; y: number } } = {};
      const canvas = canvasRef.current;
      
      if (canvas) {
        const centerX = canvas.width / 2;
        const centerY = canvas.height / 2;
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
    }
  }, [graphData]);

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
        // You can implement navigation or other actions here
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
          // Clear canvas
          ctx.clearRect(0, 0, canvas.width, canvas.height);
          
          // Set canvas dimensions
          canvas.width = canvas.offsetWidth;
          canvas.height = canvas.offsetHeight;
          
          // Recalculate positions based on new canvas size
          const centerX = canvas.width / 2;
          const centerY = canvas.height / 2;
          const radius = Math.min(centerX, centerY) * 0.7;
          
          const newPositions: { [key: string]: { x: number; y: number } } = {};
          
          graphData.nodes.forEach((node, index) => {
            const angle = (index / graphData.nodes.length) * 2 * Math.PI;
            newPositions[node.id] = {
              x: centerX + radius * Math.cos(angle),
              y: centerY + radius * Math.sin(angle)
            };
          });
          
          setNodePositions(newPositions);
          
          // Draw edges first
          graphData.edges.forEach(edge => {
            const fromNode = graphData.nodes.find(n => n.id === edge.from);
            const toNode = graphData.nodes.find(n => n.id === edge.to);
            
            if (fromNode && toNode) {
              const fromPos = newPositions[fromNode.id];
              const toPos = newPositions[toNode.id];
              
              if (fromPos && toPos) {
                // Draw line (edge)
                ctx.beginPath();
                ctx.moveTo(fromPos.x, fromPos.y);
                ctx.lineTo(toPos.x, toPos.y);
                ctx.strokeStyle = '#e2e8f0';
                ctx.lineWidth = 1;
                ctx.stroke();
                
                // Draw direction arrow
                const angle = Math.atan2(toPos.y - fromPos.y, toPos.x - fromPos.x);
                const arrowSize = 5;
                const arrowX = toPos.x - Math.cos(angle) * toNode.size;
                const arrowY = toPos.y - Math.sin(angle) * toNode.size;
                
                ctx.beginPath();
                ctx.moveTo(arrowX, arrowY);
                ctx.lineTo(
                  arrowX - arrowSize * Math.cos(angle - Math.PI / 6),
                  arrowY - arrowSize * Math.sin(angle - Math.PI / 6)
                );
                ctx.lineTo(
                  arrowX - arrowSize * Math.cos(angle + Math.PI / 6),
                  arrowY - arrowSize * Math.sin(angle + Math.PI / 6)
                );
                ctx.closePath();
                ctx.fillStyle = '#e2e8f0';
                ctx.fill();
                
                // Add label if present
                if (edge.label) {
                  const midX = (fromPos.x + toPos.x) / 2;
                  const midY = (fromPos.y + toPos.y) / 2;
                  ctx.font = '10px sans-serif';
                  ctx.fillStyle = '#94a3b8';
                  ctx.textAlign = 'center';
                  ctx.fillText(edge.label, midX, midY - 5);
                }
              }
            }
          });
          
          // Draw nodes
          graphData.nodes.forEach(node => {
            const position = newPositions[node.id];
            if (!position) return;
            
            const isActive = 
              activeTopic === node.label || 
              hoveredNode === node.id ||
              (!activeTopic && searchTerm.length > 0 && 
                node.label.toLowerCase().includes(searchTerm.toLowerCase()));
              
            // Draw circle (node)
            ctx.beginPath();
            ctx.arc(position.x, position.y, isActive ? node.size + 3 : node.size, 0, 2 * Math.PI);
            ctx.fillStyle = isActive ? '#f43f5e' : node.color;
            ctx.fill();
            
            // Add subtle glow effect for hovered/active nodes
            if (isActive) {
              ctx.beginPath();
              ctx.arc(position.x, position.y, node.size + 6, 0, 2 * Math.PI);
              ctx.fillStyle = 'rgba(244, 63, 94, 0.2)';
              ctx.fill();
            }
            
            // Draw label
            ctx.font = isActive ? 'bold 12px sans-serif' : '12px sans-serif';
            ctx.fillStyle = '#f8fafc';
            ctx.textAlign = 'center';
            ctx.fillText(node.label, position.x, position.y + node.size + 15);
          });
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
