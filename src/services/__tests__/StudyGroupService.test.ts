
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
        description: 'A group for physics study'
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
});
