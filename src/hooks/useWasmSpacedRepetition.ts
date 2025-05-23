
import { useState, useEffect } from 'react';
import { initWasmModule, calculateNextIntervalWasm } from '@/utils/wasmSpacedRepetition';

export function useWasmSpacedRepetition() {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    
    async function loadWasmModule() {
      try {
        setIsLoading(true);
        const success = await initWasmModule();
        
        if (mounted) {
          setIsLoaded(success);
          if (!success) {
            setError('Failed to load SM-2⁺ optimization module');
          }
          setIsLoading(false);
        }
      } catch (err) {
        if (mounted) {
          console.error('Error loading WASM module:', err);
          setError('Error initializing spaced repetition optimization');
          setIsLoading(false);
        }
      }
    }
    
    loadWasmModule();
    
    return () => {
      mounted = false;
    };
  }, []);

  const calculateNextInterval = (
    consecutiveCorrect: number,
    easinessFactor: number,
    wasCorrect: boolean,
    responseTimeMs?: number,
    retentionRate?: number
  ) => {
    return calculateNextIntervalWasm(
      consecutiveCorrect,
      easinessFactor,
      wasCorrect,
      responseTimeMs,
      retentionRate
    );
  };

  return {
    isLoaded,
    isLoading,
    error,
    calculateNextInterval
  };
}
