
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { ThemeProvider } from '@/components/theme/ThemeProvider';
import Dashboard from '../Dashboard';

describe('Dashboard Page', () => {
  const renderDashboard = () => {
    return render(
      <ThemeProvider defaultTheme="light">
        <HelmetProvider>
          <MemoryRouter>
            <Dashboard />
          </MemoryRouter>
        </HelmetProvider>
      </ThemeProvider>
    );
  };

  test('renders dashboard header', () => {
    renderDashboard();
    expect(screen.getByText('Dashboard')).toBeInTheDocument();
    expect(screen.getByText('Track your progress and access learning tools')).toBeInTheDocument();
  });

  test('renders dashboard tabs', () => {
    renderDashboard();
    expect(screen.getByRole('tab', { name: /Learning Progress/i })).toBeInTheDocument();
    expect(screen.getByRole('tab', { name: /Quick Actions/i })).toBeInTheDocument();
  });

  test('renders link to analytics', () => {
    renderDashboard();
    const analyticsLink = screen.getByText('View detailed analytics');
    expect(analyticsLink).toBeInTheDocument();
    expect(analyticsLink.closest('a')).toHaveAttribute('href', '/analytics');
  });
});
