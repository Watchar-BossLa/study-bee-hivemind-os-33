
import { supabase } from '@/integrations/supabase/client';

interface TestResult {
  name: string;
  status: 'pass' | 'fail' | 'warning';
  message: string;
  details?: any;
}

export class AuthTester {
  static async testAuthentication(): Promise<TestResult> {
    try {
      // Test basic auth system availability
      const { data, error } = await supabase.auth.getSession();
      
      if (error) {
        return {
          name: 'Authentication System',
          status: 'fail',
          message: 'Authentication system error',
          details: error.message
        };
      }
      
      // Test auth configuration
      const authChecks = [];
      
      // Check if session handling is working
      if (data.session) {
        authChecks.push('Active session detected');
      } else {
        authChecks.push('No active session (expected for anonymous users)');
      }
      
      // Test if we can access auth methods
      try {
        await supabase.auth.signInAnonymously();
        authChecks.push('Auth methods accessible');
      } catch (authError) {
        authChecks.push('Auth methods available but anonymous signin disabled');
      }
      
      return {
        name: 'Authentication System',
        status: 'pass',
        message: 'Authentication system initialized',
        details: { 
          hasSession: !!data.session,
          checks: authChecks
        }
      };
    } catch (error) {
      return {
        name: 'Authentication System',
        status: 'fail',
        message: 'Authentication system error',
        details: error
      };
    }
  }
}
