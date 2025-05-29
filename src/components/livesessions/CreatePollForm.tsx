
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { X, Plus, Trash2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { LiveSession } from '@/types/livesessions';

interface CreatePollFormProps {
  session: LiveSession;
  onClose: () => void;
  onPollCreated: () => void;
}

const CreatePollForm: React.FC<CreatePollFormProps> = ({ 
  session, 
  onClose, 
  onPollCreated 
}) => {
  const [question, setQuestion] = useState('');
  const [options, setOptions] = useState(['', '']);
  const [allowMultiple, setAllowMultiple] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const { toast } = useToast();

  const addOption = () => {
    if (options.length < 6) {
      setOptions([...options, '']);
    }
  };

  const removeOption = (index: number) => {
    if (options.length > 2) {
      setOptions(options.filter((_, i) => i !== index));
    }
  };

  const updateOption = (index: number, value: string) => {
    const newOptions = [...options];
    newOptions[index] = value;
    setOptions(newOptions);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!question.trim()) {
      toast({
        title: 'Question required',
        description: 'Please enter a poll question',
        variant: 'destructive'
      });
      return;
    }

    const validOptions = options.filter(opt => opt.trim());
    if (validOptions.length < 2) {
      toast({
        title: 'More options needed',
        description: 'Please provide at least 2 options',
        variant: 'destructive'
      });
      return;
    }

    setIsCreating(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        toast({
          title: 'Authentication required',
          description: 'You need to be logged in to create polls',
          variant: 'destructive'
        });
        return;
      }

      // First, end any existing active polls
      await supabase
        .from('session_polls')
        .update({ is_active: false, ended_at: new Date().toISOString() })
        .eq('session_id', session.id)
        .eq('is_active', true);

      // Create the new poll
      const pollOptions = validOptions.map((text, index) => ({
        id: index.toString(),
        text,
        votes: 0
      }));

      const { error } = await supabase
        .from('session_polls')
        .insert({
          session_id: session.id,
          creator_id: user.id,
          question: question.trim(),
          options: pollOptions,
          allow_multiple_choices: allowMultiple,
          is_active: true
        });

      if (error) throw error;

      toast({
        title: 'Poll created',
        description: 'Your poll is now live',
      });

      onPollCreated();
    } catch (error) {
      console.error('Error creating poll:', error);
      toast({
        title: 'Error',
        description: 'Failed to create poll',
        variant: 'destructive'
      });
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          Create Poll
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </CardTitle>
      </CardHeader>
      
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="question">Poll Question</Label>
            <Input
              id="question"
              placeholder="What would you like to ask?"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              required
            />
          </div>

          <div>
            <Label>Options</Label>
            <div className="space-y-2 mt-2">
              {options.map((option, index) => (
                <div key={index} className="flex gap-2">
                  <Input
                    placeholder={`Option ${index + 1}`}
                    value={option}
                    onChange={(e) => updateOption(index, e.target.value)}
                  />
                  {options.length > 2 && (
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      onClick={() => removeOption(index)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              ))}
              
              {options.length < 6 && (
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={addOption}
                  className="w-full"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Option
                </Button>
              )}
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="multiple"
              checked={allowMultiple}
              onCheckedChange={(checked) => setAllowMultiple(checked as boolean)}
            />
            <Label htmlFor="multiple">Allow multiple selections</Label>
          </div>

          <div className="flex gap-2 pt-4">
            <Button type="submit" disabled={isCreating} className="flex-1">
              {isCreating ? 'Creating...' : 'Create Poll'}
            </Button>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default CreatePollForm;
