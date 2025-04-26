
import React from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, X } from "lucide-react";

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
  levels
}) => {
  const showClearButton = searchTerm || selectedCategory || selectedLevel;

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
          
          <div className="flex gap-2">
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
            
            {showClearButton && (
              <Button variant="ghost" onClick={onClearFilters} className="flex items-center gap-1">
                <X className="h-4 w-4" />
                Clear
              </Button>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default CourseFilters;
