
import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { LiveSession } from '@/types/livesessions';
import { v4 as uuidv4 } from '@/lib/uuid';

const formSchema = z.object({
  title: z.string().min(3, { message: "Title must be at least 3 characters" }),
  description: z.string().optional(),
  subject: z.string().min(1, { message: "Please select a subject" }),
  maxParticipants: z.number().min(2).max(20),
  startTime: z.string().min(1, { message: "Please set a start time" }),
  isPrivate: z.boolean().default(false),
  accessCode: z.string().optional(),
  video: z.boolean().default(true),
  audio: z.boolean().default(true),
  chat: z.boolean().default(true),
  whiteboard: z.boolean().default(true),
  screenSharing: z.boolean().default(true),
});

interface CreateSessionFormProps {
  onSessionCreated: (session: LiveSession) => void;
}

const CreateSessionForm: React.FC<CreateSessionFormProps> = ({ onSessionCreated }) => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      description: "",
      subject: "",
      maxParticipants: 5,
      startTime: new Date().toISOString().slice(0, 16),
      isPrivate: false,
      accessCode: "",
      video: true,
      audio: true,
      chat: true,
      whiteboard: true,
      screenSharing: true,
    },
  });
  
  const handleFormSubmit = (values: z.infer<typeof formSchema>) => {
    // In a real app, we would make an API call to create the session
    const newSession: LiveSession = {
      id: uuidv4(),
      title: values.title,
      description: values.description,
      subject: values.subject,
      host: {
        id: "current-user-id",
        name: "Current User",
      },
      participants: [
        {
          id: "current-user-id",
          name: "Current User",
        }
      ],
      maxParticipants: values.maxParticipants,
      startTime: values.startTime,
      status: 'active',
      isPrivate: values.isPrivate,
      accessCode: values.isPrivate ? values.accessCode : undefined,
      features: {
        video: values.video,
        audio: values.audio,
        chat: values.chat,
        whiteboard: values.whiteboard,
        screenSharing: values.screenSharing,
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    
    onSessionCreated(newSession);
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Create Study Session</CardTitle>
        <CardDescription>
          Set up a new live study session and invite your peers to join.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Session Title</FormLabel>
                  <FormControl>
                    <Input placeholder="Biology Final Exam Review" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description (optional)</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Details about what will be covered" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="subject"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Subject</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a subject" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="biology">Biology</SelectItem>
                        <SelectItem value="mathematics">Mathematics</SelectItem>
                        <SelectItem value="physics">Physics</SelectItem>
                        <SelectItem value="chemistry">Chemistry</SelectItem>
                        <SelectItem value="history">History</SelectItem>
                        <SelectItem value="literature">Literature</SelectItem>
                        <SelectItem value="computer-science">Computer Science</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="maxParticipants"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Max Participants</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        min={2} 
                        max={20} 
                        {...field} 
                        onChange={(e) => field.onChange(parseInt(e.target.value))}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <FormField
              control={form.control}
              name="startTime"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Start Time</FormLabel>
                  <FormControl>
                    <Input type="datetime-local" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div className="grid gap-4">
              <FormField
                control={form.control}
                name="isPrivate"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                    <FormControl>
                      <Checkbox 
                        checked={field.value} 
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>Make private</FormLabel>
                      <p className="text-sm text-muted-foreground">
                        Only people with an access code can join
                      </p>
                    </div>
                  </FormItem>
                )}
              />
              
              {form.watch("isPrivate") && (
                <FormField
                  control={form.control}
                  name="accessCode"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Access Code</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter access code" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}
            </div>
            
            <div>
              <h3 className="text-sm font-medium mb-3">Session Features</h3>
              <div className="grid gap-2">
                <FormField
                  control={form.control}
                  name="video"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center space-x-3 space-y-0">
                      <FormControl>
                        <Checkbox 
                          checked={field.value} 
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <FormLabel>Video</FormLabel>
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="audio"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center space-x-3 space-y-0">
                      <FormControl>
                        <Checkbox 
                          checked={field.value} 
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <FormLabel>Audio</FormLabel>
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="chat"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center space-x-3 space-y-0">
                      <FormControl>
                        <Checkbox 
                          checked={field.value} 
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <FormLabel>Chat</FormLabel>
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="whiteboard"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center space-x-3 space-y-0">
                      <FormControl>
                        <Checkbox 
                          checked={field.value} 
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <FormLabel>Whiteboard</FormLabel>
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="screenSharing"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center space-x-3 space-y-0">
                      <FormControl>
                        <Checkbox 
                          checked={field.value} 
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <FormLabel>Screen Sharing</FormLabel>
                    </FormItem>
                  )}
                />
              </div>
            </div>
            
            <Button type="submit" className="w-full">Create Session</Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default CreateSessionForm;
