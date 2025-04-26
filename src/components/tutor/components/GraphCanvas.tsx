
import React, { useEffect, useRef } from 'react';
import { GraphData } from '../types/graph';

interface GraphCanvasProps {
  graphData: GraphData;
  activeTopic: string | null;
  searchTerm: string;
}

const GraphCanvas = ({ graphData, activeTopic, searchTerm }: GraphCanvasProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

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
          
          // Position nodes in a circular layout
          const centerX = canvas.width / 2;
          const centerY = canvas.height / 2;
          const radius = Math.min(centerX, centerY) * 0.7;
          
          const nodePositions: { [key: string]: { x: number; y: number } } = {};
          
          // Draw edges first
          graphData.edges.forEach(edge => {
            const fromNode = graphData.nodes.find(n => n.id === edge.from);
            const toNode = graphData.nodes.find(n => n.id === edge.to);
            
            if (fromNode && toNode) {
              const fromAngle = (parseInt(fromNode.id) / graphData.nodes.length) * 2 * Math.PI;
              const toAngle = (parseInt(toNode.id) / graphData.nodes.length) * 2 * Math.PI;
              
              const fromX = centerX + radius * Math.cos(fromAngle);
              const fromY = centerY + radius * Math.sin(fromAngle);
              const toX = centerX + radius * Math.cos(toAngle);
              const toY = centerY + radius * Math.sin(toAngle);
              
              nodePositions[fromNode.id] = { x: fromX, y: fromY };
              nodePositions[toNode.id] = { x: toX, y: toY };
              
              // Draw line (edge)
              ctx.beginPath();
              ctx.moveTo(fromX, fromY);
              ctx.lineTo(toX, toY);
              ctx.strokeStyle = '#e2e8f0';
              ctx.lineWidth = 1;
              ctx.stroke();
            }
          });
          
          // Draw nodes
          graphData.nodes.forEach((node, index) => {
            const isActive = activeTopic === node.label || 
              (!activeTopic && searchTerm.length > 0 && 
                node.label.toLowerCase().includes(searchTerm.toLowerCase()));
              
            // Use position from edges if available, otherwise calculate
            const position = nodePositions[node.id] || {
              x: centerX + radius * Math.cos((index / graphData.nodes.length) * 2 * Math.PI),
              y: centerY + radius * Math.sin((index / graphData.nodes.length) * 2 * Math.PI)
            };
            
            // Draw circle (node)
            ctx.beginPath();
            ctx.arc(position.x, position.y, isActive ? node.size + 3 : node.size, 0, 2 * Math.PI);
            ctx.fillStyle = isActive ? '#f43f5e' : node.color;
            ctx.fill();
            
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
  }, [graphData, searchTerm, activeTopic]);

  return (
    <div className="relative flex-grow bg-muted/30 rounded-md overflow-hidden">
      <canvas ref={canvasRef} className="w-full h-full" />
      <div className="absolute bottom-2 left-2 text-xs text-muted-foreground">
        <p>Graph visualization powered by Graph-RAG</p>
      </div>
    </div>
  );
};

export default GraphCanvas;
