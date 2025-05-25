
// Re-export everything for backward compatibility
export { baseSpecializedAgents } from './BaseAgents';
export { domainSpecializedAgents } from './DomainAgents';
export { metaLearningAgents } from './MetaLearningAgents';
export { AgentSelectionService } from './AgentSelectionService';

// Combine all agents for legacy compatibility
import { baseSpecializedAgents } from './BaseAgents';
import { domainSpecializedAgents } from './DomainAgents';
import { metaLearningAgents } from './MetaLearningAgents';
import { AgentSelectionService } from './AgentSelectionService';

export const allSpecializedAgents = [
  ...baseSpecializedAgents,
  ...domainSpecializedAgents,
  ...metaLearningAgents
];

// Create service instance for legacy functions
const agentSelectionService = new AgentSelectionService();

export const getAgentsByDomain = agentSelectionService.getAgentsByDomain.bind(agentSelectionService);
export const getAgentsForTopic = agentSelectionService.getAgentsForTopic.bind(agentSelectionService);
