
import React, { ReactElement } from 'react';
import { render, RenderOptions, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider } from '@/components/theme/ThemeProvider';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

// Create a custom test query client
const createTestQueryClient = () => new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
      // Using staleTime instead of deprecated cacheTime
      gcTime: 0,
      staleTime: 0,
    },
  },
});

interface AllProvidersProps {
  children: React.ReactNode;
}

// Create a wrapper component that includes all providers needed for testing
const AllProviders = ({ children }: AllProvidersProps): React.ReactElement => {
  const queryClient = createTestQueryClient();
  
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="light">
        <BrowserRouter>
          {children}
        </BrowserRouter>
      </ThemeProvider>
    </QueryClientProvider>
  );
};

// Custom render function that wraps the UI with all necessary providers
const customRender = (
  ui: ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>,
) => render(ui, { wrapper: AllProviders, ...options });

// Re-export everything from testing-library
export * from '@testing-library/react';

// Override the render method
export { customRender as render };
