
/**
 * A simple EventEmitter implementation for browser environments
 * This replaces Node.js's EventEmitter which isn't compatible with browser environments
 */
export class BrowserEventEmitter {
  private events: Record<string, Array<(...args: any[]) => void>> = {};

  /**
   * Register an event listener
   */
  public on(event: string, listener: (...args: any[]) => void): this {
    if (!this.events[event]) {
      this.events[event] = [];
    }
    this.events[event].push(listener);
    return this;
  }

  /**
   * Register a one-time event listener
   */
  public once(event: string, listener: (...args: any[]) => void): this {
    const onceWrapper = (...args: any[]) => {
      listener(...args);
      this.off(event, onceWrapper);
    };
    return this.on(event, onceWrapper);
  }

  /**
   * Remove an event listener
   */
  public off(event: string, listener: (...args: any[]) => void): this {
    if (this.events[event]) {
      const idx = this.events[event].indexOf(listener);
      if (idx >= 0) {
        this.events[event].splice(idx, 1);
      }
    }
    return this;
  }

  /**
   * Remove all listeners for an event
   */
  public removeAllListeners(event?: string): this {
    if (event) {
      this.events[event] = [];
    } else {
      this.events = {};
    }
    return this;
  }

  /**
   * Emit an event
   */
  public emit(event: string, ...args: any[]): boolean {
    if (!this.events[event]) {
      return false;
    }
    
    this.events[event].forEach(listener => {
      listener(...args);
    });
    
    return true;
  }

  /**
   * Get all listeners for an event
   */
  public listeners(event: string): Array<(...args: any[]) => void> {
    return this.events[event] || [];
  }
}
