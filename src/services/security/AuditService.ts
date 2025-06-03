
import { supabase } from '@/integrations/supabase/client';
import { logger } from '@/utils/logger';

export interface AuditLog {
  id: string;
  user_id: string | null;
  table_name: string;
  operation: string;
  old_values: Record<string, any> | null;
  new_values: Record<string, any> | null;
  ip_address: string | null;
  user_agent: string | null;
  created_at: string;
}

export class AuditService {
  static async getAuditLogs(
    filters?: {
      userId?: string;
      tableName?: string;
      operation?: string;
      startDate?: Date;
      endDate?: Date;
    },
    limit: number = 100
  ): Promise<AuditLog[]> {
    try {
      let query = supabase
        .from('audit_logs')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(limit);

      if (filters?.userId) {
        query = query.eq('user_id', filters.userId);
      }
      if (filters?.tableName) {
        query = query.eq('table_name', filters.tableName);
      }
      if (filters?.operation) {
        query = query.eq('operation', filters.operation);
      }
      if (filters?.startDate) {
        query = query.gte('created_at', filters.startDate.toISOString());
      }
      if (filters?.endDate) {
        query = query.lte('created_at', filters.endDate.toISOString());
      }

      const { data, error } = await query;

      if (error) throw error;
      
      // Transform the data to match our interface
      const transformedData: AuditLog[] = (data || []).map(row => ({
        id: row.id,
        user_id: row.user_id,
        table_name: row.table_name,
        operation: row.operation,
        old_values: row.old_values as Record<string, any> | null,
        new_values: row.new_values as Record<string, any> | null,
        ip_address: row.ip_address ? String(row.ip_address) : null,
        user_agent: row.user_agent,
        created_at: row.created_at
      }));

      return transformedData;
    } catch (error) {
      logger.error('Failed to fetch audit logs:', error);
      throw error;
    }
  }

  static async getAuditSummary(): Promise<{
    totalEvents: number;
    eventsByTable: Record<string, number>;
    eventsByOperation: Record<string, number>;
    recentActivity: AuditLog[];
  }> {
    try {
      const [logs, recentLogs] = await Promise.all([
        this.getAuditLogs({}, 1000),
        this.getAuditLogs({}, 10)
      ]);

      const eventsByTable: Record<string, number> = {};
      const eventsByOperation: Record<string, number> = {};

      logs.forEach(log => {
        eventsByTable[log.table_name] = (eventsByTable[log.table_name] || 0) + 1;
        eventsByOperation[log.operation] = (eventsByOperation[log.operation] || 0) + 1;
      });

      return {
        totalEvents: logs.length,
        eventsByTable,
        eventsByOperation,
        recentActivity: recentLogs
      };
    } catch (error) {
      logger.error('Failed to get audit summary:', error);
      throw error;
    }
  }
}
