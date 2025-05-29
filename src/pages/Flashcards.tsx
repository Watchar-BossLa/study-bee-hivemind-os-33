
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import FlashcardsList from '@/components/shared/flashcards/FlashcardsList';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import FlashcardFilters from '@/components/flashcards/FlashcardFilters';
import { FlashcardFilter } from '@/components/shared/flashcards/types';
import { Loader2, Plus, ListFilter } from 'lucide-react';
import { useFlashcardOperations } from '@/hooks/flashcards/useFlashcardOperations';

const Flashcards = () => {
  const [filters, setFilters] = useState<FlashcardFilter>({
    subject: undefined,
    difficulty: undefined,
    showPreloaded: true
  });

  const { handleEdit } = useFlashcardOperations();

  // Fetch flashcards from Supabase
  const { data: flashcards, isLoading, refetch } = useQuery({
    queryKey: ['flashcards', filters],
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
        return [];
      }
      
      return data || [];
    }
  });

  const handleApplyFilters = () => {
    refetch();
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="container mx-auto px-4 py-8 flex-grow">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
          <h1 className="text-3xl font-bold">My Flashcards</h1>
          <div className="flex flex-wrap gap-3">
            <Link to="/flashcards/review">
              <Button>Start Review</Button>
            </Link>
            <Link to="/flashcards/analytics">
              <Button variant="outline">View Analytics</Button>
            </Link>
            <Link to="/flashcards/manage">
              <Button variant="outline" className="flex items-center gap-2">
                <ListFilter className="h-4 w-4" />
                <span>Manage</span>
              </Button>
            </Link>
            <Link to="/flashcards/create">
              <Button variant="secondary" className="flex items-center gap-2">
                <Plus className="h-4 w-4" />
                <span>Create Card</span>
              </Button>
            </Link>
          </div>
        </div>
        
        <div className="mb-6">
          <FlashcardFilters 
            filters={filters}
            onFilterChange={setFilters}
            onApply={handleApplyFilters}
          />
        </div>
        
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin mr-2" />
            <span>Loading flashcards...</span>
          </div>
        ) : (
          <FlashcardsList 
            flashcards={flashcards || []} 
            onEdit={handleEdit}
            emptyMessage="No flashcards found with the current filters. Try adjusting your filters or create a new card."
          />
        )}
      </main>
      <Footer />
    </div>
  );
};

export default Flashcards;
