
import { SwarmMetric } from '@/types/analytics';

const now = new Date();
const yesterday = new Date(now);
yesterday.setDate(now.getDate() - 1);
const twoDaysAgo = new Date(now);
twoDaysAgo.setDate(now.getDate() - 2);
const threeDaysAgo = new Date(now);
threeDaysAgo.setDate(now.getDate() - 3);

export const MOCK_SWARM_METRICS: SwarmMetric[] = [
  {
    id: '1',
    timestamp: now.toISOString(),
    fanout_count: 6,
    completion_time_ms: 2850,
    success_rate: 1.0,
    agent_utilization: 0.85,
    task_type: 'knowledge_graph',
    priority_level: 'normal',
    child_task_ratio: 0.95,
    task_concurrency: 5.1
  },
  {
    id: '2',
    timestamp: yesterday.toISOString(),
    fanout_count: 4,
    completion_time_ms: 1920,
    success_rate: 0.95,
    agent_utilization: 0.75,
    task_type: 'quiz_generation',
    priority_level: 'normal',
    child_task_ratio: 0.90,
    task_concurrency: 3.0
  },
  {
    id: '3',
    timestamp: twoDaysAgo.toISOString(),
    fanout_count: 8,
    completion_time_ms: 3400,
    success_rate: 0.92,
    agent_utilization: 0.90,
    task_type: 'knowledge_graph',
    priority_level: 'high',
    child_task_ratio: 0.88,
    task_concurrency: 7.2
  },
  {
    id: '4',
    timestamp: threeDaysAgo.toISOString(),
    fanout_count: 3,
    completion_time_ms: 1200,
    success_rate: 1.0,
    agent_utilization: 0.60,
    task_type: 'content_summarization',
    priority_level: 'low',
    child_task_ratio: 1.0,
    task_concurrency: 1.8
  },
  {
    id: '5',
    timestamp: now.toISOString(),
    fanout_count: 5,
    completion_time_ms: 2100,
    success_rate: 0.88,
    agent_utilization: 0.70,
    task_type: 'content_summarization',
    priority_level: 'normal',
    child_task_ratio: 0.85,
    task_concurrency: 3.5
  },
  {
    id: '6',
    timestamp: yesterday.toISOString(),
    fanout_count: 10,
    completion_time_ms: 4500,
    success_rate: 0.90,
    agent_utilization: 0.95,
    task_type: 'quiz_generation',
    priority_level: 'critical',
    child_task_ratio: 0.92,
    task_concurrency: 9.5
  },
  {
    id: '7',
    timestamp: twoDaysAgo.toISOString(),
    fanout_count: 7,
    completion_time_ms: 3100,
    success_rate: 0.94,
    agent_utilization: 0.85,
    task_type: 'knowledge_graph',
    priority_level: 'high',
    child_task_ratio: 0.89,
    task_concurrency: 5.9
  }
];
