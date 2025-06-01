
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
      const { data } = await supabase.auth.getSession();
      
      return {
        name: 'Authentication System',
        status: 'pass',
        message: 'Authentication system initialized',
        details: { hasSession: !!data.session }
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
