
import { StudyGroupService } from '../StudyGroupService';

// Mock the BaseService
jest.mock('../base/BaseService');

describe('StudyGroupService', () => {
  let service: StudyGroupService;

  beforeEach(() => {
    service = new StudyGroupService();
  });

  describe('getStudyGroups', () => {
    it('should return study groups successfully', async () => {
      const mockGroups = [
        { id: '1', name: 'Math Study Group', subject: 'Mathematics' },
        { id: '2', name: 'Science Group', subject: 'Science' }
      ];

      // Mock the executeWithRetry method
      const executeSpy = jest.spyOn(service as any, 'executeWithRetry');
      executeSpy.mockResolvedValue(mockGroups);

      const result = await service.getStudyGroups();

      expect(result).toEqual(mockGroups);
      expect(executeSpy).toHaveBeenCalledWith(
        expect.any(Function),
        'study-groups-fetching'
      );
    });

    it('should handle errors gracefully', async () => {
      const executeSpy = jest.spyOn(service as any, 'executeWithRetry');
      executeSpy.mockRejectedValue(new Error('Network error'));

      await expect(service.getStudyGroups()).rejects.toThrow('Network error');
    });
  });

  describe('createStudyGroup', () => {
    it('should create a study group successfully', async () => {
      const mockGroupData = {
        name: 'New Study Group',
        subject: 'Physics',
        description: 'A group for physics study',
        max_members: 15,
        is_private: false
      };

      const mockResponse = { id: '3', ...mockGroupData };

      const executeSpy = jest.spyOn(service as any, 'executeWithRetry');
      executeSpy.mockResolvedValue(mockResponse);

      const result = await service.createStudyGroup(mockGroupData);

      expect(result).toEqual(mockResponse);
      expect(executeSpy).toHaveBeenCalledWith(
        expect.any(Function),
        'study-group-creation'
      );
    });
  });

  describe('joinStudyGroup', () => {
    it('should join a study group successfully', async () => {
      const groupId = 'group-123';
      const accessCode = 'ACCESS123';

      const executeSpy = jest.spyOn(service as any, 'executeWithRetry');
      executeSpy.mockResolvedValue(undefined);

      const result = await service.joinStudyGroup(groupId, accessCode);

      expect(result).toBeUndefined();
      expect(executeSpy).toHaveBeenCalledWith(
        expect.any(Function),
        'study-group-joining'
      );
    });
  });

  describe('leaveStudyGroup', () => {
    it('should leave a study group successfully', async () => {
      const groupId = 'group-123';

      const executeSpy = jest.spyOn(service as any, 'executeWithRetry');
      executeSpy.mockResolvedValue(undefined);

      const result = await service.leaveStudyGroup(groupId);

      expect(result).toBeUndefined();
      expect(executeSpy).toHaveBeenCalledWith(
        expect.any(Function),
        'study-group-leaving'
      );
    });
  });

  describe('getGroupMembers', () => {
    it('should return group members successfully', async () => {
      const groupId = 'group-123';
      const mockMembers = [
        { id: 'member1', user_id: 'user1', role: 'admin' },
        { id: 'member2', user_id: 'user2', role: 'member' }
      ];

      const executeSpy = jest.spyOn(service as any, 'executeWithRetry');
      executeSpy.mockResolvedValue(mockMembers);

      const result = await service.getGroupMembers(groupId);

      expect(result).toEqual(mockMembers);
      expect(executeSpy).toHaveBeenCalledWith(
        expect.any(Function),
        'group-members-fetching'
      );
    });
  });

  describe('sendGroupMessage', () => {
    it('should send a group message successfully', async () => {
      const groupId = 'group-123';
      const content = 'Hello everyone!';

      const executeSpy = jest.spyOn(service as any, 'executeWithRetry');
      executeSpy.mockResolvedValue(undefined);

      const result = await service.sendGroupMessage(groupId, content);

      expect(result).toBeUndefined();
      expect(executeSpy).toHaveBeenCalledWith(
        expect.any(Function),
        'group-message-sending'
      );
    });
  });
});
