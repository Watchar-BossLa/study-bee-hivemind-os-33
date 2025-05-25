
// Re-export everything from the new modular structure
export * from './agents';

// For backward compatibility, also export the old interface
export {
  allSpecializedAgents,
  getAgentsByDomain,
  getAgentsForTopic
} from './agents';
