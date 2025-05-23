
/**
 * This file provides a wrapper around the Rust-generated WebAssembly module
 * for SM-2⁺ calculations. In a full implementation, we would compile Rust code
 * to WebAssembly and load it here.
 * 
 * For now, this simulates the WASM interface with TypeScript.
 */

// Simulate WASM module interface
interface SM2PlusWasm {
  calculateNextInterval: (
    consecutiveCorrect: number,
    easinessFactor: number,
    wasCorrect: boolean,
    responseTimeMs?: number,
    retentionRate?: number
  ) => {
    easinessFactor: number;
    intervalDays: number;
    retention: number;
  };
}

// Placeholder for actual WebAssembly loading
// In a real implementation, this would use WebAssembly.instantiateStreaming
// to load the compiled Rust module
let wasmModule: SM2PlusWasm | null = null;

// Initialize the WASM module
export async function initWasmModule(): Promise<boolean> {
  try {
    // This would be the actual loading code:
    // const { instance } = await WebAssembly.instantiateStreaming(
    //   fetch('/sm2plus_rust.wasm'),
    //   {}
    // );
    // wasmModule = instance.exports as SM2PlusWasm;
    
    // For now, simulate successful loading
    wasmModule = createSimulatedWasmModule();
    console.log('SM-2⁺ WASM module initialized successfully');
    return true;
  } catch (error) {
    console.error('Failed to initialize SM-2⁺ WASM module:', error);
    return false;
  }
}

// Use the WASM module to calculate next review interval
export function calculateNextIntervalWasm(
  consecutiveCorrect: number,
  easinessFactor: number,
  wasCorrect: boolean,
  responseTimeMs?: number,
  retentionRate?: number
): { easinessFactor: number; intervalDays: number; retention: number } {
  // Ensure module is initialized
  if (!wasmModule) {
    console.warn('WASM module not initialized, using fallback');
    return fallbackCalculation(consecutiveCorrect, easinessFactor, wasCorrect);
  }
  
  // Call the Rust-compiled WASM function
  return wasmModule.calculateNextInterval(
    consecutiveCorrect,
    easinessFactor,
    wasCorrect,
    responseTimeMs,
    retentionRate
  );
}

// Fallback implementation if WASM fails to load
function fallbackCalculation(
  consecutiveCorrect: number,
  easinessFactor: number,
  wasCorrect: boolean
): { easinessFactor: number; intervalDays: number; retention: number } {
  let newEF = easinessFactor;
  let interval = 1;
  
  if (wasCorrect) {
    const newConsecutive = consecutiveCorrect + 1;
    newEF = Math.max(1.3, easinessFactor + 0.1);
    
    if (newConsecutive === 1) interval = 1;
    else if (newConsecutive === 2) interval = 6;
    else interval = Math.round(consecutiveCorrect * newEF);
  } else {
    newEF = Math.max(1.3, easinessFactor - 0.3);
    interval = 1;
  }
  
  // Simplified retention calculation
  const retention = 100 * Math.exp(-interval / (2 * newEF));
  
  return {
    easinessFactor: newEF,
    intervalDays: interval,
    retention: Math.max(0, Math.min(100, retention))
  };
}

// Create a simulated WASM module for development
function createSimulatedWasmModule(): SM2PlusWasm {
  return {
    calculateNextInterval: (
      consecutiveCorrect: number,
      easinessFactor: number,
      wasCorrect: boolean,
      responseTimeMs?: number,
      retentionRate?: number
    ) => {
      // This simulates what the Rust code would do
      let adjustedEF = wasCorrect ? 
        Math.max(1.3, easinessFactor + 0.1) : 
        Math.max(1.3, easinessFactor - 0.3);
      
      // Apply response time adjustment
      if (wasCorrect && responseTimeMs) {
        const normalizedTime = Math.min(Math.max(responseTimeMs / 3000, 0.5), 1.5);
        adjustedEF *= (2 - normalizedTime);
      }
      
      // Apply retention rate adjustment
      if (retentionRate && wasCorrect) {
        if (retentionRate < 85) {
          adjustedEF *= 0.95;
        } else if (retentionRate > 95) {
          adjustedEF *= 1.05;
        }
      }
      
      let interval;
      if (!wasCorrect) {
        interval = 1;
      } else if (consecutiveCorrect === 0) {
        interval = 1;
      } else if (consecutiveCorrect === 1) {
        interval = 6;
      } else {
        interval = Math.round(consecutiveCorrect * adjustedEF);
      }
      
      const retention = 100 * Math.exp(-interval / (2 * adjustedEF));
      
      return {
        easinessFactor: adjustedEF,
        intervalDays: interval,
        retention: Math.max(0, Math.min(100, retention))
      };
    }
  };
}
