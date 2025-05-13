
import React from 'react';
import { render, screen } from '@testing-library/react';
import SwarmMetricsDisplay from '../SwarmMetricsDisplay';
import { MOCK_SWARM_METRICS } from '@/data/analytics/mockSwarmMetrics';

// Mock the ChartContainer to avoid recharts rendering issues in tests
jest.mock('@/components/ui/chart', () => ({
  ChartContainer: ({ children }: { children: React.ReactNode }) => <div data-testid="chart-container">{children}</div>,
  ChartTooltip: () => <div data-testid="chart-tooltip">Chart Tooltip</div>,
}));

// Mock Recharts components
jest.mock('recharts', () => ({
  BarChart: ({ children }: { children: React.ReactNode }) => <div data-testid="bar-chart">{children}</div>,
  LineChart: ({ children }: { children: React.ReactNode }) => <div data-testid="line-chart">{children}</div>,
  AreaChart: ({ children }: { children: React.ReactNode }) => <div data-testid="area-chart">{children}</div>,
  ResponsiveContainer: ({ children }: { children: React.ReactNode }) => <div data-testid="responsive-container">{children}</div>,
  Area: () => <div data-testid="area">Area</div>,
  Bar: () => <div data-testid="bar">Bar</div>,
  Line: () => <div data-testid="line">Line</div>,
  XAxis: () => <div data-testid="x-axis">XAxis</div>,
  YAxis: () => <div data-testid="y-axis">YAxis</div>,
  CartesianGrid: () => <div data-testid="cartesian-grid">CartesianGrid</div>,
  Tooltip: () => <div data-testid="tooltip">Tooltip</div>,
  Legend: () => <div data-testid="legend">Legend</div>,
}));

describe('SwarmMetricsDisplay', () => {
  it('renders the empty state when no data is provided', () => {
    render(<SwarmMetricsDisplay data={[]} />);
    expect(screen.getByText('No swarm metrics data available')).toBeInTheDocument();
  });

  it('renders with metrics data and displays summary statistics', () => {
    render(<SwarmMetricsDisplay data={MOCK_SWARM_METRICS} />);
    
    // Check that main header is present
    expect(screen.getByText('Swarm Fan-out Stats (24h)')).toBeInTheDocument();
    
    // Check for summary metrics
    expect(screen.getByText('Avg Fan-out')).toBeInTheDocument();
    expect(screen.getByText('Avg Time')).toBeInTheDocument();
    expect(screen.getByText('Success Rate')).toBeInTheDocument();
    expect(screen.getByText('Agent Utilization')).toBeInTheDocument();
    
    // Check for chart sections
    expect(screen.getByText('Completion Time (seconds)')).toBeInTheDocument();
    expect(screen.getByText('Task Type Distribution')).toBeInTheDocument();
    expect(screen.getByText('Success Rate Trend')).toBeInTheDocument();
    expect(screen.getByText('Priority Distribution')).toBeInTheDocument();
  });

  it('renders child task metrics section from feat/swarm-metrics', () => {
    render(<SwarmMetricsDisplay data={MOCK_SWARM_METRICS} />);
    
    // Check for child task specific sections
    expect(screen.getByText('Task Concurrency')).toBeInTheDocument();
    expect(screen.getByText('Child Task Stats')).toBeInTheDocument();
    
    // Check for TurnGuard information
    expect(screen.getByText('AutogenTurnGuard')).toBeInTheDocument();
    expect(screen.getByText('max_turns: 6')).toBeInTheDocument();
    
    // Check for LangChainQuotaGuard information
    expect(screen.getByText('LangChainQuotaGuard')).toBeInTheDocument();
    expect(screen.getByText('rate_limit: active')).toBeInTheDocument();
  });

  it('correctly renders accessibility labels for charts', () => {
    render(<SwarmMetricsDisplay data={MOCK_SWARM_METRICS} />);
    
    // Check for accessibility labels
    expect(screen.getByLabelText('Swarm metrics summary')).toBeInTheDocument();
    expect(screen.getByLabelText('Fan-out count by date')).toBeInTheDocument();
    expect(screen.getByLabelText('Completion time by date')).toBeInTheDocument();
    expect(screen.getByLabelText('Task type distribution')).toBeInTheDocument();
    expect(screen.getByLabelText('Success rate by date')).toBeInTheDocument();
    expect(screen.getByLabelText('Priority level distribution')).toBeInTheDocument();
    expect(screen.getByLabelText('Task concurrency by date')).toBeInTheDocument();
    expect(screen.getByLabelText('Child task stats summary')).toBeInTheDocument();
  });
});
