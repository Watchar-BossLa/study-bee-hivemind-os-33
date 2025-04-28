import { pipeline } from '@huggingface/transformers';

/**
 * SpeechService provides text-to-speech capabilities using Hugging Face models
 */
export class SpeechService {
  private tts: any = null;
  private isInitializing = false;
  private audioContext: AudioContext | null = null;
  
  /**
   * Initialize the text-to-speech pipeline
   */
  async initialize(): Promise<void> {
    if (this.tts || this.isInitializing) return;
    
    try {
      this.isInitializing = true;
      console.log('Initializing speech synthesis pipeline...');
      
      this.tts = await pipeline(
        'text-to-speech',
        'microsoft/speecht5_tts',
        { 
          revision: 'main',
          device: 'cpu'
        }
      );
      
      this.audioContext = new AudioContext();
      
      console.log('Speech synthesis pipeline initialized successfully');
    } catch (error) {
      console.error('Failed to initialize speech synthesis:', error);
      if ('speechSynthesis' in window) {
        console.log('Falling back to browser speech synthesis');
      }
    } finally {
      this.isInitializing = false;
    }
  }
  
  /**
   * Speak the provided text
   * @param text - The text to be spoken
   */
  async speak(text: string): Promise<void> {
    if (!text) return;
    
    try {
      // If Hugging Face TTS is initialized, use it
      if (this.tts && this.audioContext) {
        const output = await this.tts(text);
        const audioBuffer = await this.audioContext.decodeAudioData(output.buffer);
        const source = this.audioContext.createBufferSource();
        source.buffer = audioBuffer;
        source.connect(this.audioContext.destination);
        source.start();
        return;
      }
      
      // Fallback to browser's native speech synthesis
      if ('speechSynthesis' in window) {
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.rate = 1.0;
        utterance.pitch = 1.0;
        window.speechSynthesis.speak(utterance);
      } else {
        console.error('No speech synthesis capability available');
      }
    } catch (error) {
      console.error('Error speaking text:', error);
    }
  }
  
  /**
   * Stop speaking
   */
  stop(): void {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
  }
}

// Create a singleton instance
export const speechService = new SpeechService();
