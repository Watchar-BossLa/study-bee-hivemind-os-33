
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { SectionErrorBoundary } from '../SectionErrorBoundary';

// Component that throws an error for testing
const ErrorThrowingComponent = ({ shouldThrow = true }: { shouldThrow?: boolean }) => {
  if (shouldThrow) {
    throw new Error('Section test error');
  }
  return <div data-testid="section-child">Section content</div>;
};

describe('SectionErrorBoundary', () => {
  const originalConsoleError = console.error;
  
  beforeAll(() => {
    console.error = jest.fn();
  });
  
  afterAll(() => {
    console.error = originalConsoleError;
  });
  
  it('renders children when no error occurs', () => {
    render(
      <SectionErrorBoundary sectionName="test-section">
        <div data-testid="section-child">Section content</div>
      </SectionErrorBoundary>
    );
    
    expect(screen.getByTestId('section-child')).toBeInTheDocument();
  });
  
  it('renders section error fallback when an error occurs', () => {
    render(
      <SectionErrorBoundary sectionName="test-section">
        <ErrorThrowingComponent />
      </SectionErrorBoundary>
    );
    
    expect(screen.getByText(/component error/i)).toBeInTheDocument();
    expect(screen.getByText(/section encountered an error/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /reload section/i })).toBeInTheDocument();
  });
  
  it('shows error message in development mode', () => {
    const originalNodeEnv = process.env.NODE_ENV;
    process.env.NODE_ENV = 'development';
    
    render(
      <SectionErrorBoundary sectionName="test-section">
        <ErrorThrowingComponent />
      </SectionErrorBoundary>
    );
    
    expect(screen.getByText('Section test error')).toBeInTheDocument();
    
    process.env.NODE_ENV = originalNodeEnv;
  });
  
  it('allows resetting the error boundary', () => {
    const { rerender } = render(
      <SectionErrorBoundary sectionName="test-section">
        <ErrorThrowingComponent shouldThrow={true} />
      </SectionErrorBoundary>
    );
    
    expect(screen.getByText(/component error/i)).toBeInTheDocument();
    
    const resetButton = screen.getByRole('button', { name: /reload section/i });
    fireEvent.click(resetButton);
    
    // Rerender with a non-throwing component
    rerender(
      <SectionErrorBoundary sectionName="test-section">
        <ErrorThrowingComponent shouldThrow={false} />
      </SectionErrorBoundary>
    );
    
    expect(screen.getByTestId('section-child')).toBeInTheDocument();
  });
});
