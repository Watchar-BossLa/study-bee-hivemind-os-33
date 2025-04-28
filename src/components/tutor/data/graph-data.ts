
import { GraphData } from '../types/graph';

// Enhanced knowledge graph data
export const knowledgeGraphData: GraphData = {
  nodes: [
    { id: '1', label: 'Mitochondria', size: 20, color: '#6366f1' },
    { id: '2', label: 'ATP', size: 15, color: '#8b5cf6' },
    { id: '3', label: 'Cellular Respiration', size: 18, color: '#ec4899' },
    { id: '4', label: 'Krebs Cycle', size: 16, color: '#8b5cf6' },
    { id: '5', label: 'Electron Transport', size: 17, color: '#6366f1' },
    { id: '6', label: 'Glycolysis', size: 15, color: '#ec4899' },
    { id: '7', label: 'Cell Biology', size: 25, color: '#f43f5e' },
    { id: '8', label: 'DNA', size: 18, color: '#6366f1' },
    { id: '9', label: 'RNA', size: 16, color: '#8b5cf6' },
    { id: '10', label: 'Protein Synthesis', size: 19, color: '#ec4899' },
    { id: '11', label: 'Genetics', size: 22, color: '#f43f5e' },
    { id: '12', label: 'Evolution', size: 22, color: '#f43f5e' },
    { id: '13', label: 'Natural Selection', size: 18, color: '#8b5cf6' },
  ],
  edges: [
    { from: '1', to: '2', label: 'produces' },
    { from: '1', to: '3', label: 'performs' },
    { from: '3', to: '4', label: 'includes' },
    { from: '3', to: '5', label: 'includes' },
    { from: '3', to: '6', label: 'starts with' },
    { from: '7', to: '1', label: 'contains' },
    { from: '8', to: '9', label: 'transcribes to' },
    { from: '9', to: '10', label: 'enables' },
    { from: '11', to: '8', label: 'studies' },
    { from: '12', to: '13', label: 'mechanism' },
    { from: '4', to: '2', label: 'produces' },
    { from: '5', to: '2', label: 'produces' },
    { from: '11', to: '12', label: 'explains' },
  ]
};
