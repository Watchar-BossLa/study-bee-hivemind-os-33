
import React from 'react';
import { render, screen, fireEvent } from '@/test/utils/test-utils';
import { ThemeToggle } from '../ThemeToggle';
import { useTheme } from '../ThemeProvider';

// Mock the useTheme hook
jest.mock('../ThemeProvider', () => ({
  useTheme: jest.fn(),
}));

// Mock ThemeCustomizer to avoid rendering it in the test
jest.mock('../ThemeCustomizer', () => ({
  ThemeCustomizer: () => <div data-testid="theme-customizer" />,
}));

// Mock useThemeChange hook
jest.mock('@/hooks/useThemeChange', () => ({
  useThemeChange: jest.fn(callback => {
    callback('light', 'light', 1);
    return { theme: 'light', resolvedTheme: 'light', themeVersion: 1 };
  }),
}));

describe('ThemeToggle', () => {
  beforeEach(() => {
    (useTheme as jest.Mock).mockReturnValue({
      theme: 'light',
      setTheme: jest.fn(),
      resolvedTheme: 'light',
      themeVersion: 1,
    });
  });
  
  it('renders the theme toggle button', () => {
    render(<ThemeToggle />);
    const button = screen.getByRole('button', { name: /toggle theme/i });
    expect(button).toBeInTheDocument();
  });
  
  it('opens the dropdown menu when clicked', async () => {
    render(<ThemeToggle />);
    
    // Click the theme toggle button
    const button = screen.getByRole('button', { name: /toggle theme/i });
    fireEvent.click(button);
    
    // Check that the dropdown menu items are displayed
    expect(screen.getByText(/light/i)).toBeInTheDocument();
    expect(screen.getByText(/dark/i)).toBeInTheDocument();
    expect(screen.getByText(/system/i)).toBeInTheDocument();
    expect(screen.getByText(/customize/i)).toBeInTheDocument();
  });
  
  it('calls setTheme when a theme option is clicked', () => {
    const setThemeMock = jest.fn();
    (useTheme as jest.Mock).mockReturnValue({
      theme: 'light',
      setTheme: setThemeMock,
      resolvedTheme: 'light',
      themeVersion: 1,
    });
    
    render(<ThemeToggle />);
    
    // Open dropdown menu
    const button = screen.getByRole('button', { name: /toggle theme/i });
    fireEvent.click(button);
    
    // Click the dark theme option
    const darkOption = screen.getByText(/dark/i);
    fireEvent.click(darkOption);
    
    expect(setThemeMock).toHaveBeenCalledWith('dark');
  });
  
  it('opens the theme customizer when customize option is clicked', () => {
    render(<ThemeToggle />);
    
    // Open dropdown menu
    const button = screen.getByRole('button', { name: /toggle theme/i });
    fireEvent.click(button);
    
    // Click the customize option
    const customizeOption = screen.getByText(/customize/i);
    fireEvent.click(customizeOption);
    
    // Check that the theme customizer is rendered
    const customizer = screen.getByTestId('theme-customizer');
    expect(customizer).toBeInTheDocument();
  });
});
