
import React from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Send, Loader2, Book } from 'lucide-react';
import TutorMessage from './TutorMessage';
import { ProcessingIndicator } from './components/ProcessingIndicator';
import { useTutorChat } from './hooks/useTutorChat';

const TutorChat = () => {
  const {
    messages,
    input,
    isLoading,
    processingProgress,
    setInput,
    handleSend
  } = useTutorChat();

  return (
    <Card className="h-[700px] flex flex-col">
      <CardHeader className="border-b">
        <CardTitle className="flex items-center">
          <Book className="h-5 w-5 mr-2" />
          <span>AI Tutor Chat</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-grow overflow-y-auto p-4">
        <div className="space-y-4">
          {messages.map((message) => (
            <TutorMessage key={message.id} message={message} />
          ))}
          
          {isLoading && <ProcessingIndicator progress={processingProgress} />}
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
