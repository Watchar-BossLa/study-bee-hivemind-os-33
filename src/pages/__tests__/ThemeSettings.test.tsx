
import React from 'react';
import { render, screen } from '@/test/utils/test-utils';
import ThemeSettings from '../../pages/ThemeSettings';
import { useTheme } from '@/components/theme/ThemeProvider';
import { useThemeSettings } from '@/hooks/useThemeSettings';

// Mock necessary hooks
jest.mock('@/components/theme/ThemeProvider', () => ({
  useTheme: jest.fn(),
}));

jest.mock('@/hooks/useThemeSettings', () => ({
  useThemeSettings: jest.fn(),
}));

// Mock ThemeCustomizer component
jest.mock('@/components/theme/ThemeCustomizer', () => ({
  ThemeCustomizer: () => <div data-testid="theme-customizer-modal" />,
}));

// Mock ThemeDiagnostics component
jest.mock('@/components/theme/ThemeDiagnostics', () => ({
  ThemeDiagnostics: () => <div data-testid="theme-diagnostics" />,
}));

// Mock Navbar and Footer
jest.mock('@/components/Navbar', () => () => <div data-testid="navbar" />);
jest.mock('@/components/Footer', () => () => <div data-testid="footer" />);

describe('ThemeSettings Page', () => {
  beforeEach(() => {
    (useTheme as jest.Mock).mockReturnValue({
      resolvedTheme: 'light',
    });
    
    (useThemeSettings as jest.Mock).mockReturnValue({
      resetSettings: jest.fn(),
    });
  });
  
  it('renders the ThemeSettings page', () => {
    render(<ThemeSettings />);
    
    expect(screen.getByText('Theme Settings')).toBeInTheDocument();
    expect(screen.getByText(/customize your interface appearance/i)).toBeInTheDocument();
  });
  
  it('renders the preview section', () => {
    render(<ThemeSettings />);
    
    expect(screen.getByText('Preview')).toBeInTheDocument();
    expect(screen.getByText('Sample Content')).toBeInTheDocument();
  });
  
  it('renders buttons', () => {
    render(<ThemeSettings />);
    
    expect(screen.getByText('Reset to Default')).toBeInTheDocument();
    expect(screen.getByText('Open Customizer')).toBeInTheDocument();
  });
  
  it('renders ThemeDiagnostics', () => {
    render(<ThemeSettings />);
    
    expect(screen.getByTestId('theme-diagnostics')).toBeInTheDocument();
  });
  
  it('calls resetSettings when Reset button is clicked', () => {
    const mockResetSettings = jest.fn();
    (useThemeSettings as jest.Mock).mockReturnValue({
      resetSettings: mockResetSettings,
    });
    
    render(<ThemeSettings />);
    
    const resetButton = screen.getByText('Reset to Default');
    resetButton.click();
    
    expect(mockResetSettings).toHaveBeenCalledTimes(1);
  });
});
