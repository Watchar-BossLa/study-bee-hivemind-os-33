
export const availableModels = {
  textGeneration: [
    {
      id: 'zephyr-7b-beta',
      name: 'Zephyr 7B Beta',
      model: 'HuggingFaceH4/zephyr-7b-beta',
      description: 'High-performance 7B parameter model optimized for chat and instruction following'
    },
    {
      id: 'mistral-7b',
      name: 'Mistral 7B',
      model: 'mistralai/Mistral-7B-v0.1',
      description: 'Efficient 7B parameter model with strong performance across tasks'
    }
  ],
  speechSynthesis: [
    {
      id: 'speecht5',
      name: 'Microsoft SpeechT5',
      model: 'microsoft/speecht5_tts',
      description: 'High-quality text-to-speech model optimized for real-time synthesis'
    }
  ]
};
