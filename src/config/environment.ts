
// Environment configuration for production readiness
export const ENVIRONMENT = {
  // App Environment
  NODE_ENV: process.env.NODE_ENV || 'development',
  APP_NAME: 'Study Bee',
  APP_VERSION: '2.0.0',
  
  // Supabase Configuration
  SUPABASE_URL: "https://zhvhqpdcxgmcdoowahql.supabase.co",
  SUPABASE_ANON_KEY: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpodmhxcGRjeGdtY2Rvb3dhaHFsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDU2Njc5NjYsImV4cCI6MjA2MTI0Mzk2Nn0.yHH0jFSBqL-sCiSpVtMfTmF5OJV5SAbtpI7YCr8lyZI",
  
  // Security Configuration
  ENABLE_CSP: true,
  ENABLE_SECURITY_HEADERS: true,
  
  // Performance Configuration
  ENABLE_PERFORMANCE_MONITORING: true,
  ENABLE_ERROR_TRACKING: true,
  
  // Feature Flags
  FEATURES: {
    ARENA: true,
    TUTOR: true,
    FLASHCARDS: true,
    LIVE_SESSIONS: true,
    COLLABORATIVE_NOTES: true,
    STUDY_GROUPS: true,
    PEER_LEARNING: true,
    OCR: true,
    ANALYTICS: true
  }
} as const;

export const isProduction = () => ENVIRONMENT.NODE_ENV === 'production';
export const isDevelopment = () => ENVIRONMENT.NODE_ENV === 'development';
export const isTest = () => ENVIRONMENT.NODE_ENV === 'test';

// Environment validation
export const validateEnvironment = () => {
  const required = ['SUPABASE_URL', 'SUPABASE_ANON_KEY'];
  const missing = required.filter(key => !ENVIRONMENT[key as keyof typeof ENVIRONMENT]);
  
  if (missing.length > 0) {
    throw new Error(`Missing required environment variables: ${missing.join(', ')}`);
  }
  
  console.log('✅ Environment validation passed');
};
