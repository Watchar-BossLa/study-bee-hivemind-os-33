
import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { LiveSession } from '@/types/livesessions';
import { useLiveSessions } from '@/hooks/useLiveSessions';

const formSchema = z.object({
  sessionCode: z.string().min(5, { message: "Session code must be at least 5 characters" }),
  accessCode: z.string().optional(),
});

interface JoinSessionFormProps {
  onJoin: (session: LiveSession) => void;
}

const JoinSessionForm: React.FC<JoinSessionFormProps> = ({ onJoin }) => {
  const { getSessionById } = useLiveSessions();
  const [error, setError] = React.useState<string | null>(null);
  const [isPrivate, setIsPrivate] = React.useState(false);
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      sessionCode: "",
      accessCode: "",
    },
  });
  
  const handleCheckSession = (sessionCode: string) => {
    if (sessionCode.length >= 5) {
      const session = getSessionById(sessionCode);
      if (session) {
        setIsPrivate(session.isPrivate);
        setError(null);
      } else {
        setIsPrivate(false);
        setError("Session not found");
      }
    }
  };
  
  const handleFormSubmit = (values: z.infer<typeof formSchema>) => {
    const session = getSessionById(values.sessionCode);
    if (!session) {
      setError("Session not found");
      return;
    }
    
    if (session.isPrivate && session.accessCode !== values.accessCode) {
      setError("Invalid access code");
      return;
    }
    
    // Check if session is full
    if (session.participants.length >= session.maxParticipants) {
      setError("Session is full");
      return;
    }
    
    onJoin(session);
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Join Session</CardTitle>
        <CardDescription>
          Enter a session code to join an existing study session
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="sessionCode"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Session Code</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="Enter session code" 
                      {...field}
                      onChange={(e) => {
                        field.onChange(e);
                        handleCheckSession(e.target.value);
                      }}
                    />
                  </FormControl>
                  {error && <p className="text-sm text-red-500 mt-1">{error}</p>}
                  <FormMessage />
                </FormItem>
              )}
            />
            
            {isPrivate && (
              <FormField
                control={form.control}
                name="accessCode"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Access Code</FormLabel>
                    <FormControl>
                      <Input 
                        type="password"
                        placeholder="Enter the access code" 
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
            
            <Button type="submit" className="w-full">Join Session</Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default JoinSessionForm;
