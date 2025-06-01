
export const handleGlobalError = (error: Error): void => {
  console.error('Global application error:', error);
  // In production, this would send to monitoring service
};
