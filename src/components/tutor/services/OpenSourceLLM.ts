
import { pipeline } from '@huggingface/transformers';

class OpenSourceLLMService {
  private textGeneration: any = null;
  private apiKey: string | null = null;
  private model = 'HuggingFaceH4/zephyr-7b-beta';
  private isInitializing = false;

  async initialize(): Promise<void> {
    if (this.textGeneration || this.isInitializing) return;
    
    try {
      this.isInitializing = true;
      console.log('Initializing LLM pipeline...');
      
      // Create the pipeline with correct options
      this.textGeneration = await pipeline(
        'text-generation',
        this.model,
        { 
          revision: 'main',
          quantized: false // Remove the 'task' property that doesn't exist
        }
      );
      
      console.log('LLM pipeline initialized successfully');
    } catch (error) {
      console.error('Failed to initialize LLM:', error);
      throw error;
    } finally {
      this.isInitializing = false;
    }
  }

  setApiKey(key: string): void {
    this.apiKey = key;
  }

  setModel(model: string): void {
    this.model = model;
    // Re-initialize pipeline with new model
    this.textGeneration = null;
    this.initialize().catch(err => console.error('Error reinitializing with new model:', err));
  }

  async generateText(prompt: string): Promise<string> {
    if (!this.textGeneration) {
      await this.initialize();
    }

    if (!this.textGeneration) {
      throw new Error('Failed to initialize text generation pipeline');
    }

    try {
      const result = await this.textGeneration(prompt, {
        max_length: 1000,
        temperature: 0.7,
        top_p: 0.95,
        repetition_penalty: 1.1,
        do_sample: true
      });

      // Handle the result correctly based on its structure
      if (Array.isArray(result)) {
        return result[0]?.generated_text || prompt;
      } else {
        return result.generated_text || prompt;
      }
    } catch (error) {
      console.error('Error generating text:', error);
      throw error;
    }
  }
}

export const openSourceLLM = new OpenSourceLLMService();
