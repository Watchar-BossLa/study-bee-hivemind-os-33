
import { AutogenIntegration } from '../AutogenIntegration';
import { AutogenTurnGuard } from '../AutogenTurnGuard';
import { LLMRouter } from '../../LLMRouter';

// Mock dependencies
jest.mock('../../LLMRouter');
jest.mock('../AutogenTurnGuard');

describe('AutogenIntegration', () => {
  let mockRouter: jest.Mocked<LLMRouter>;
  let mockTurnGuard: jest.Mocked<AutogenTurnGuard>;
  let autogenIntegration: AutogenIntegration;

  beforeEach(() => {
    mockRouter = new LLMRouter() as jest.Mocked<LLMRouter>;
    mockTurnGuard = new AutogenTurnGuard() as jest.Mocked<AutogenTurnGuard>;
    
    mockTurnGuard.startSession = jest.fn().mockReturnValue({ 
      maxTurns: 5,
      currentTurn: 0
    });
    
    mockTurnGuard.recordTurn = jest.fn().mockReturnValue(true);
    
    autogenIntegration = new AutogenIntegration(mockRouter, mockTurnGuard);
  });

  describe('createThread', () => {
    it('should create a thread with given agents and topic', () => {
      const result = autogenIntegration.createThread(['agent1', 'agent2'], 'test-topic');
      
      expect(result.threadId).toBeDefined();
      expect(result.maxTurns).toBe(5);
      expect(mockTurnGuard.startSession).toHaveBeenCalledWith(expect.any(String));
    });
    
    it('should not set maxTurns when turnGuard is not provided', () => {
      const autogenWithoutGuard = new AutogenIntegration(mockRouter);
      const result = autogenWithoutGuard.createThread(['agent1'], 'topic');
      
      expect(result.threadId).toBeDefined();
      expect(result.maxTurns).toBeUndefined();
    });
  });

  describe('processTurn', () => {
    it('should process a turn and return a response', async () => {
      const response = await autogenIntegration.processTurn('thread-1', 'user', 'Hello');
      
      expect(response.toAgent).toBe('assistant');
      expect(response.response).toContain('Response from assistant');
      expect(response.isFinalTurn).toBe(false);
      expect(mockTurnGuard.recordTurn).toHaveBeenCalledWith('thread-1');
    });
    
    it('should mark as final turn when turn guard indicates no continuation', async () => {
      mockTurnGuard.recordTurn = jest.fn().mockReturnValueOnce(false);
      
      const response = await autogenIntegration.processTurn('thread-1', 'user', 'Hello');
      
      expect(response.isFinalTurn).toBe(true);
    });
  });

  describe('runRedTeamAnalysis', () => {
    it('should create a thread and process security analysis turns', async () => {
      const spy = jest.spyOn(autogenIntegration, 'createThread');
      const processTurnSpy = jest.spyOn(autogenIntegration, 'processTurn');
      const endThreadSpy = jest.spyOn(autogenIntegration, 'endThread');
      
      spy.mockReturnValue({ threadId: 'security-thread', maxTurns: 5 });
      
      const result = await autogenIntegration.runRedTeamAnalysis('test message', {});
      
      expect(result.riskLevel).toBeGreaterThanOrEqual(1);
      expect(result.riskLevel).toBeLessThanOrEqual(10);
      expect(result.recommendations).toHaveLength(3);
      expect(result.threadId).toBe('security-thread');
      
      expect(spy).toHaveBeenCalledWith(
        ['attacker', 'defender', 'patcher'],
        'security-analysis'
      );
      
      expect(processTurnSpy).toHaveBeenCalledTimes(3);
      expect(endThreadSpy).toHaveBeenCalledWith('security-thread');
    });
  });
});
