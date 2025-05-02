
import { renderHook } from '@testing-library/react';
import { useThemeChange } from '../useThemeChange';
import { useTheme } from '@/components/theme/ThemeProvider';

// Mock the useTheme hook
jest.mock('@/components/theme/ThemeProvider', () => ({
  useTheme: jest.fn(),
}));

describe('useThemeChange', () => {
  beforeEach(() => {
    // Create a mock element for theme announcer
    const announcer = document.createElement('div');
    announcer.id = 'theme-change-announcer';
    document.body.appendChild(announcer);
    
    // Setup the useTheme mock
    (useTheme as jest.Mock).mockReturnValue({
      theme: 'light',
      resolvedTheme: 'light',
      themeVersion: 1,
    });
  });
  
  afterEach(() => {
    // Clean up the DOM
    const announcer = document.getElementById('theme-change-announcer');
    if (announcer) {
      document.body.removeChild(announcer);
    }
    jest.clearAllMocks();
  });
  
  it('calls the callback when mounted', () => {
    const callback = jest.fn();
    renderHook(() => useThemeChange(callback));
    
    expect(callback).toHaveBeenCalledWith('light', 'light', 1);
  });
  
  it('updates announcer text with theme change info', () => {
    renderHook(() => useThemeChange(jest.fn()));
    
    const announcer = document.getElementById('theme-change-announcer');
    expect(announcer?.textContent).toBe('Theme changed to light');
  });
  
  it('includes custom settings info in the announcement when version > 1', () => {
    (useTheme as jest.Mock).mockReturnValue({
      theme: 'dark',
      resolvedTheme: 'dark',
      themeVersion: 2,
    });
    
    renderHook(() => useThemeChange(jest.fn()));
    
    const announcer = document.getElementById('theme-change-announcer');
    expect(announcer?.textContent).toContain('with custom settings applied');
  });
  
  it('returns theme values from the hook', () => {
    (useTheme as jest.Mock).mockReturnValue({
      theme: 'system',
      resolvedTheme: 'dark',
      themeVersion: 3,
    });
    
    const { result } = renderHook(() => useThemeChange(jest.fn()));
    
    expect(result.current).toEqual({
      theme: 'system',
      resolvedTheme: 'dark',
      themeVersion: 3,
    });
  });
});
