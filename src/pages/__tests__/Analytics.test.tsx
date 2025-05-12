
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { ThemeProvider } from '@/components/theme/ThemeProvider';
import Analytics from '../Analytics';

// Mock the analytics components to isolate testing
jest.mock('@/components/analytics/AnalyticsDashboard', () => ({
  __esModule: true,
  default: () => <div data-testid="analytics-dashboard">Analytics Dashboard Mocked</div>
}));

jest.mock('@/components/NavbarWithDashboard', () => ({
  __esModule: true,
  default: () => <div data-testid="navbar">Navbar Mocked</div>
}));

jest.mock('lucide-react', () => ({
  InfoCircle: () => <div data-testid="info-circle-icon">Info Icon</div>
}));

describe('Analytics Page', () => {
  const renderAnalyticsPage = () => {
    return render(
      <ThemeProvider defaultTheme="light">
        <HelmetProvider>
          <MemoryRouter>
            <Analytics />
          </MemoryRouter>
        </HelmetProvider>
      </ThemeProvider>
    );
  };

  test('renders analytics dashboard heading', () => {
    renderAnalyticsPage();
    expect(screen.getByText('Analytics Dashboard')).toBeInTheDocument();
  });

  test('renders analytics dashboard component', () => {
    renderAnalyticsPage();
    expect(screen.getByTestId('analytics-dashboard')).toBeInTheDocument();
  });

  test('renders navigation bar', () => {
    renderAnalyticsPage();
    expect(screen.getByTestId('navbar')).toBeInTheDocument();
  });

  test('renders page description', () => {
    renderAnalyticsPage();
    expect(screen.getByText('Visualize your learning patterns, mastery levels, and optimize your study approach')).toBeInTheDocument();
  });

  test('renders info alert about analytics integration', () => {
    renderAnalyticsPage();
    expect(screen.getByText(/This dashboard integrates with OTEL spans and Grafana Cloud/)).toBeInTheDocument();
  });

  test('renders data privacy information', () => {
    renderAnalyticsPage();
    expect(screen.getByText(/Analytics data is collected and processed according to the Study Bee Technical Specification/)).toBeInTheDocument();
  });
});
