
import React, { useState, useRef, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Eraser, Undo, Download, Square, Circle, Pencil, Type } from 'lucide-react';

interface SessionWhiteboardProps {
  sessionId: string;
}

const SessionWhiteboard: React.FC<SessionWhiteboardProps> = ({ sessionId }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [tool, setTool] = useState<'pencil' | 'eraser' | 'text' | 'rectangle' | 'circle'>('pencil');
  const [color, setColor] = useState('#000000');
  const [brushSize, setBrushSize] = useState(2);
  const [paths, setPaths] = useState<any[]>([]);
  const [currentPath, setCurrentPath] = useState<any[]>([]);
  
  // Set up canvas context
  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      if (ctx) {
        // Set canvas size
        canvas.width = canvas.offsetWidth;
        canvas.height = canvas.offsetHeight;
        
        // Clear canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // Draw all saved paths
        drawPaths(ctx);
      }
    }
  }, [paths]);
  
  const drawPaths = (ctx: CanvasRenderingContext2D) => {
    paths.forEach(path => {
      ctx.beginPath();
      ctx.strokeStyle = path.color;
      ctx.lineWidth = path.brushSize;
      ctx.lineJoin = 'round';
      ctx.lineCap = 'round';
      
      if (path.tool === 'eraser') {
        ctx.globalCompositeOperation = 'destination-out';
      } else {
        ctx.globalCompositeOperation = 'source-over';
      }
      
      if (path.tool === 'rectangle') {
        ctx.strokeRect(path.points[0].x, path.points[0].y, 
                      path.points[1].x - path.points[0].x, 
                      path.points[1].y - path.points[0].y);
      } else if (path.tool === 'circle') {
        const radius = Math.sqrt(
          Math.pow(path.points[1].x - path.points[0].x, 2) + 
          Math.pow(path.points[1].y - path.points[0].y, 2)
        );
        ctx.beginPath();
        ctx.arc(path.points[0].x, path.points[0].y, radius, 0, 2 * Math.PI);
        ctx.stroke();
      } else {
        // For pencil and eraser
        path.points.forEach((point: any, index: number) => {
          if (index === 0) {
            ctx.moveTo(point.x, point.y);
          } else {
            ctx.lineTo(point.x, point.y);
          }
        });
        ctx.stroke();
      }
    });
  };
  
  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    setIsDrawing(true);
    setCurrentPath([{ x, y }]);
  };
  
  const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    setCurrentPath([...currentPath, { x, y }]);
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    ctx.beginPath();
    ctx.strokeStyle = color;
    ctx.lineWidth = brushSize;
    ctx.lineJoin = 'round';
    ctx.lineCap = 'round';
    
    if (tool === 'eraser') {
      ctx.globalCompositeOperation = 'destination-out';
    } else {
      ctx.globalCompositeOperation = 'source-over';
    }
    
    if (currentPath.length > 1) {
      ctx.moveTo(currentPath[currentPath.length - 2].x, currentPath[currentPath.length - 2].y);
      ctx.lineTo(x, y);
      ctx.stroke();
    }
  };
  
  const stopDrawing = () => {
    if (!isDrawing) return;
    setIsDrawing(false);
    
    const newPath = {
      tool,
      color,
      brushSize,
      points: currentPath,
    };
    
    setPaths([...paths, newPath]);
    setCurrentPath([]);
  };
  
  const handleUndo = () => {
    if (paths.length === 0) return;
    setPaths(paths.slice(0, -1));
  };
  
  const handleClear = () => {
    setPaths([]);
  };
  
  const handleDownload = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const image = canvas.toDataURL('image/png');
    const link = document.createElement('a');
    link.href = image;
    link.download = `whiteboard-${sessionId}-${new Date().toISOString().slice(0, 10)}.png`;
    link.click();
  };
  
  return (
    <div className="flex flex-col h-full border rounded-md overflow-hidden">
      <div className="p-2 border-b flex flex-wrap justify-between gap-2">
        {/* Drawing Tools */}
        <ToggleGroup type="single" value={tool} onValueChange={(value) => value && setTool(value as any)}>
          <ToggleGroupItem value="pencil" aria-label="Pencil">
            <Pencil className="h-4 w-4" />
          </ToggleGroupItem>
          <ToggleGroupItem value="eraser" aria-label="Eraser">
            <Eraser className="h-4 w-4" />
          </ToggleGroupItem>
          <ToggleGroupItem value="rectangle" aria-label="Rectangle">
            <Square className="h-4 w-4" />
          </ToggleGroupItem>
          <ToggleGroupItem value="circle" aria-label="Circle">
            <Circle className="h-4 w-4" />
          </ToggleGroupItem>
          <ToggleGroupItem value="text" aria-label="Text">
            <Type className="h-4 w-4" />
          </ToggleGroupItem>
        </ToggleGroup>
        
        {/* Color Picker */}
        <div className="flex items-center gap-2">
          <input 
            type="color" 
            value={color}
            onChange={(e) => setColor(e.target.value)}
            className="w-8 h-8 rounded"
          />
          <select 
            value={brushSize}
            onChange={(e) => setBrushSize(Number(e.target.value))}
            className="h-8 px-2 rounded border text-sm"
          >
            <option value="1">1px</option>
            <option value="2">2px</option>
            <option value="4">4px</option>
            <option value="8">8px</option>
            <option value="12">12px</option>
          </select>
        </div>
        
        {/* Actions */}
        <div className="flex gap-1">
          <Button variant="outline" size="sm" onClick={handleUndo}>
            <Undo className="h-4 w-4 mr-1" />
            Undo
          </Button>
          <Button variant="outline" size="sm" onClick={handleClear}>
            Clear
          </Button>
          <Button variant="outline" size="sm" onClick={handleDownload}>
            <Download className="h-4 w-4 mr-1" />
            Save
          </Button>
        </div>
      </div>
      
      <div className="flex-1 bg-white">
        <canvas
          ref={canvasRef}
          className="w-full h-full cursor-crosshair"
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={stopDrawing}
          onMouseLeave={stopDrawing}
        />
      </div>
    </div>
  );
};

export default SessionWhiteboard;
