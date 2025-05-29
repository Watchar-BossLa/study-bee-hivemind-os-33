
import { PeerLearningService } from '../PeerLearningService';

jest.mock('../base/BaseService');

describe('PeerLearningService', () => {
  let service: PeerLearningService;

  beforeEach(() => {
    service = new PeerLearningService();
  });

  describe('getPeerSessions', () => {
    it('should return peer learning sessions', async () => {
      const mockSessions = [
        { id: '1', topic: 'Calculus Review', participants: 3 },
        { id: '2', topic: 'Chemistry Lab', participants: 5 }
      ];

      const executeSpy = jest.spyOn(service as any, 'executeWithRetry');
      executeSpy.mockResolvedValue(mockSessions);

      const result = await service.getPeerSessions();

      expect(result).toEqual(mockSessions);
      expect(executeSpy).toHaveBeenCalledWith(
        expect.any(Function),
        'peer-sessions-fetching'
      );
    });
  });

  describe('joinPeerSession', () => {
    it('should join a peer session successfully', async () => {
      const sessionId = 'session-123';
      const mockResponse = { success: true, sessionId };

      const executeSpy = jest.spyOn(service as any, 'executeWithRetry');
      executeSpy.mockResolvedValue(mockResponse);

      const result = await service.joinPeerSession(sessionId);

      expect(result).toEqual(mockResponse);
      expect(executeSpy).toHaveBeenCalledWith(
        expect.any(Function),
        'peer-session-joining'
      );
    });
  });
});
