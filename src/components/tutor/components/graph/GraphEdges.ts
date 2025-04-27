
import { GraphData } from '../../types/graph';
import { NodePositions } from '../../hooks/useGraphPositions';

export const drawEdges = (
  ctx: CanvasRenderingContext2D,
  graphData: GraphData,
  nodePositions: NodePositions
) => {
  graphData.edges.forEach(edge => {
    const fromNode = graphData.nodes.find(n => n.id === edge.from);
    const toNode = graphData.nodes.find(n => n.id === edge.to);
    
    if (fromNode && toNode) {
      const fromPos = nodePositions[fromNode.id];
      const toPos = nodePositions[toNode.id];
      
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
};
