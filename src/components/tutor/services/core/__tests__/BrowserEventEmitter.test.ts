
import { BrowserEventEmitter } from '../BrowserEventEmitter';

describe('BrowserEventEmitter', () => {
  let emitter: BrowserEventEmitter;

  beforeEach(() => {
    emitter = new BrowserEventEmitter();
  });

  it('should register and trigger event listeners', () => {
    const mockListener = jest.fn();
    emitter.on('test-event', mockListener);
    
    emitter.emit('test-event', 'data1', 'data2');
    
    expect(mockListener).toHaveBeenCalledTimes(1);
    expect(mockListener).toHaveBeenCalledWith('data1', 'data2');
  });

  it('should register one-time event listeners', () => {
    const mockListener = jest.fn();
    emitter.once('test-event', mockListener);
    
    emitter.emit('test-event', 'data');
    emitter.emit('test-event', 'data');
    
    expect(mockListener).toHaveBeenCalledTimes(1);
  });

  it('should remove specific event listeners', () => {
    const mockListener1 = jest.fn();
    const mockListener2 = jest.fn();
    
    emitter.on('test-event', mockListener1);
    emitter.on('test-event', mockListener2);
    
    emitter.off('test-event', mockListener1);
    emitter.emit('test-event');
    
    expect(mockListener1).not.toHaveBeenCalled();
    expect(mockListener2).toHaveBeenCalledTimes(1);
  });

  it('should remove all listeners for a specific event', () => {
    const mockListener1 = jest.fn();
    const mockListener2 = jest.fn();
    
    emitter.on('test-event-1', mockListener1);
    emitter.on('test-event-2', mockListener2);
    
    emitter.removeAllListeners('test-event-1');
    
    emitter.emit('test-event-1');
    emitter.emit('test-event-2');
    
    expect(mockListener1).not.toHaveBeenCalled();
    expect(mockListener2).toHaveBeenCalledTimes(1);
  });

  it('should remove all listeners when called without event name', () => {
    const mockListener1 = jest.fn();
    const mockListener2 = jest.fn();
    
    emitter.on('test-event-1', mockListener1);
    emitter.on('test-event-2', mockListener2);
    
    emitter.removeAllListeners();
    
    emitter.emit('test-event-1');
    emitter.emit('test-event-2');
    
    expect(mockListener1).not.toHaveBeenCalled();
    expect(mockListener2).not.toHaveBeenCalled();
  });

  it('should return all listeners for an event', () => {
    const mockListener1 = jest.fn();
    const mockListener2 = jest.fn();
    
    emitter.on('test-event', mockListener1);
    emitter.on('test-event', mockListener2);
    
    const listeners = emitter.listeners('test-event');
    
    expect(listeners).toHaveLength(2);
    expect(listeners).toContain(mockListener1);
    expect(listeners).toContain(mockListener2);
  });

  it('should return an empty array when getting listeners for non-existent event', () => {
    const listeners = emitter.listeners('non-existent-event');
    expect(listeners).toEqual([]);
  });
});
