
/**
 * Service to interact with open-source language models via Hugging Face Inference API
 */
export class OpenSourceLLMService {
  private apiUrl = 'https://api-inference.huggingface.co/models';
  private model = 'HuggingFaceH4/zephyr-7b-beta';  // A capable open source LLM
  private apiKey: string | null = null;
  
  /**
   * Set the API key for Hugging Face
   */
  setApiKey(apiKey: string): void {
    this.apiKey = apiKey;
  }
  
  /**
   * Change the model being used
   */
  setModel(model: string): void {
    this.model = model;
  }
  
  /**
   * Generate text using the selected model
   */
  async generateText(prompt: string): Promise<string> {
    if (!prompt.trim()) {
      return '';
    }
    
    try {
      const headers: HeadersInit = {
        'Content-Type': 'application/json',
      };
      
      if (this.apiKey) {
        headers['Authorization'] = `Bearer ${this.apiKey}`;
      }
      
      const response = await fetch(`${this.apiUrl}/${this.model}`, {
        method: 'POST',
        headers,
        body: JSON.stringify({
          inputs: prompt,
          parameters: {
            max_new_tokens: 512,
            temperature: 0.7,
            top_p: 0.9,
            do_sample: true
          }
        })
      });
      
      if (!response.ok) {
        const error = await response.json();
        console.error('Error generating text:', error);
        return `Error: ${response.statusText}`;
      }
      
      const result = await response.json();
      
      // For text generation models that return an array of generation objects
      if (Array.isArray(result) && result[0]?.generated_text) {
        return result[0].generated_text;
      }
      
      // For models that return direct text
      if (typeof result === 'string') {
        return result;
      }
      
      // For other response formats
      return JSON.stringify(result);
      
    } catch (error) {
      console.error('Error with language model:', error);
      return 'Sorry, I encountered an error processing your request.';
    }
  }
}

// Create a singleton instance
export const openSourceLLM = new OpenSourceLLMService();
