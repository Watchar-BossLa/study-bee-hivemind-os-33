
/**
 * A simplified EventEmitter implementation for browser environments
 */
export class CustomEventEmitter {
  private events: Record<string, Array<(...args: any[]) => void>> = {};

  /**
   * Register an event handler
   * @param event Event name
   * @param listener Function to call when event is emitted
   */
  public on(event: string, listener: (...args: any[]) => void): this {
    if (!this.events[event]) {
      this.events[event] = [];
    }
    this.events[event].push(listener);
    return this;
  }

  /**
   * Remove an event handler
   * @param event Event name
   * @param listener Function to remove
   */
  public off(event: string, listener: (...args: any[]) => void): this {
    if (this.events[event]) {
      this.events[event] = this.events[event].filter(l => l !== listener);
    }
    return this;
  }

  /**
   * Register a one-time event handler
   * @param event Event name
   * @param listener Function to call once when event is emitted
   */
  public once(event: string, listener: (...args: any[]) => void): this {
    const onceWrapper = (...args: any[]) => {
      listener(...args);
      this.off(event, onceWrapper);
    };
    return this.on(event, onceWrapper);
  }

  /**
   * Emit an event
   * @param event Event name
   * @param args Arguments to pass to handlers
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
   * Remove all listeners for an event, or all events
   * @param event Optional event name
   */
  public removeAllListeners(event?: string): this {
    if (event) {
      delete this.events[event];
    } else {
      this.events = {};
    }
    return this;
  }
}
