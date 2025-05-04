
import React, { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { QuizQuestion } from '@/types/arena';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { PlusCircle, Edit, Trash, Save } from 'lucide-react';
import { v4 as uuidv4 } from '@/lib/uuid';

const ArenaAdmin = () => {
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('list');
  const [editingQuestion, setEditingQuestion] = useState<QuizQuestion | null>(null);
  const { toast } = useToast();
  
  // Form state
  const [formQuestion, setFormQuestion] = useState('');
  const [formOptionA, setFormOptionA] = useState('');
  const [formOptionB, setFormOptionB] = useState('');
  const [formOptionC, setFormOptionC] = useState('');
  const [formOptionD, setFormOptionD] = useState('');
  const [formCorrectAnswer, setFormCorrectAnswer] = useState<string>('a');
  const [formDifficulty, setFormDifficulty] = useState<'easy' | 'medium' | 'hard'>('medium');
  const [formCategory, setFormCategory] = useState('General');

  useEffect(() => {
    loadQuestions();
  }, []);

  // Reset form when editing question changes
  useEffect(() => {
    if (editingQuestion) {
      setFormQuestion(editingQuestion.question);
      setFormOptionA(editingQuestion.option_a);
      setFormOptionB(editingQuestion.option_b);
      setFormOptionC(editingQuestion.option_c);
      setFormOptionD(editingQuestion.option_d);
      setFormCorrectAnswer(editingQuestion.correct_answer);
      setFormDifficulty(editingQuestion.difficulty);
      setFormCategory(editingQuestion.category);
    } else {
      resetForm();
    }
  }, [editingQuestion]);

  const resetForm = () => {
    setFormQuestion('');
    setFormOptionA('');
    setFormOptionB('');
    setFormOptionC('');
    setFormOptionD('');
    setFormCorrectAnswer('a');
    setFormDifficulty('medium');
    setFormCategory('General');
  };

  const loadQuestions = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase.from('quiz_questions').select('*');
      
      if (error) throw error;
      
      if (data) {
        setQuestions(data as QuizQuestion[]);
      }
    } catch (error) {
      console.error('Error loading questions:', error);
      toast({
        title: "Failed to load questions",
        description: "There was an error loading the questions. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCreateQuestion = async () => {
    try {
      const newQuestion: QuizQuestion = {
        id: uuidv4(),
        question: formQuestion,
        option_a: formOptionA,
        option_b: formOptionB,
        option_c: formOptionC,
        option_d: formOptionD,
        correct_answer: formCorrectAnswer,
        difficulty: formDifficulty,
        category: formCategory
      };
      
      const { error } = await supabase.from('quiz_questions').insert(newQuestion);
      
      if (error) throw error;
      
      await loadQuestions();
      resetForm();
      
      toast({
        title: "Question created",
        description: "The question has been added to the database.",
      });
      
      setActiveTab('list');
    } catch (error) {
      console.error('Error creating question:', error);
      toast({
        title: "Failed to create question",
        description: "There was an error creating the question. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleUpdateQuestion = async () => {
    if (!editingQuestion) return;
    
    try {
      const updatedQuestion: QuizQuestion = {
        id: editingQuestion.id,
        question: formQuestion,
        option_a: formOptionA,
        option_b: formOptionB,
        option_c: formOptionC,
        option_d: formOptionD,
        correct_answer: formCorrectAnswer,
        difficulty: formDifficulty,
        category: formCategory
      };
      
      const { error } = await supabase
        .from('quiz_questions')
        .update(updatedQuestion)
        .eq('id', editingQuestion.id);
      
      if (error) throw error;
      
      await loadQuestions();
      setEditingQuestion(null);
      
      toast({
        title: "Question updated",
        description: "The question has been updated successfully.",
      });
      
      setActiveTab('list');
    } catch (error) {
      console.error('Error updating question:', error);
      toast({
        title: "Failed to update question",
        description: "There was an error updating the question. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleDeleteQuestion = async (id: string) => {
    if (!confirm("Are you sure you want to delete this question? This action cannot be undone.")) {
      return;
    }
    
    try {
      const { error } = await supabase.from('quiz_questions').delete().eq('id', id);
      
      if (error) throw error;
      
      await loadQuestions();
      
      toast({
        title: "Question deleted",
        description: "The question has been removed from the database.",
      });
    } catch (error) {
      console.error('Error deleting question:', error);
      toast({
        title: "Failed to delete question",
        description: "There was an error deleting the question. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleEdit = (question: QuizQuestion) => {
    setEditingQuestion(question);
    setActiveTab('edit');
  };

  const handleCancel = () => {
    setEditingQuestion(null);
    setActiveTab('list');
  };

  const renderQuestionForm = () => {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle>{editingQuestion ? 'Edit Question' : 'Add New Question'}</CardTitle>
          <CardDescription>
            {editingQuestion 
              ? 'Update the question details below.' 
              : 'Fill out the form to add a new question to the database.'}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="question" className="text-sm font-medium">Question</label>
            <Input 
              id="question"
              value={formQuestion}
              onChange={e => setFormQuestion(e.target.value)}
              placeholder="Enter the question text"
              required
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label htmlFor="optionA" className="text-sm font-medium">Option A</label>
              <Input 
                id="optionA"
                value={formOptionA}
                onChange={e => setFormOptionA(e.target.value)}
                placeholder="Option A"
                required
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="optionB" className="text-sm font-medium">Option B</label>
              <Input 
                id="optionB"
                value={formOptionB}
                onChange={e => setFormOptionB(e.target.value)}
                placeholder="Option B"
                required
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="optionC" className="text-sm font-medium">Option C</label>
              <Input 
                id="optionC"
                value={formOptionC}
                onChange={e => setFormOptionC(e.target.value)}
                placeholder="Option C"
                required
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="optionD" className="text-sm font-medium">Option D</label>
              <Input 
                id="optionD"
                value={formOptionD}
                onChange={e => setFormOptionD(e.target.value)}
                placeholder="Option D"
                required
              />
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <label htmlFor="correctAnswer" className="text-sm font-medium">Correct Answer</label>
              <Select 
                value={formCorrectAnswer}
                onValueChange={value => setFormCorrectAnswer(value as 'a' | 'b' | 'c' | 'd')}
              >
                <SelectTrigger id="correctAnswer">
                  <SelectValue placeholder="Select correct answer" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="a">Option A</SelectItem>
                  <SelectItem value="b">Option B</SelectItem>
                  <SelectItem value="c">Option C</SelectItem>
                  <SelectItem value="d">Option D</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <label htmlFor="difficulty" className="text-sm font-medium">Difficulty</label>
              <Select 
                value={formDifficulty}
                onValueChange={value => setFormDifficulty(value as 'easy' | 'medium' | 'hard')}
              >
                <SelectTrigger id="difficulty">
                  <SelectValue placeholder="Select difficulty" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="easy">Easy</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="hard">Hard</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <label htmlFor="category" className="text-sm font-medium">Category</label>
              <Input 
                id="category"
                value={formCategory}
                onChange={e => setFormCategory(e.target.value)}
                placeholder="Category"
                required
              />
            </div>
          </div>
        </CardContent>
        
        <CardFooter className="flex justify-between">
          <Button variant="outline" onClick={handleCancel}>
            Cancel
          </Button>
          <Button onClick={editingQuestion ? handleUpdateQuestion : handleCreateQuestion}>
            <Save className="mr-2 h-4 w-4" />
            {editingQuestion ? 'Update' : 'Save'}
          </Button>
        </CardFooter>
      </Card>
    );
  };

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">Quiz Questions Admin</h1>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="list">Question List</TabsTrigger>
          <TabsTrigger value="edit">{editingQuestion ? 'Edit Question' : 'Add Question'}</TabsTrigger>
        </TabsList>
        
        <TabsContent value="list">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Quiz Questions</CardTitle>
                <CardDescription>Manage questions for the arena quiz battles</CardDescription>
              </div>
              <Button onClick={() => setActiveTab('edit')}>
                <PlusCircle className="mr-2 h-4 w-4" />
                Add Question
              </Button>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="flex justify-center p-4">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                </div>
              ) : questions.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-muted-foreground">No questions found.</p>
                  <Button 
                    variant="outline" 
                    onClick={() => setActiveTab('edit')}
                    className="mt-2"
                  >
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Add Your First Question
                  </Button>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Question</TableHead>
                        <TableHead>Category</TableHead>
                        <TableHead>Difficulty</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {questions.map(question => (
                        <TableRow key={question.id}>
                          <TableCell className="font-medium max-w-sm truncate">
                            {question.question}
                          </TableCell>
                          <TableCell>{question.category}</TableCell>
                          <TableCell>
                            <span className={
                              question.difficulty === 'easy' ? 'text-green-500' :
                              question.difficulty === 'medium' ? 'text-yellow-500' :
                              'text-red-500'
                            }>
                              {question.difficulty.charAt(0).toUpperCase() + question.difficulty.slice(1)}
                            </span>
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-2">
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => handleEdit(question)}
                              >
                                <Edit className="h-4 w-4" />
                                <span className="sr-only">Edit</span>
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => handleDeleteQuestion(question.id)}
                              >
                                <Trash className="h-4 w-4" />
                                <span className="sr-only">Delete</span>
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="edit">
          {renderQuestionForm()}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ArenaAdmin;
