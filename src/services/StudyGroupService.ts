
import { BaseService, ServiceResponse } from './base/BaseService';
import { supabase } from '@/integrations/supabase/client';

export interface StudyGroup {
  id: string;
  name: string;
  description?: string;
  subject: string;
  max_members: number;
  is_private: boolean;
  access_code?: string;
  creator_id: string;
  created_at: string;
  updated_at: string;
  member_count?: number;
  user_role?: string;
}

export interface StudyGroupMember {
  id: string;
  group_id: string;
  user_id: string;
  role: string;
  joined_at: string;
  is_active: boolean;
  profile?: {
    full_name?: string;
    avatar_url?: string;
  };
}

export interface CreateStudyGroupData {
  name: string;
  description?: string;
  subject: string;
  max_members: number;
  is_private: boolean;
}

export class StudyGroupService extends BaseService {
  constructor() {
    super({ retryAttempts: 2, timeout: 10000 });
  }

  async createStudyGroup(data: CreateStudyGroupData): Promise<ServiceResponse<StudyGroup>> {
    return this.executeWithRetry(async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const groupData = {
        ...data,
        creator_id: user.id,
        access_code: data.is_private ? this.generateAccessCode() : null
      };

      const { data: group, error } = await supabase
        .from('study_groups')
        .insert(groupData)
        .select()
        .single();

      if (error) throw error;

      // Add creator as admin member
      await supabase
        .from('study_group_members')
        .insert({
          group_id: group.id,
          user_id: user.id,
          role: 'admin'
        });

      return group as StudyGroup;
    }, 'study-group-creation');
  }

  async getStudyGroups(): Promise<ServiceResponse<StudyGroup[]>> {
    return this.executeWithRetry(async () => {
      const { data, error } = await supabase
        .from('study_groups')
        .select(`
          *,
          study_group_members!inner(count)
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return (data || []) as StudyGroup[];
    }, 'study-groups-fetching');
  }

  async joinStudyGroup(groupId: string, accessCode?: string): Promise<ServiceResponse<void>> {
    return this.executeWithRetry(async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      // Check if group exists and user can join
      const { data: group, error: groupError } = await supabase
        .from('study_groups')
        .select('*')
        .eq('id', groupId)
        .single();

      if (groupError) throw groupError;
      if (group.is_private && group.access_code !== accessCode) {
        throw new Error('Invalid access code');
      }

      const { error } = await supabase
        .from('study_group_members')
        .insert({
          group_id: groupId,
          user_id: user.id,
          role: 'member'
        });

      if (error) throw error;
    }, 'study-group-joining');
  }

  async leaveStudyGroup(groupId: string): Promise<ServiceResponse<void>> {
    return this.executeWithRetry(async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const { error } = await supabase
        .from('study_group_members')
        .update({ is_active: false })
        .eq('group_id', groupId)
        .eq('user_id', user.id);

      if (error) throw error;
    }, 'study-group-leaving');
  }

  async getGroupMembers(groupId: string): Promise<ServiceResponse<StudyGroupMember[]>> {
    return this.executeWithRetry(async () => {
      const { data, error } = await supabase
        .from('study_group_members')
        .select(`
          *,
          profiles!inner(full_name, avatar_url)
        `)
        .eq('group_id', groupId)
        .eq('is_active', true);

      if (error) throw error;
      return (data || []) as StudyGroupMember[];
    }, 'group-members-fetching');
  }

  async sendGroupMessage(groupId: string, content: string): Promise<ServiceResponse<void>> {
    return this.executeWithRetry(async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const { error } = await supabase
        .from('study_group_messages')
        .insert({
          group_id: groupId,
          user_id: user.id,
          content,
          message_type: 'text'
        });

      if (error) throw error;
    }, 'group-message-sending');
  }

  private generateAccessCode(): string {
    return Math.random().toString(36).substring(2, 8).toUpperCase();
  }
}

export const studyGroupService = new StudyGroupService();
