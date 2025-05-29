
import { PeerLearningService } from '../PeerLearningService';

jest.mock('../base/BaseService');

describe('PeerLearningService', () => {
  let service: PeerLearningService;

  beforeEach(() => {
    service = new PeerLearningService();
  });

  describe('getPeerConnections', () => {
    it('should return peer connections', async () => {
      const mockConnections = [
        { id: '1', requester_id: 'user1', recipient_id: 'user2', status: 'pending' },
        { id: '2', requester_id: 'user1', recipient_id: 'user3', status: 'accepted' }
      ];

      const executeSpy = jest.spyOn(service as any, 'executeWithRetry');
      executeSpy.mockResolvedValue(mockConnections);

      const result = await service.getPeerConnections();

      expect(result).toEqual(mockConnections);
      expect(executeSpy).toHaveBeenCalledWith(
        expect.any(Function),
        'peer-connections-fetching'
      );
    });
  });

  describe('createPeerConnection', () => {
    it('should create a peer connection successfully', async () => {
      const connectionData = {
        recipient_id: 'user-123',
        subjects: ['Math', 'Science'],
        message: 'Let\'s study together!'
      };

      const mockResponse = { id: 'connection-123', ...connectionData, status: 'pending' };

      const executeSpy = jest.spyOn(service as any, 'executeWithRetry');
      executeSpy.mockResolvedValue(mockResponse);

      const result = await service.createPeerConnection(connectionData);

      expect(result).toEqual(mockResponse);
      expect(executeSpy).toHaveBeenCalledWith(
        expect.any(Function),
        'peer-connection-creation'
      );
    });
  });

  describe('findPeers', () => {
    it('should find peers successfully', async () => {
      const mockPeers = [
        { id: 'user1', full_name: 'John Doe', preferred_subjects: ['Math'] },
        { id: 'user2', full_name: 'Jane Smith', preferred_subjects: ['Science'] }
      ];

      const executeSpy = jest.spyOn(service as any, 'executeWithRetry');
      executeSpy.mockResolvedValue(mockPeers);

      const result = await service.findPeers(['Math']);

      expect(result).toEqual(mockPeers);
      expect(executeSpy).toHaveBeenCalledWith(
        expect.any(Function),
        'peers-searching'
      );
    });
  });

  describe('updatePeerConnection', () => {
    it('should update peer connection status', async () => {
      const connectionId = 'connection-123';
      const status = 'accepted';

      const executeSpy = jest.spyOn(service as any, 'executeWithRetry');
      executeSpy.mockResolvedValue(undefined);

      const result = await service.updatePeerConnection(connectionId, status);

      expect(result).toBeUndefined();
      expect(executeSpy).toHaveBeenCalledWith(
        expect.any(Function),
        'peer-connection-updating'
      );
    });
  });
});
