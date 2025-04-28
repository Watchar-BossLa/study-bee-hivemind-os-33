
import { useState } from 'react';
import { openSourceLLM } from '../services/OpenSourceLLM';

export function useOpenSourceLLM() {
  const [isProcessing, setIsProcessing] = useState(false);
  const [apiKey, setApiKey] = useState<string | null>(null);
  
  // Set the user's API key
  const setUserApiKey = (key: string) => {
    setApiKey(key);
    openSourceLLM.setApiKey(key);
    // Store in localStorage if needed
    localStorage.setItem('hf_api_key', key);
  };
  
  // Initialize from localStorage if available
  const initialize = () => {
    const savedKey = localStorage.getItem('hf_api_key');
    if (savedKey) {
      setApiKey(savedKey);
      openSourceLLM.setApiKey(savedKey);
    }
  };
  
  // Generate text using the open source LLM
  const generateResponse = async (prompt: string) => {
    if (!prompt.trim()) return '';
    
    setIsProcessing(true);
    try {
      return await openSourceLLM.generateText(prompt);
    } catch (error) {
      console.error('Error generating response:', error);
      return '';
    } finally {
      setIsProcessing(false);
    }
  };
  
  // Change the model being used
  const setModel = (model: string) => {
    openSourceLLM.setModel(model);
  };
  
  return {
    generateResponse,
    isProcessing,
    setApiKey: setUserApiKey,
    apiKey,
    initialize,
    setModel
  };
}
