
import { supabase } from '@/integrations/supabase/client';
import { logger } from '@/utils/logger';

interface TestResult {
  name: string;
  status: 'pass' | 'fail' | 'warning';
  message: string;
  details?: any;
}

export class DatabaseTester {
  static async testDatabaseConnection(): Promise<TestResult> {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('count(*)')
        .limit(1);
      
      if (error) {
        return {
          name: 'Database Connection',
          status: 'fail',
          message: 'Failed to connect to database',
          details: error.message
        };
      } else {
        return {
          name: 'Database Connection',
          status: 'pass',
          message: 'Database connection successful'
        };
      }
    } catch (error) {
      return {
        name: 'Database Connection',
        status: 'fail',
        message: 'Database connection error',
        details: error
      };
    }
  }

  static async testApiEndpoints(): Promise<TestResult[]> {
    const endpoints = [
      { name: 'Quiz Questions', table: 'quiz_questions' as const },
      { name: 'Flashcards', table: 'flashcards' as const },
      { name: 'Live Sessions', table: 'live_sessions' as const },
      { name: 'Study Groups', table: 'study_groups' as const }
    ];
    
    const results: TestResult[] = [];
    
    for (const endpoint of endpoints) {
      try {
        const { error } = await supabase
          .from(endpoint.table)
          .select('count(*)')
          .limit(1);
        
        if (error) {
          results.push({
            name: `API: ${endpoint.name}`,
            status: 'warning',
            message: `API endpoint accessible but returned error: ${error.message}`
          });
        } else {
          results.push({
            name: `API: ${endpoint.name}`,
            status: 'pass',
            message: 'API endpoint accessible'
          });
        }
      } catch (error) {
        results.push({
          name: `API: ${endpoint.name}`,
          status: 'fail',
          message: 'API endpoint failed',
          details: error
        });
      }
    }
    
    return results;
  }
}
