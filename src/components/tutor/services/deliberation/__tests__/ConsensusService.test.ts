
import { ConsensusService } from '../ConsensusService';
import { ConsensusCalculator } from '../ConsensusCalculator';
import { VoteIntegrityService } from '../VoteIntegrityService';
import { VoteHistoryStorage } from '../VoteHistoryStorage';
import { VoteWeightCalculator } from '../VoteWeightCalculator';

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
    mockConsensusCalculator = new ConsensusCalculator() as jest.Mocked<ConsensusCalculator>;
    mockVoteIntegrityService = new VoteIntegrityService() as jest.Mocked<VoteIntegrityService>;
    mockVoteHistoryStorage = new VoteHistoryStorage() as jest.Mocked<VoteHistoryStorage>;
    mockVoteWeightCalculator = new VoteWeightCalculator() as jest.Mocked<VoteWeightCalculator>;
    
    // Setup mocks
    mockVoteIntegrityService.validateVotes = jest.fn().mockReturnValue(true);
    mockVoteWeightCalculator.calculateWeights = jest.fn().mockReturnValue(
      new Map([
        ['agent1', 0.7],
        ['agent2', 0.3]
      ])
    );
    
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
      const votes = [
        { agentId: 'agent1', confidence: 0.8, suggestion: 'Option A', reasoning: 'Reason 1' },
        { agentId: 'agent2', confidence: 0.5, suggestion: 'Option B', reasoning: 'Reason 2' }
      ];
      
      mockConsensusCalculator.calculateConsensus = jest.fn().mockReturnValue({
        decision: 'Option A',
        confidence: 0.75,
        unanimity: false
      });
      
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
      const votes = [
        { agentId: 'agent1', confidence: 0.8, suggestion: 'Option A', reasoning: 'Reason 1' },
        { agentId: 'agent2', confidence: 0.5, suggestion: 'Option B', reasoning: 'Reason 2' }
      ];
      
      mockVoteIntegrityService.validateVotes = jest.fn().mockReturnValue(false);
      
      // Act & Assert
      await expect(consensusService.processVotes('topic-123', votes))
        .rejects.toThrow('Invalid votes detected');
    });
  });

  describe('getHistoricalConsensus', () => {
    it('should return historical consensus for a topic', async () => {
      // Arrange
      const mockHistoricalData = {
        topic: 'topic-123',
        votes: [
          { agentId: 'agent1', confidence: 0.8, suggestion: 'Option A', reasoning: 'Reason 1' }
        ],
        consensus: 'Option A',
        confidenceScore: 0.8,
        timestamp: new Date()
      };
      
      mockVoteHistoryStorage.getVoteHistory = jest.fn().mockReturnValue([mockHistoricalData]);
      
      // Act
      const result = await consensusService.getHistoricalConsensus('topic-123');
      
      // Assert
      expect(mockVoteHistoryStorage.getVoteHistory).toHaveBeenCalledWith('topic-123');
      expect(result).toEqual([mockHistoricalData]);
    });
  });
});
