
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
      return data || [];
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
