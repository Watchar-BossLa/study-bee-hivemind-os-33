
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Checkbox } from '@/components/ui/checkbox';
import FlashcardFilters from '@/components/flashcards/FlashcardFilters';
import { FlashcardFilter } from '@/components/shared/flashcards/types';
import { ArrowLeft, Edit, Trash2, Loader2, Plus } from 'lucide-react';

// Define the Flashcard interface to fix the type error
interface Flashcard {
  id: string;
  user_id: string;
  question: string;
  answer: string;
  subject_area?: string;
  difficulty?: string;
  is_preloaded?: boolean;
  created_at?: string;
  updated_at?: string;
}

interface FlashcardRow extends Flashcard {
  selected: boolean;
}

const FlashcardManagement = () => {
  const { toast } = useToast();
  const [filters, setFilters] = useState<FlashcardFilter>({
    subject: undefined,
    difficulty: undefined,
    showPreloaded: true
  });
  
  const [selectedCards, setSelectedCards] = useState<Record<string, boolean>>({});
  const [isDeleting, setIsDeleting] = useState(false);
  
  // Fetch flashcards from Supabase
  const { data: flashcards, isLoading, refetch } = useQuery({
    queryKey: ['flashcards-management', filters],
    queryFn: async () => {
      // Start with a base query that fetches either the user's cards or preloaded cards
      let query = supabase.from('flashcards').select('*');
      
      // Get current user
      const { data: { user } } = await supabase.auth.getUser();
      
      if (user) {
        // If authenticated, show user's cards and optionally preloaded cards
        if (filters.showPreloaded) {
          query = query.or(`user_id.eq.${user.id},is_preloaded.eq.true`);
        } else {
          query = query.eq('user_id', user.id);
        }
      } else {
        // If not authenticated, only show preloaded cards
        query = query.eq('is_preloaded', true);
      }
      
      // Apply subject filter if selected
      if (filters.subject) {
        query = query.eq('subject_area', filters.subject);
      }
      
      // Apply difficulty filter if selected
      if (filters.difficulty) {
        query = query.eq('difficulty', filters.difficulty);
      }
      
      const { data, error } = await query.order('created_at', { ascending: false });
      
      if (error) {
        console.error('Error fetching flashcards:', error);
        toast({
          title: 'Error',
          description: 'Failed to load flashcards. Please try again.',
          variant: 'destructive'
        });
        return [];
      }
      
      return data || [];
    }
  });
  
  const handleSelectCard = (id: string, checked: boolean) => {
    setSelectedCards(prev => ({
      ...prev,
      [id]: checked
    }));
  };
  
  const handleSelectAll = (checked: boolean) => {
    if (!flashcards) return;
    
    const newSelectedCards: Record<string, boolean> = {};
    flashcards.forEach(card => {
      // Only allow selection of user's own cards (not preloaded)
      if (!card.is_preloaded) {
        newSelectedCards[card.id] = checked;
      }
    });
    
    setSelectedCards(newSelectedCards);
  };
  
  const handleDeleteSelected = async () => {
    // Get IDs of selected cards
    const selectedIds = Object.entries(selectedCards)
      .filter(([_, selected]) => selected)
      .map(([id]) => id);
    
    if (selectedIds.length === 0) {
      toast({
        title: 'No cards selected',
        description: 'Please select at least one card to delete',
        variant: 'destructive'
      });
      return;
    }
    
    setIsDeleting(true);
    
    try {
      // Get current user
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        toast({
          title: 'Authentication required',
          description: 'You need to be logged in to delete flashcards',
          variant: 'destructive'
        });
        return;
      }
      
      // Delete the selected flashcards (RLS will ensure only user's own cards are deleted)
      const { error } = await supabase
        .from('flashcards')
        .delete()
        .in('id', selectedIds)
        .eq('user_id', user.id);
      
      if (error) throw error;
      
      toast({
        title: 'Success',
        description: `${selectedIds.length} flashcard(s) deleted`,
        duration: 3000
      });
      
      // Reset selection and refetch cards
      setSelectedCards({});
      refetch();
      
    } catch (error) {
      console.error('Error deleting flashcards:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete flashcards. Please try again.',
        variant: 'destructive'
      });
    } finally {
      setIsDeleting(false);
    }
  };
  
  const handleApplyFilters = () => {
    refetch();
  };
  
  const selectedCount = Object.values(selectedCards).filter(Boolean).length;
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="container mx-auto px-4 py-8 flex-grow">
        <div className="flex items-center mb-8">
          <Link to="/flashcards">
            <Button variant="ghost" size="sm" className="mr-2">
              <ArrowLeft className="h-4 w-4 mr-1" />
              Back to Flashcards
            </Button>
          </Link>
          
          <h1 className="text-3xl font-bold">Flashcard Management</h1>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-1">
            <FlashcardFilters 
              filters={filters}
              onFilterChange={setFilters}
              onApply={handleApplyFilters}
            />
            
            <div className="mt-4">
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm">Bulk Actions</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <Button
                      variant="destructive"
                      className="w-full flex items-center gap-2"
                      disabled={selectedCount === 0 || isDeleting}
                      onClick={handleDeleteSelected}
                    >
                      {isDeleting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
                      Delete Selected ({selectedCount})
                    </Button>
                    
                    <Link to="/flashcards/create">
                      <Button
                        variant="secondary"
                        className="w-full flex items-center gap-2"
                      >
                        <Plus className="h-4 w-4" />
                        Create New Card
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
          
          <div className="lg:col-span-3">
            <Card>
              <CardHeader>
                <CardTitle>My Flashcards</CardTitle>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="flex items-center justify-center py-12">
                    <Loader2 className="h-8 w-8 animate-spin mr-2" />
                    <span>Loading flashcards...</span>
                  </div>
                ) : flashcards && flashcards.length > 0 ? (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-12">
                          <Checkbox 
                            checked={
                              flashcards.some(card => !card.is_preloaded) && 
                              flashcards.filter(card => !card.is_preloaded).every(card => selectedCards[card.id])
                            }
                            onCheckedChange={handleSelectAll}
                          />
                        </TableHead>
                        <TableHead>Question</TableHead>
                        <TableHead className="hidden md:table-cell">Subject</TableHead>
                        <TableHead className="hidden md:table-cell">Difficulty</TableHead>
                        <TableHead className="w-20 text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {flashcards.map(card => (
                        <TableRow key={card.id}>
                          <TableCell>
                            {!card.is_preloaded && (
                              <Checkbox 
                                checked={!!selectedCards[card.id]} 
                                onCheckedChange={(checked) => handleSelectCard(card.id, !!checked)}
                              />
                            )}
                          </TableCell>
                          <TableCell className="font-medium">
                            {card.question.length > 100 
                              ? `${card.question.substring(0, 100)}...` 
                              : card.question}
                          </TableCell>
                          <TableCell className="hidden md:table-cell">
                            {card.subject_area && 
                              card.subject_area.charAt(0).toUpperCase() + card.subject_area.slice(1)}
                          </TableCell>
                          <TableCell className="hidden md:table-cell">
                            {card.difficulty && 
                              card.difficulty.charAt(0).toUpperCase() + card.difficulty.slice(1)}
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end">
                              <Link to={`/flashcards/edit/${card.id}`}>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  disabled={card.is_preloaded}
                                  title={card.is_preloaded ? "Cannot edit preloaded cards" : "Edit"}
                                >
                                  <Edit className="h-4 w-4" />
                                </Button>
                              </Link>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                ) : (
                  <div className="bg-muted/30 rounded-lg p-8 text-center">
                    <p className="text-muted-foreground">
                      No flashcards found with the current filters. Try adjusting your filters or create a new card.
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default FlashcardManagement;
