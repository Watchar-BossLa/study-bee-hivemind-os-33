
import { useState, useCallback } from 'react';
import { studyGroupService, StudyGroup, CreateStudyGroupData } from '@/services/StudyGroupService';
import { ErrorHandler } from '@/utils/errorHandling';
import { toast } from 'sonner';

export const useStudyGroups = () => {
  const [groups, setGroups] = useState<StudyGroup[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchGroups = useCallback(async () => {
    setIsLoading(true);
    try {
      const result = await studyGroupService.getStudyGroups();
      if (result.success && result.data) {
        setGroups(result.data);
      }
    } catch (error) {
      ErrorHandler.handle(error, 'study-groups-fetching');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const createGroup = useCallback(async (data: CreateStudyGroupData) => {
    try {
      const result = await studyGroupService.createStudyGroup(data);
      if (result.success && result.data) {
        setGroups(prev => [result.data!, ...prev]);
        toast.success('Study group created successfully!');
        return result.data;
      }
    } catch (error) {
      ErrorHandler.handle(error, 'study-group-creation');
      toast.error('Failed to create study group');
    }
    return null;
  }, []);

  const joinGroup = useCallback(async (groupId: string, accessCode?: string) => {
    try {
      const result = await studyGroupService.joinStudyGroup(groupId, accessCode);
      if (result.success) {
        toast.success('Joined study group successfully!');
        fetchGroups(); // Refresh groups
        return true;
      }
    } catch (error) {
      ErrorHandler.handle(error, 'study-group-joining');
      toast.error('Failed to join study group');
    }
    return false;
  }, [fetchGroups]);

  const leaveGroup = useCallback(async (groupId: string) => {
    try {
      const result = await studyGroupService.leaveStudyGroup(groupId);
      if (result.success) {
        toast.success('Left study group successfully');
        fetchGroups(); // Refresh groups
        return true;
      }
    } catch (error) {
      ErrorHandler.handle(error, 'study-group-leaving');
      toast.error('Failed to leave study group');
    }
    return false;
  }, [fetchGroups]);

  return {
    groups,
    isLoading,
    fetchGroups,
    createGroup,
    joinGroup,
    leaveGroup
  };
};
