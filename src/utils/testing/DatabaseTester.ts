
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
      // Simple connection test that doesn't require specific table data
      const { data, error } = await supabase
        .from('profiles')
        .select('count(*)')
        .limit(1);
      
      if (error) {
        // If profiles query fails, try a more basic query
        const { data: basicData, error: basicError } = await supabase
          .rpc('now'); // This should work if Supabase is connected
          
        if (basicError) {
          return {
            name: 'Database Connection',
            status: 'fail',
            message: 'Failed to connect to database',
            details: error.message
          };
        } else {
          return {
            name: 'Database Connection',
            status: 'warning',
            message: 'Database connected but table access may require authentication',
            details: error.message
          };
        }
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
        // Test if the table exists and is accessible
        const { data, error } = await supabase
          .from(endpoint.table)
          .select('count(*)')
          .limit(1);
        
        if (error) {
          // Check if it's an auth error vs table error
          if (error.message.includes('RLS') || error.message.includes('policy')) {
            results.push({
              name: `API: ${endpoint.name}`,
              status: 'warning',
              message: `Table exists but requires authentication (RLS enabled)`
            });
          } else {
            results.push({
              name: `API: ${endpoint.name}`,
              status: 'fail',
              message: `Table access failed: ${error.message}`
            });
          }
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
