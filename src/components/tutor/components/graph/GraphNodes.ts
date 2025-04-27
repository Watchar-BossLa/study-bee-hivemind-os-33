
import { GraphData } from '../../types/graph';
import { NodePositions } from '../../hooks/useGraphPositions';

export const drawNodes = (
  ctx: CanvasRenderingContext2D,
  graphData: GraphData,
  nodePositions: NodePositions,
  activeTopic: string | null,
  hoveredNode: string | null,
  searchTerm: string
) => {
  graphData.nodes.forEach(node => {
    const position = nodePositions[node.id];
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
