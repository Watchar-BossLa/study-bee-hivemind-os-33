
import { useState, useEffect, useCallback } from 'react';
import { speechService } from '../services/SpeechService';

export function useSpeech() {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isEnabled, setIsEnabled] = useState(false);
  
  // Initialize speech service when hook is first used
  useEffect(() => {
    if (isEnabled) {
      speechService.initialize().catch(error => {
        console.error('Failed to initialize speech service:', error);
        setIsEnabled(false);
      });
    }
  }, [isEnabled]);
  
  // Speak text
  const speak = useCallback(async (text: string) => {
    if (!isEnabled || !text) return;
    
    setIsSpeaking(true);
    try {
      await speechService.speak(text);
    } catch (error) {
      console.error('Speech error:', error);
    } finally {
      setIsSpeaking(false);
    }
  }, [isEnabled]);
  
  // Stop speaking
  const stop = useCallback(() => {
    speechService.stop();
    setIsSpeaking(false);
  }, []);
  
  // Toggle speech capability
  const toggleSpeech = useCallback(() => {
    const newState = !isEnabled;
    setIsEnabled(newState);
    if (!newState) {
      stop();
    } else {
      speechService.initialize();
    }
  }, [isEnabled, stop]);
  
  return { speak, stop, isSpeaking, isEnabled, toggleSpeech };
}
