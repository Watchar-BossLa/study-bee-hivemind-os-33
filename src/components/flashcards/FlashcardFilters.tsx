
import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { FlashcardFilter } from '@/components/shared/flashcards/types';

interface FlashcardFiltersProps {
  filters: FlashcardFilter;
  onFilterChange: (filters: FlashcardFilter) => void;
  onApply: () => void;
  compact?: boolean;
}

const subjects = ['accounting', 'business', 'it', 'science', 'medicine', 'engineering', 'general'];
const difficulties = ['beginner', 'intermediate', 'advanced'];

const FlashcardFilters: React.FC<FlashcardFiltersProps> = ({ 
  filters, 
  onFilterChange, 
  onApply,
  compact = false
}) => {
  const handleSubjectChange = (value: string) => {
    onFilterChange({ ...filters, subject: value || undefined });
  };
  
  const handleDifficultyChange = (value: string) => {
    onFilterChange({ ...filters, difficulty: value || undefined });
  };
  
  const handlePreloadedChange = (checked: boolean) => {
    onFilterChange({ ...filters, showPreloaded: checked });
  };

  if (compact) {
    return (
      <div className="flex items-center space-x-2">
        <Select value={filters.subject} onValueChange={handleSubjectChange}>
          <SelectTrigger className="w-[130px]">
            <SelectValue placeholder="Subject" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">All Subjects</SelectItem>
            {subjects.map(subject => (
              <SelectItem key={subject} value={subject}>
                {subject.charAt(0).toUpperCase() + subject.slice(1)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        
        <Select value={filters.difficulty} onValueChange={handleDifficultyChange}>
          <SelectTrigger className="w-[130px]">
            <SelectValue placeholder="Difficulty" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">All Levels</SelectItem>
            {difficulties.map(difficulty => (
              <SelectItem key={difficulty} value={difficulty}>
                {difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        
        <Button variant="outline" size="sm" onClick={onApply}>
          Apply
        </Button>
      </div>
    );
  }

  return (
    <Card>
      <CardContent className="pt-6">
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="subject-filter">Subject Area</Label>
              <Select value={filters.subject} onValueChange={handleSubjectChange}>
                <SelectTrigger id="subject-filter">
                  <SelectValue placeholder="All Subjects" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All Subjects</SelectItem>
                  {subjects.map(subject => (
                    <SelectItem key={subject} value={subject}>
                      {subject.charAt(0).toUpperCase() + subject.slice(1)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label htmlFor="difficulty-filter">Difficulty</Label>
              <Select value={filters.difficulty} onValueChange={handleDifficultyChange}>
                <SelectTrigger id="difficulty-filter">
                  <SelectValue placeholder="All Levels" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All Levels</SelectItem>
                  {difficulties.map(difficulty => (
                    <SelectItem key={difficulty} value={difficulty}>
                      {difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <Checkbox 
              id="preloaded" 
              checked={filters.showPreloaded}
              onCheckedChange={(checked) => handlePreloadedChange(checked as boolean)} 
            />
            <Label htmlFor="preloaded">Include preloaded cards</Label>
          </div>
          
          <Button onClick={onApply}>
            Apply Filters
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default FlashcardFilters;
