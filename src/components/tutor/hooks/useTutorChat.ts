
import { useState } from 'react';
import { MessageType } from '../types/chat';

const initialMessages: MessageType[] = [
  {
    id: '1',
    content: 'Hello! I\'m your AI tutor. I can help you understand various subjects using a knowledge graph to provide context-rich explanations. What would you like to learn about today?',
    role: 'assistant',
    timestamp: new Date(Date.now() - 60000),
    modelUsed: 'Llama-3',
  },
];

export const useTutorChat = () => {
  const [messages, setMessages] = useState<MessageType[]>(initialMessages);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [processingProgress, setProcessingProgress] = useState(0);

  const simulateProcessing = () => {
    setProcessingProgress(0);
    const steps = [
      "Analyzing query",
      "Retrieving knowledge graph nodes",
      "Selecting optimal LLM",
      "Generating response"
    ];
    
    let step = 0;
    const interval = setInterval(() => {
      if (step < steps.length) {
        const progress = Math.round(((step + 1) / steps.length) * 100);
        setProcessingProgress(progress);
        step++;
      } else {
        clearInterval(interval);
        completeResponse();
      }
    }, 800);
  };

  const completeResponse = () => {
    const responses = [
      {
        content: "The mitochondrion is a double membrane-bound organelle found in most eukaryotic cells. The term 'powerhouse of the cell' refers to its primary function of generating most of the cell's supply of ATP, used as a source of chemical energy. The mitochondrion has its own DNA which is separate from the cell's nuclear DNA, suggesting that mitochondria evolved from free-living bacteria that were engulfed by primitive eukaryotic cells.",
        model: "Llama-3",
        topics: ["Cell Biology", "Cellular Respiration", "Evolution"]
      },
      {
        content: "A binary search tree (BST) is a data structure that enables efficient search, insertion, and deletion operations. In a BST, the left subtree of a node contains only nodes with keys less than the node's key, and the right subtree contains only nodes with keys greater than the node's key. This property ensures that lookup, insert, and delete operations all take O(log n) time on average and O(n) time in the worst case.",
        model: "GPT-4o",
        topics: ["Data Structures", "Algorithms", "Computer Science"]
      },
      {
        content: "The Pythagorean theorem states that in a right triangle, the square of the length of the hypotenuse (the side opposite the right angle) equals the sum of the squares of the lengths of the other two sides. If we denote the length of the hypotenuse as c, and the lengths of the other two sides as a and b, then the theorem can be expressed as: a² + b² = c². This fundamental theorem has applications in architecture, engineering, and countless areas of mathematics.",
        model: "Mixtral",
        topics: ["Mathematics", "Geometry", "Trigonometry"]
      }
    ];
    
    const randomResponse = responses[Math.floor(Math.random() * responses.length)];
    
    setMessages(prevMessages => {
      const newMessages = [...prevMessages];
      const loadingMessageIndex = newMessages.findIndex(msg => msg.loading);
      
      if (loadingMessageIndex !== -1) {
        newMessages[loadingMessageIndex] = {
          id: newMessages[loadingMessageIndex].id,
          content: randomResponse.content,
          role: 'assistant',
          timestamp: new Date(),
          modelUsed: randomResponse.model,
          relatedTopics: randomResponse.topics,
          loading: false,
        };
      }
      
      return newMessages;
    });
    
    setIsLoading(false);
    setProcessingProgress(100);
  };

  const handleSend = () => {
    if (!input.trim()) return;
    
    const userMessage: MessageType = {
      id: Date.now().toString(),
      content: input.trim(),
      role: 'user',
      timestamp: new Date(),
    };
    
    const loadingMessage: MessageType = {
      id: (Date.now() + 1).toString(),
      content: '',
      role: 'assistant',
      timestamp: new Date(),
      loading: true,
    };
    
    setMessages([...messages, userMessage, loadingMessage]);
    setInput('');
    setIsLoading(true);
    simulateProcessing();
  };

  return {
    messages,
    input,
    isLoading,
    processingProgress,
    setInput,
    handleSend,
  };
};
