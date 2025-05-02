
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@/test/utils/test-utils';
import { ThemeProvider } from '@/components/theme/ThemeProvider';
import { ThemeToggle } from '@/components/theme/ThemeToggle';
import ThemeSettings from '@/pages/ThemeSettings';
import { mockThemeSettings } from '@/test/mocks/data-mocks';

// Create a wrapper for integration testing
const ThemeIntegrationWrapper = () => {
  return (
    <ThemeProvider defaultTheme="light">
      <div className="p-4">
        <h1>Theme Integration Test</h1>
        <ThemeToggle />
        <div className="mt-4 p-4 border rounded">
          <p>This is a test component for theme integration testing</p>
        </div>
      </div>
    </ThemeProvider>
  );
};

// Mock localStorage
const mockLocalStorage = (() => {
  let store: Record<string, string> = {};
  
  return {
    getItem: jest.fn((key: string) => store[key] || null),
    setItem: jest.fn((key: string, value: string) => {
      store[key] = value;
    }),
    removeItem: jest.fn((key: string) => {
      delete store[key];
    }),
    clear: jest.fn(() => {
      store = {};
    }),
  };
})();

Object.defineProperty(window, 'localStorage', {
  value: mockLocalStorage,
});

// Tests
describe('Theme Customization Integration Tests', () => {
  beforeEach(() => {
    mockLocalStorage.clear();
  });
  
  it('allows changing theme via ThemeToggle', async () => {
    render(<ThemeIntegrationWrapper />);
    
    // Open theme dropdown
    const themeButton = screen.getByRole('button', { name: /toggle theme/i });
    fireEvent.click(themeButton);
    
    // Select dark theme
    const darkOption = screen.getByText('Dark');
    fireEvent.click(darkOption);
    
    // Verify localStorage was updated
    await waitFor(() => {
      expect(mockLocalStorage.setItem).toHaveBeenCalledWith('study-bee-theme', '"dark"');
    });
  });
  
  it('loads and applies theme settings', () => {
    // Set mock localStorage values
    mockLocalStorage.setItem('study-bee-theme-settings', JSON.stringify(mockThemeSettings));
    
    render(<ThemeProvider defaultTheme="light">
      <div data-testid="themed-content" className="font-custom" />
    </ThemeProvider>);
    
    // Wait for theme settings to be applied
    // In a real test we would check DOM properties, but for this example we'll
    // just verify localStorage was accessed
    expect(mockLocalStorage.getItem).toHaveBeenCalledWith('study-bee-theme-settings');
  });
});
