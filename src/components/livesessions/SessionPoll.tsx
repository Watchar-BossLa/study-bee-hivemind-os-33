
import React, { useState } from 'react';
import { useSessionPolls } from '@/hooks/useSessionPolls';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { Loader2, ListChecks, BarChart3, Timer } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import CreatePollForm from './CreatePollForm';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { SessionPoll as SessionPollType } from '@/types/livesessions';

interface SessionPollsProps {
  sessionId: string;
  isHost: boolean;
}

const SessionPoll: React.FC<SessionPollsProps> = ({ sessionId, isHost }) => {
  const [activeTab, setActiveTab] = useState<string>('active');
  const [showCreateForm, setShowCreateForm] = useState<boolean>(false);
  const {
    polls,
    activePoll,
    isLoading,
    isSubmitting,
    error,
    createPoll,
    endPoll,
    submitPollResponse,
    calculatePollResults
  } = useSessionPolls(sessionId);

  const [selectedOptions, setSelectedOptions] = useState<number[]>([]);

  const handleSubmitResponse = async (pollId: string) => {
    if (selectedOptions.length === 0) return;
    const success = await submitPollResponse(pollId, selectedOptions);
    if (success) {
      setSelectedOptions([]);
    }
  };

  const handleOptionChange = (optionIndex: number, checked: boolean, allowMultiple: boolean) => {
    if (allowMultiple) {
      setSelectedOptions(prev => 
        checked 
          ? [...prev, optionIndex]
          : prev.filter(index => index !== optionIndex)
      );
    } else {
      setSelectedOptions(checked ? [optionIndex] : []);
    }
  };

  const handleCreatePoll = async (pollData: Omit<SessionPollType, 'id' | 'sessionId' | 'creatorId' | 'createdAt' | 'endedAt'>) => {
    await createPoll(pollData);
    setShowCreateForm(false);
  };

  // Check if a user has already responded to a poll
  const hasResponded = (pollId: string): boolean => {
    const results = calculatePollResults(pollId);
    return results ? results.respondents.some(r => r.id === 'currentUser') : false; // Replace with actual user ID check
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        <p className="mt-4 text-muted-foreground">Loading polls...</p>
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>Failed to load polls. Please try again later.</AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-6">
      {isHost && !showCreateForm && (
        <div className="flex justify-end">
          <Button onClick={() => setShowCreateForm(true)}>Create New Poll</Button>
        </div>
      )}

      {showCreateForm && (
        <Card>
          <CardHeader>
            <CardTitle>Create a Poll</CardTitle>
            <CardDescription>Ask a question to all session participants</CardDescription>
          </CardHeader>
          <CardContent>
            <CreatePollForm onSubmit={handleCreatePoll} onCancel={() => setShowCreateForm(false)} />
          </CardContent>
        </Card>
      )}

      {polls.length > 0 ? (
        <>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="active">
                <Timer className="mr-2 h-4 w-4" />
                Active Polls
              </TabsTrigger>
              <TabsTrigger value="past">
                <ListChecks className="mr-2 h-4 w-4" />
                Past Polls
              </TabsTrigger>
              <TabsTrigger value="results">
                <BarChart3 className="mr-2 h-4 w-4" />
                Results
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="active" className="space-y-4 mt-4">
              {polls.filter(poll => poll.isActive).length > 0 ? (
                polls.filter(poll => poll.isActive).map(poll => (
                  <Card key={poll.id}>
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <CardTitle className="text-lg">{poll.question}</CardTitle>
                        <Badge variant={poll.allowMultipleChoices ? "secondary" : "outline"}>
                          {poll.allowMultipleChoices ? "Multiple choice" : "Single choice"}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      {poll.allowMultipleChoices ? (
                        <div className="space-y-3">
                          {poll.options.map((option, index) => (
                            <div key={index} className="flex items-center space-x-2">
                              <Checkbox 
                                id={`option-${poll.id}-${index}`} 
                                checked={selectedOptions.includes(index)}
                                onCheckedChange={(checked) => 
                                  handleOptionChange(index, checked === true, poll.allowMultipleChoices)
                                }
                                disabled={hasResponded(poll.id) || isSubmitting}
                              />
                              <Label htmlFor={`option-${poll.id}-${index}`} className="text-base">
                                {option.text}
                              </Label>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <RadioGroup 
                          value={selectedOptions[0]?.toString()} 
                          onValueChange={(value) => setSelectedOptions([parseInt(value)])}
                          disabled={hasResponded(poll.id) || isSubmitting}
                        >
                          {poll.options.map((option, index) => (
                            <div key={index} className="flex items-center space-x-2 py-2">
                              <RadioGroupItem value={index.toString()} id={`option-${poll.id}-${index}`} />
                              <Label htmlFor={`option-${poll.id}-${index}`} className="text-base">
                                {option.text}
                              </Label>
                            </div>
                          ))}
                        </RadioGroup>
                      )}
                    </CardContent>
                    <CardFooter className="flex justify-between">
                      <div>
                        {hasResponded(poll.id) ? (
                          <Badge variant="secondary">You responded</Badge>
                        ) : (
                          <Button 
                            onClick={() => handleSubmitResponse(poll.id)} 
                            disabled={selectedOptions.length === 0 || isSubmitting}
                          >
                            {isSubmitting ? (
                              <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Submitting...
                              </>
                            ) : (
                              'Submit Response'
                            )}
                          </Button>
                        )}
                      </div>
                      {isHost && (
                        <Button 
                          variant="outline" 
                          onClick={() => endPoll(poll.id)}
                          disabled={isSubmitting}
                        >
                          End Poll
                        </Button>
                      )}
                    </CardFooter>
                  </Card>
                ))
              ) : (
                <div className="text-center p-6 text-muted-foreground">
                  <ListChecks className="h-10 w-10 mx-auto mb-2" />
                  <p>No active polls at the moment.</p>
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="past" className="space-y-4 mt-4">
              {polls.filter(poll => !poll.isActive).length > 0 ? (
                polls.filter(poll => !poll.isActive).map(poll => (
                  <Card key={poll.id} className="opacity-80">
                    <CardHeader>
                      <CardTitle className="text-lg">{poll.question}</CardTitle>
                      <CardDescription>
                        Ended: {new Date(poll.endedAt || poll.createdAt).toLocaleString()}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        {poll.options.map((option, index) => (
                          <div key={index}>
                            <Label className="text-base">{option.text}</Label>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                ))
              ) : (
                <div className="text-center p-6 text-muted-foreground">
                  <ListChecks className="h-10 w-10 mx-auto mb-2" />
                  <p>No past polls to display.</p>
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="results" className="space-y-6 mt-4">
              {polls.length > 0 ? (
                polls.map(poll => {
                  const results = calculatePollResults(poll.id);
                  if (!results) return null;
                  
                  return (
                    <Card key={poll.id}>
                      <CardHeader>
                        <div className="flex justify-between items-start">
                          <div>
                            <CardTitle className="text-lg">{poll.question}</CardTitle>
                            <CardDescription>
                              {poll.isActive ? 'Active' : 'Ended'} • {results.totalResponses} responses
                            </CardDescription>
                          </div>
                          {poll.isActive && (
                            <Badge variant="outline" className="bg-green-50 text-green-700 dark:bg-green-900 dark:text-green-300">
                              Live
                            </Badge>
                          )}
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          {poll.options.map((option, index) => {
                            const count = results.optionCounts[index] || 0;
                            const percentage = results.totalResponses > 0 
                              ? Math.round((count / results.totalResponses) * 100) 
                              : 0;
                            
                            return (
                              <div key={index} className="space-y-1">
                                <div className="flex justify-between text-sm">
                                  <span>{option.text}</span>
                                  <span className="font-medium">{count} ({percentage}%)</span>
                                </div>
                                <Progress value={percentage} className="h-2" />
                              </div>
                            );
                          })}
                        </div>
                      </CardContent>
                    </Card>
                  );
                })
              ) : (
                <div className="text-center p-6 text-muted-foreground">
                  <BarChart3 className="h-10 w-10 mx-auto mb-2" />
                  <p>No poll results to display.</p>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </>
      ) : (
        <div className="text-center p-10 bg-muted rounded-lg">
          <ListChecks className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
          <h3 className="text-lg font-medium mb-2">No polls yet</h3>
          <p className="text-muted-foreground mb-4">
            {isHost 
              ? "Create a poll to gather feedback from session participants." 
              : "The session host has not created any polls yet."}
          </p>
          {isHost && (
            <Button onClick={() => setShowCreateForm(true)}>Create First Poll</Button>
          )}
        </div>
      )}
    </div>
  );
};

export default SessionPoll;
