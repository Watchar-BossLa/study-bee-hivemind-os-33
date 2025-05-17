
import React from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, X, Bookmark } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { supabase } from '@/integrations/supabase/client';

interface CourseFiltersProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  selectedCategory: string | null;
  onCategoryChange: (value: string) => void;
  selectedLevel: string | null;
  onLevelChange: (value: string) => void;
  onClearFilters: () => void;
  categories: string[];
  levels: string[];
  showBookmarked: boolean;
  onToggleBookmarked: (value: boolean) => void;
}

const CourseFilters: React.FC<CourseFiltersProps> = ({
  searchTerm,
  onSearchChange,
  selectedCategory,
  onCategoryChange,
  selectedLevel,
  onLevelChange,
  onClearFilters,
  categories,
  levels,
  showBookmarked,
  onToggleBookmarked
}) => {
  const showClearButton = searchTerm || selectedCategory || selectedLevel || showBookmarked;
  
  const handleClearFilters = () => {
    onClearFilters();
    onToggleBookmarked(false);
  };

  const checkAuthentication = async () => {
    const { data } = await supabase.auth.getSession();
    return !!data.session;
  };

  const handleBookmarkToggle = async () => {
    if (!showBookmarked) {
      const isAuthenticated = await checkAuthentication();
      if (!isAuthenticated) {
        // User is not authenticated, you might want to handle this differently
        // For now, we'll just log a message and not toggle the filter
        console.log('User is not authenticated');
        return;
      }
    }
    onToggleBookmarked(!showBookmarked);
  };

  return (
    <section className="py-6 border-b">
      <div className="container">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-grow">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search courses..."
              className="pl-10"
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
            />
          </div>
          
          <div className="flex flex-wrap gap-2 items-center">
            <Select value={selectedCategory || ''} onValueChange={onCategoryChange}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all-categories">All Categories</SelectItem>
                {categories.map((category) => (
                  <SelectItem key={category} value={category}>{category}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            <Select value={selectedLevel || ''} onValueChange={onLevelChange}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Level" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all-levels">All Levels</SelectItem>
                {levels.map((level) => (
                  <SelectItem key={level} value={level}>{level}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Button
              variant={showBookmarked ? "default" : "outline"}
              size="sm"
              className="flex items-center gap-1.5"
              onClick={handleBookmarkToggle}
            >
              <Bookmark className="h-4 w-4" />
              <span>Saved</span>
            </Button>
            
            {showClearButton && (
              <Button variant="ghost" onClick={handleClearFilters} size="sm" className="flex items-center gap-1">
                <X className="h-4 w-4" />
                <span>Clear</span>
              </Button>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default CourseFilters;
