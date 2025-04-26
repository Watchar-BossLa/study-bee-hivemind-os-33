
import React, { useEffect, useRef, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Network, Search } from 'lucide-react';
import { Input } from '@/components/ui/input';

// Simple graph data for visualization
type GraphNode = {
  id: string;
  label: string;
  size: number;
  color: string;
};

type GraphEdge = {
  from: string;
  to: string;
  label?: string;
};

type GraphData = {
  nodes: GraphNode[];
  edges: GraphEdge[];
};

// Sample knowledge graph data for demonstration
const sampleGraphData: GraphData = {
  nodes: [
    { id: '1', label: 'Mitochondria', size: 20, color: '#6366f1' },
    { id: '2', label: 'ATP', size: 15, color: '#8b5cf6' },
    { id: '3', label: 'Cellular Respiration', size: 18, color: '#ec4899' },
    { id: '4', label: 'Krebs Cycle', size: 16, color: '#8b5cf6' },
    { id: '5', label: 'Electron Transport', size: 17, color: '#6366f1' },
    { id: '6', label: 'Glycolysis', size: 15, color: '#ec4899' },
    { id: '7', label: 'Cell Biology', size: 25, color: '#f43f5e' },
    { id: '8', label: 'DNA', size: 18, color: '#6366f1' },
    { id: '9', label: 'Evolution', size: 22, color: '#f43f5e' },
  ],
  edges: [
    { from: '1', to: '2' },
    { from: '1', to: '3' },
    { from: '3', to: '4' },
    { from: '3', to: '5' },
    { from: '3', to: '6' },
    { from: '7', to: '1' },
    { from: '8', to: '1' },
    { from: '9', to: '1' },
    { from: '4', to: '2' },
    { from: '5', to: '2' },
  ]
};

const KnowledgeGraph = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [activeTopic, setActiveTopic] = useState<string | null>(null);
  
  // For a simple visualization, we're drawing circles with connecting lines
  // In a production app, you'd use a library like vis.js or react-force-graph
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
          
          // Draw edges first (so they appear behind nodes)
          sampleGraphData.edges.forEach(edge => {
            const fromNode = sampleGraphData.nodes.find(n => n.id === edge.from);
            const toNode = sampleGraphData.nodes.find(n => n.id === edge.to);
            
            if (fromNode && toNode) {
              const fromAngle = (parseInt(fromNode.id) / sampleGraphData.nodes.length) * 2 * Math.PI;
              const toAngle = (parseInt(toNode.id) / sampleGraphData.nodes.length) * 2 * Math.PI;
              
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
          sampleGraphData.nodes.forEach((node, index) => {
            const isActive = activeTopic === node.label || 
              (!activeTopic && searchTerm.length > 0 && 
                node.label.toLowerCase().includes(searchTerm.toLowerCase()));
              
            // Use position from edges if available, otherwise calculate
            const position = nodePositions[node.id] || {
              x: centerX + radius * Math.cos((index / sampleGraphData.nodes.length) * 2 * Math.PI),
              y: centerY + radius * Math.sin((index / sampleGraphData.nodes.length) * 2 * Math.PI)
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
        
        // Initial draw
        drawGraph();
        
        // Redraw on window resize
        window.addEventListener('resize', drawGraph);
        
        // Clean up
        return () => {
          window.removeEventListener('resize', drawGraph);
        };
      }
    }
  }, [searchTerm, activeTopic]);
  
  // Topics derived from the graph for the sidebar
  const topics = Array.from(new Set(sampleGraphData.nodes.map(node => node.label)));
  
  return (
    <Card className="h-[700px] flex flex-col">
      <CardHeader className="border-b">
        <CardTitle className="flex items-center">
          <Network className="h-5 w-5 mr-2" />
          <span>Knowledge Graph</span>
        </CardTitle>
        <div className="relative">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search topics..."
            className="w-full pl-9"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </CardHeader>
      <CardContent className="p-4 flex-grow flex flex-col">
        <div className="flex gap-2 flex-wrap mb-4">
          {topics.slice(0, 5).map((topic) => (
            <button
              key={topic}
              className={`px-3 py-1 text-xs rounded-full ${
                activeTopic === topic 
                  ? 'bg-primary text-primary-foreground' 
                  : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
              }`}
              onClick={() => setActiveTopic(activeTopic === topic ? null : topic)}
            >
              {topic}
            </button>
          ))}
        </div>
        
        <div className="relative flex-grow bg-muted/30 rounded-md overflow-hidden">
          <canvas 
            ref={canvasRef} 
            className="w-full h-full"
          />
          <div className="absolute bottom-2 left-2 text-xs text-muted-foreground">
            <p>Graph visualization powered by Graph-RAG</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default KnowledgeGraph;
