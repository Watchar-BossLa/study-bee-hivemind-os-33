
import React, { useRef, useEffect } from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Send, Loader2, Book, Volume2, VolumeX } from 'lucide-react';
import TutorMessage from './components/TutorMessage';
import { ProcessingIndicator } from './components/ProcessingIndicator';
import { useTutorChat } from './hooks/useTutorChat';
import { useSpeech } from './hooks/useSpeech';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';

const TutorChat = () => {
  const {
    messages,
    input,
    isLoading,
    processingProgress,
    setInput,
    handleSend
  } = useTutorChat();
  
  const { speak, stop, isSpeaking, isEnabled, toggleSpeech } = useSpeech();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  // Auto-scroll to the bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);
  
  // Speak the latest assistant message when it arrives
  useEffect(() => {
    const lastMessage = messages[messages.length - 1];
    if (isEnabled && lastMessage && lastMessage.role === 'assistant' && !lastMessage.loading) {
      speak(lastMessage.content);
    }
  }, [messages, isEnabled, speak]);

  return (
    <Card className="h-[700px] flex flex-col">
      <CardHeader className="border-b">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center">
            <Book className="h-5 w-5 mr-2" />
            <span>AI Tutor Chat</span>
          </CardTitle>
          <div className="flex items-center space-x-2">
            <Label htmlFor="voice-mode" className="text-sm mr-2">Voice</Label>
            <Switch
              id="voice-mode"
              checked={isEnabled}
              onCheckedChange={toggleSpeech}
            />
            <Button
              variant="ghost"
              size="icon"
              className={cn("ml-2", {
                "text-primary": isSpeaking,
                "text-muted-foreground": !isSpeaking
              })}
              onClick={isSpeaking ? stop : () => {
                if (messages.length > 0) {
                  const lastAssistantMessage = [...messages].reverse().find(m => m.role === 'assistant');
                  if (lastAssistantMessage) {
                    speak(lastAssistantMessage.content);
                  }
                }
              }}
              disabled={!isEnabled || (messages.length === 0)}
            >
              {isSpeaking ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="flex-grow overflow-y-auto p-4">
        <div className="space-y-4">
          {messages.map((message) => (
            <TutorMessage key={message.id} message={message} />
          ))}
          
          {isLoading && <ProcessingIndicator progress={processingProgress} />}
          <div ref={messagesEndRef} />
        </div>
      </CardContent>
      <CardFooter className="border-t p-4">
        <form 
          className="flex w-full items-center space-x-2" 
          onSubmit={(e) => { 
            e.preventDefault();
            handleSend();
          }}
        >
          <Textarea 
            placeholder="Ask a question..." 
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="flex-1 resize-none"
            disabled={isLoading}
            rows={1}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSend();
              }
            }}
          />
          <Button 
            type="submit"
            size="icon" 
            disabled={isLoading || !input.trim()}
          >
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Send className="h-4 w-4" />
            )}
            <span className="sr-only">Send</span>
          </Button>
        </form>
      </CardFooter>
    </Card>
  );
};

export default TutorChat;
