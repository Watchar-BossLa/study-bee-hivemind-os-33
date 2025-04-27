
import { useState, useCallback, MouseEvent } from 'react';

interface ZoomPanState {
  scale: number;
  offsetX: number;
  offsetY: number;
  isDragging: boolean;
  startX: number;
  startY: number;
}

export const useZoomPan = (minZoom: number = 0.5, maxZoom: number = 2) => {
  const [state, setState] = useState<ZoomPanState>({
    scale: 1,
    offsetX: 0,
    offsetY: 0,
    isDragging: false,
    startX: 0,
    startY: 0,
  });

  const handleWheel = useCallback((e: WheelEvent) => {
    e.preventDefault();
    setState(prev => {
      const delta = -e.deltaY * 0.001;
      const newScale = Math.min(Math.max(prev.scale + delta, minZoom), maxZoom);
      return { ...prev, scale: newScale };
    });
  }, [minZoom, maxZoom]);

  const startDrag = useCallback((e: MouseEvent) => {
    setState(prev => ({
      ...prev,
      isDragging: true,
      startX: e.clientX - prev.offsetX,
      startY: e.clientY - prev.offsetY,
    }));
  }, []);

  const onDrag = useCallback((e: MouseEvent) => {
    setState(prev => {
      if (!prev.isDragging) return prev;
      return {
        ...prev,
        offsetX: e.clientX - prev.startX,
        offsetY: e.clientY - prev.startY,
      };
    });
  }, []);

  const endDrag = useCallback(() => {
    setState(prev => ({ ...prev, isDragging: false }));
  }, []);

  return {
    scale: state.scale,
    offsetX: state.offsetX,
    offsetY: state.offsetY,
    isDragging: state.isDragging,
    handlers: {
      handleWheel,
      startDrag,
      onDrag,
      endDrag,
    }
  };
};
