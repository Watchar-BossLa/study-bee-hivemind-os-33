
import React, { Suspense } from 'react';
import { PageLoading } from '@/components/loading/PageLoading';

interface LazyLoadWrapperProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export const LazyLoadWrapper: React.FC<LazyLoadWrapperProps> = ({ 
  children, 
  fallback = <PageLoading /> 
}) => {
  return (
    <Suspense fallback={fallback}>
      {children}
    </Suspense>
  );
};
