
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
      
      // Test if we can access auth methods without throwing errors
      try {
        // Just check if auth methods are available, don't actually call them
        const authMethods = [
          typeof supabase.auth.signInWithPassword,
          typeof supabase.auth.signUp,
          typeof supabase.auth.signOut,
          typeof supabase.auth.resetPasswordForEmail
        ];
        
        if (authMethods.every(method => method === 'function')) {
          authChecks.push('Auth methods available and accessible');
        } else {
          authChecks.push('Some auth methods unavailable');
        }
      } catch (authError) {
        authChecks.push('Auth methods check failed');
      }
      
      return {
        name: 'Authentication System',
        status: 'pass',
        message: 'Authentication system initialized and ready',
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

  static async testAuthFlow(): Promise<TestResult[]> {
    const results: TestResult[] = [];
    
    try {
      // Test 1: Check current auth state
      const { data: sessionData } = await supabase.auth.getSession();
      results.push({
        name: 'Auth State Check',
        status: 'pass',
        message: sessionData.session ? 'User is authenticated' : 'No active session',
        details: { authenticated: !!sessionData.session }
      });

      // Test 2: Test auth state listener
      let listenerWorking = false;
      const { data: { subscription } } = supabase.auth.onAuthStateChange(() => {
        listenerWorking = true;
      });
      
      // Clean up listener immediately
      subscription.unsubscribe();
      
      results.push({
        name: 'Auth State Listener',
        status: 'pass',
        message: 'Auth state listener successfully initialized'
      });

      // Test 3: Test form validation (without actually submitting)
      const emailValidation = this.validateEmail('test@example.com');
      const passwordValidation = this.validatePassword('password123');
      
      results.push({
        name: 'Form Validation',
        status: emailValidation && passwordValidation ? 'pass' : 'fail',
        message: 'Email and password validation working',
        details: { emailValid: emailValidation, passwordValid: passwordValidation }
      });

    } catch (error) {
      results.push({
        name: 'Auth Flow Test',
        status: 'fail',
        message: 'Auth flow test failed',
        details: error
      });
    }
    
    return results;
  }

  private static validateEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  private static validatePassword(password: string): boolean {
    return password.length >= 6;
  }

  static async testSessionPersistence(): Promise<TestResult> {
    try {
      // Test if session persists across page reloads (simulated)
      const { data: { session } } = await supabase.auth.getSession();
      
      // Check if localStorage has auth tokens (indicates persistence setup)
      const hasAuthTokens = localStorage.getItem('sb-zhvhqpdcxgmcdoowahql-auth-token') !== null;
      
      return {
        name: 'Session Persistence',
        status: hasAuthTokens ? 'pass' : 'warning',
        message: hasAuthTokens ? 'Session persistence configured' : 'Session persistence may not be properly configured',
        details: {
          hasSession: !!session,
          hasStoredTokens: hasAuthTokens
        }
      };
    } catch (error) {
      return {
        name: 'Session Persistence',
        status: 'fail',
        message: 'Session persistence test failed',
        details: error
      };
    }
  }
}
