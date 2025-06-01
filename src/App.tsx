
import React from 'react';
import { RouterProvider } from "react-router-dom";
import { QueryClientProvider } from '@tanstack/react-query';
import { HelmetProvider } from 'react-helmet-async';
import { AuthProvider } from '@/contexts/AuthContext';
import { ToastProvider } from "@/components/ui/toast"
import { ErrorBoundary } from '@/components/error/ErrorBoundary';
import { ErrorFallback } from '@/components/error/ErrorFallback';
import { router } from '@/config/router';
import { createQueryClient } from '@/config/queryClient';
import { handleGlobalError } from '@/config/errorHandling';

const queryClient = createQueryClient();

function App() {
  return (
    <HelmetProvider>
      <QueryClientProvider client={queryClient}>
        <ErrorBoundary fallback={ErrorFallback} onError={handleGlobalError}>
          <AuthProvider>
            <ToastProvider />
            <RouterProvider router={router} />
          </AuthProvider>
        </ErrorBoundary>
      </QueryClientProvider>
    </HelmetProvider>
  );
}

export default App;
