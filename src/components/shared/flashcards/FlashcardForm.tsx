
import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';

const flashcardSchema = z.object({
  question: z.string().min(1, 'Question is required').max(1000, 'Question is too long'),
  answer: z.string().min(1, 'Answer is required').max(2000, 'Answer is too long'),
  subject_area: z.string().min(1, 'Subject area is required'),
  difficulty: z.string().min(1, 'Difficulty is required'),
});

type FlashcardFormData = z.infer<typeof flashcardSchema>;

interface FlashcardFormProps {
  onSubmit: (data: FlashcardFormData) => void;
  initialData?: Partial<FlashcardFormData>;
  isEditing?: boolean;
}

const subjectOptions = [
  { value: 'mathematics', label: 'Mathematics' },
  { value: 'science', label: 'Science' },
  { value: 'history', label: 'History' },
  { value: 'literature', label: 'Literature' },
  { value: 'language', label: 'Language' },
  { value: 'geography', label: 'Geography' },
  { value: 'biology', label: 'Biology' },
  { value: 'chemistry', label: 'Chemistry' },
  { value: 'physics', label: 'Physics' },
  { value: 'computer_science', label: 'Computer Science' },
  { value: 'economics', label: 'Economics' },
  { value: 'philosophy', label: 'Philosophy' },
  { value: 'psychology', label: 'Psychology' },
  { value: 'art', label: 'Art' },
  { value: 'music', label: 'Music' },
  { value: 'general', label: 'General Knowledge' },
];

const difficultyOptions = [
  { value: 'beginner', label: 'Beginner' },
  { value: 'intermediate', label: 'Intermediate' },
  { value: 'advanced', label: 'Advanced' },
];

const FlashcardForm: React.FC<FlashcardFormProps> = ({
  onSubmit,
  initialData,
  isEditing = false
}) => {
  const form = useForm<FlashcardFormData>({
    resolver: zodResolver(flashcardSchema),
    defaultValues: {
      question: initialData?.question || '',
      answer: initialData?.answer || '',
      subject_area: initialData?.subject_area || '',
      difficulty: initialData?.difficulty || '',
    },
  });

  const handleSubmit = (data: FlashcardFormData) => {
    onSubmit(data);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="question"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Question</FormLabel>
              <FormControl>
                <Textarea
                  {...field}
                  placeholder="Enter your question here..."
                  className="min-h-[100px] resize-none"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="answer"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Answer</FormLabel>
              <FormControl>
                <Textarea
                  {...field}
                  placeholder="Enter the answer here..."
                  className="min-h-[100px] resize-none"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="subject_area"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Subject Area</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a subject area" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {subjectOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="difficulty"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Difficulty</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select difficulty level" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {difficultyOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="flex gap-4 pt-4">
          <Button type="submit" className="flex-1">
            {isEditing ? 'Update Flashcard' : 'Create Flashcard'}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default FlashcardForm;
