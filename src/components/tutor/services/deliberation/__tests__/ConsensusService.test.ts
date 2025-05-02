
import { ConsensusService } from '../ConsensusService';
import { ConsensusCalculator } from '../ConsensusCalculator';
import { VoteIntegrityService } from '../VoteIntegrityService';
import { VoteHistoryStorage } from '../VoteHistoryStorage';
import { VoteWeightCalculator } from '../VoteWeightCalculator';
import { CouncilVote } from '../../../types/councils';

// Mock dependencies
jest.mock('../ConsensusCalculator');
jest.mock('../VoteIntegrityService');
jest.mock('../VoteHistoryStorage');
jest.mock('../VoteWeightCalculator');

describe('ConsensusService', () => {
  let mockConsensusCalculator: jest.Mocked<ConsensusCalculator>;
  let mockVoteIntegrityService: jest.Mocked<VoteIntegrityService>;
  let mockVoteHistoryStorage: jest.Mocked<VoteHistoryStorage>;
  let mockVoteWeightCalculator: jest.Mocked<VoteWeightCalculator>;
  let consensusService: ConsensusService;

  beforeEach(() => {
    // Clear all mocks
    jest.clearAllMocks();
    
    // Create mock instances with proper typing
    // We need to cast the mocked constructor to access the mock instance
    mockConsensusCalculator = jest.mocked(new ConsensusCalculator());
    mockVoteIntegrityService = jest.mocked(new VoteIntegrityService());
    mockVoteHistoryStorage = jest.mocked(new VoteHistoryStorage());
    mockVoteWeightCalculator = jest.mocked(new VoteWeightCalculator());
    
    // Setup default mock return values
    mockVoteIntegrityService.validateVotes = jest.fn().mockReturnValue(true);
    mockVoteWeightCalculator.calculateWeights = jest.fn().mockReturnValue(
      new Map([
        ['agent1', 0.7],
        ['agent2', 0.3]
      ])
    );
    
    // Setup calculator mock
    mockConsensusCalculator.calculateConsensus = jest.fn().mockReturnValue({
      suggestion: 'Option A',
      confidence: 0.75
    });
    
    // Setup history mock
    mockVoteHistoryStorage.recordVotes = jest.fn().mockImplementation(() => {});
    mockVoteHistoryStorage.getVoteHistory = jest.fn().mockReturnValue([{
      topic: 'topic-123',
      votes: [{ agentId: 'agent1', confidence: 0.8, suggestion: 'Option A', reasoning: 'Reason 1' }],
      consensus: 'Option A',
      confidenceScore: 0.8,
      timestamp: new Date()
    }]);
    
    consensusService = new ConsensusService(
      mockConsensusCalculator,
      mockVoteIntegrityService,
      mockVoteHistoryStorage,
      mockVoteWeightCalculator
    );
  });

  describe('processVotes', () => {
    it('should calculate consensus based on weighted votes', async () => {
      // Arrange
      const votes: CouncilVote[] = [
        { agentId: 'agent1', confidence: 0.8, suggestion: 'Option A', reasoning: 'Reason 1' },
        { agentId: 'agent2', confidence: 0.5, suggestion: 'Option B', reasoning: 'Reason 2' }
      ];
      
      // Act
      const result = await consensusService.processVotes('topic-123', votes);
      
      // Assert
      expect(mockVoteIntegrityService.validateVotes).toHaveBeenCalledWith(votes);
      expect(mockVoteWeightCalculator.calculateWeights).toHaveBeenCalledWith(votes);
      expect(mockConsensusCalculator.calculateConsensus).toHaveBeenCalled();
      expect(mockVoteHistoryStorage.recordVotes).toHaveBeenCalled();
      
      expect(result.consensus).toBe('Option A');
      expect(result.confidenceScore).toBe(0.75);
      expect(result.votes).toEqual(votes);
    });
    
    it('should reject invalid votes', async () => {
      // Arrange
      const votes: CouncilVote[] = [
        { agentId: 'agent1', confidence: 0.8, suggestion: 'Option A', reasoning: 'Reason 1' },
        { agentId: 'agent2', confidence: 0.5, suggestion: 'Option B', reasoning: 'Reason 2' }
      ];
      
      mockVoteIntegrityService.validateVotes.mockReturnValue(false);
      
      // Act & Assert
      await expect(consensusService.processVotes('topic-123', votes))
        .rejects.toThrow('Invalid votes detected');
    });
  });

  describe('getHistoricalConsensus', () => {
    it('should return historical consensus for a topic', async () => {
      // Arrange
      const mockHistoricalData = [{
        topic: 'topic-123',
        votes: [
          { agentId: 'agent1', confidence: 0.8, suggestion: 'Option A', reasoning: 'Reason 1' }
        ],
        consensus: 'Option A',
        confidenceScore: 0.8,
        timestamp: new Date()
      }];
      
      mockVoteHistoryStorage.getVoteHistory.mockReturnValue(mockHistoricalData);
      
      // Act
      const result = await consensusService.getHistoricalConsensus('topic-123');
      
      // Assert
      expect(mockVoteHistoryStorage.getVoteHistory).toHaveBeenCalledWith('topic-123');
      expect(result).toEqual(mockHistoricalData);
    });
  });
  
  describe('calculateConsensus', () => {
    it('should delegate to the calculator', () => {
      // Arrange
      const votes: CouncilVote[] = [
        { agentId: 'agent1', confidence: 0.8, suggestion: 'Option A', reasoning: 'Reason 1' }
      ];
      const suggestionGroups = new Map<string, CouncilVote[]>();
      suggestionGroups.set('Option A', [votes[0]]);
      
      // Act
      const result = consensusService.calculateConsensus(votes, suggestionGroups);
      
      // Assert
      expect(mockConsensusCalculator.calculateConsensus).toHaveBeenCalledWith(
        votes, suggestionGroups, undefined
      );
      expect(result).toEqual({
        suggestion: 'Option A',
        confidence: 0.75
      });
    });
  });
});
